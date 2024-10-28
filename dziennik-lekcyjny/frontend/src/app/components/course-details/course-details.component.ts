import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { GradeService } from '../../services/grade.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
})
export class CourseDetailsComponent implements OnInit {
  kurs_id!: number;
  course: any = {};
  students: any[] = [];
  grades: any[] = [];
  forms: any[] = [];
  availableStudents: any[] = [];
  selectedStudentId: number | null = null;
  attendanceDates: any[] = [];
  attendanceData: any = {};

  newForm: { kurs_id: number | null; typ: string; waga: number; opis: string } = {
    kurs_id: null,
    typ: '',
    waga: 1,
    opis: '',
  };
  gradeValues: { [studentId: number]: { [formId: number]: number | null } } = {};
  
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private studentService: StudentService,
    private gradeService: GradeService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.kurs_id = +this.route.snapshot.paramMap.get('id')!;
    this.newForm.kurs_id = this.kurs_id;
    this.getCourseDetails();
    this.getStudents();
    this.getForms();
    this.getGrades();
    this.getAvailableStudents();
    this.getAttendanceDates();
    this.getAttendanceData();
  }

  getAvailableStudents() {
    this.studentService.getStudentsNotInCourse(this.kurs_id).subscribe(
      (res) => {
        this.availableStudents = res;
      },
      (err) => {
        console.error('Błąd pobierania dostępnych uczniów:', err);
      }
    );
  }

  addStudentToCourse() {
    if (this.selectedStudentId) {
      const data = {
        kurs_id: this.kurs_id,
        uczen_id: this.selectedStudentId,
      };
      this.studentService.addStudentToCourse(data).subscribe(
        (res) => {
          alert('Uczeń został dodany do kursu');
          this.getStudents();
          this.getAvailableStudents();
          this.selectedStudentId = null;
        },
        (err) => {
          console.error('Błąd dodawania ucznia do kursu:', err);
        }
      );
    }
  }

  getCourseDetails() {
    this.courseService.getCourseById(this.kurs_id).subscribe(
      (res) => {
        this.course = res[0];
      },
      (err) => {
        console.error('Błąd pobierania szczegółów kursu:', err);
      }
    );
  }

  getForms() {
    this.gradeService.getForms(this.kurs_id).subscribe(
      (res) => {
        this.forms = res;
        this.initializeGradeValues();
      },
      (err) => {
        console.error('Błąd pobierania form sprawdzania:', err);
      }
    );
  }

  getGrades() {
    this.gradeService.getGradesByCourse(this.kurs_id).subscribe(
      (res) => {
        this.grades = res;
        this.initializeGradeValues();
      },
      (err) => {
        console.error('Błąd pobierania ocen:', err);
      }
    );
  }

  addForm(form: NgForm) {
    this.gradeService.addForm(this.newForm).subscribe(
      (res) => {
        alert('Dodano nową formę sprawdzania');
        this.getForms();
        form.resetForm({
          kurs_id: this.kurs_id,
          typ: '',
          waga: 1,
          opis: '',
        });
      },
      (err) => {
        console.error('Błąd dodawania formy sprawdzania:', err);
      }
    );
  }

  getGradeValue(uczen_id: number, forma_sprawdzania_id: number): number | null {
    const grade = this.grades.find(
      (g) =>
        g.uczen_id === uczen_id && g.forma_sprawdzania_id === forma_sprawdzania_id
    );
    return grade ? grade.wartosc : null;
  }

  getStudents() {
    this.studentService.getStudentsByCourse(this.kurs_id).subscribe(
      (res) => {
        this.students = res;
        this.initializeGradeValues();
      },
      (err) => {
        console.error('Błąd pobierania uczniów:', err);
      }
    );
  }

  initializeGradeValues() {
    if (this.students.length > 0 && this.forms.length > 0) {
      this.students.forEach((student) => {
        this.gradeValues[student.id] = {};
        this.forms.forEach((form) => {
          const existingGrade = this.grades.find(
            (g) => g.uczen_id === student.id && g.forma_sprawdzania_id === form.id
          );
          this.gradeValues[student.id][form.id] = existingGrade
            ? existingGrade.wartosc
            : null;
        });
      });
    }
  }

  getAttendanceDates() {
    this.attendanceService.getAttendanceDatesByCourse(this.kurs_id).subscribe(
      (res) => {
        this.attendanceDates = res.map((item: any) => item.data);
      },
      (err) => {
        console.error('Błąd pobierania dat zajęć:', err);
      }
    );
  }

  getAttendanceData() {
    this.attendanceService.getAttendanceByCourse(this.kurs_id).subscribe(
      (res) => {
        this.attendanceData = {};
        res.forEach((record: any) => {
          const uczen_id = record.uczen_id;
          if (!this.attendanceData[uczen_id]) {
            this.attendanceData[uczen_id] = {
              imie: record.imie,
              nazwisko: record.nazwisko,
              statusy: {},
            };
          }
          this.attendanceData[uczen_id].statusy[record.data] = record.status;
        });
      },
      (err) => {
        console.error('Błąd pobierania obecności uczniów:', err);
      }
    );
  }

  updateAttendance(uczen_id: number, data: string, status: boolean) {
    const attendanceRecord = {
      kurs_id: this.kurs_id,
      uczen_id,
      data,
      status: status ? 1 : 0,
    };
    this.attendanceService.updateAttendanceStatus(attendanceRecord).subscribe(
      (res) => {
        console.log('Status obecności zaktualizowany');
        if (this.attendanceData[uczen_id]) {
          this.attendanceData[uczen_id].statusy[data] = attendanceRecord.status;
        }
      },
      (err) => {
        console.error('Błąd aktualizacji statusu obecności:', err);
      }
    );
  }

  addAttendanceForToday() {
    this.attendanceService.addAttendanceForToday(this.kurs_id).subscribe(
      (res) => {
        alert('Dodano dzisiejszy dzień do obecności');
        this.getAttendanceDates();
        this.getAttendanceData();
      },
      (err) => {
        console.error('Błąd dodawania dzisiejszego dnia do obecności:', err);
      }
    );
  }

  onCheckboxChange(event: Event, uczen_id: number, date: string) {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      const status = target.checked;
      this.updateAttendance(uczen_id, date, status);
    } else {
      console.error('Event target is null');
    }
  }

  saveGrade(uczen_id: number, forma_sprawdzania_id: number) {
    const wartosc = this.gradeValues[uczen_id][forma_sprawdzania_id];
    if (wartosc !== null && wartosc !== undefined) {
      const existingGrade = this.grades.find(
        (g) => g.uczen_id === uczen_id && g.forma_sprawdzania_id === forma_sprawdzania_id
      );
      const gradeData = {
        uczen_id,
        forma_sprawdzania_id,
        wartosc,
        data: new Date().toISOString().substring(0, 10),
      };
      if (existingGrade) {
        this.gradeService.updateGrade(existingGrade.id, { wartosc }).subscribe(
          (res) => {
            alert('Ocena zaktualizowana');
            this.getGrades();
          },
          (err) => {
            console.error('Błąd aktualizacji oceny:', err);
          }
        );
      } else {
        this.gradeService.addGrade(gradeData).subscribe(
          (res) => {
            alert('Ocena dodana');
            this.getGrades();
          },
          (err) => {
            console.error('Błąd dodawania oceny:', err);
          }
        );
      }
    }
  }
}
