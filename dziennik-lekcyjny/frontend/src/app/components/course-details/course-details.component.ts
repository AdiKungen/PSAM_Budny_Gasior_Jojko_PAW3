// src/app/components/course-details/course-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { GradeService } from '../../services/grade.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
})
export class CourseDetailsComponent implements OnInit {
  kurs_id!: number;
  course: any = {};
  students: any[] = [];
  grades: any[] = [];
  forms: any[] = [];

  // Zmienna do przechowywania nowych form sprawdzania
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
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.kurs_id = +this.route.snapshot.paramMap.get('id')!;
    this.newForm.kurs_id = this.kurs_id;
    this.getCourseDetails();
    this.getStudents();
    this.getForms();
    this.getGrades();
  }

  getCourseDetails() {
    // Pobierz szczegóły kursu
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
    // Pobierz formy sprawdzania dla kursu
    this.gradeService.getForms(this.kurs_id).subscribe(
      (res) => {
        this.forms = res;
        this.initializeGradeValues(); // Inicjalizujemy newGradeValues po pobraniu form
      },
      (err) => {
        console.error('Błąd pobierania form sprawdzania:', err);
      }
    );
  }

  getGrades() {
    // Pobierz oceny dla kursu
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
    // Dodaj nową formę sprawdzania
    this.gradeService.addForm(this.newForm).subscribe(
      (res) => {
        alert('Dodano nową formę sprawdzania');
        this.getForms();
        // Resetujemy formularz
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
    // Pobierz listę uczniów zapisanych na kurs
    this.studentService.getStudentsByCourse(this.kurs_id).subscribe(
      (res) => {
        this.students = res;
        this.initializeGradeValues(); // Inicjalizujemy newGradeValues po pobraniu uczniów
      },
      (err) => {
        console.error('Błąd pobierania uczniów:', err);
      }
    );
  }

  initializeGradeValues() {
    // Upewnij się, że students, forms i grades są załadowane
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
        // Aktualizuj istniejącą ocenę
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
        // Dodaj nową ocenę
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
