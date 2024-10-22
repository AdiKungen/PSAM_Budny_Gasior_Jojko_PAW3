import { Component, OnInit } from '@angular/core';
import { GradeService } from '../../services/grade.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {

  kurs_id = 1; // Identyfikator kursu (do ustalenia)
  students: any[] = [];
  forms: any[] = [];
  newForm = {
    kurs_id: this.kurs_id,
    typ: '',
    waga: 0
  };
  newGrade = {
    uczen_id: null,
    forma_sprawdzania_id: null,
    wartosc: 0,
    data: ''
  };
  selectedStudentId: number | null = null;
  average: number | null = null;

  constructor(private gradeService: GradeService, private studentService: StudentService) { }

  ngOnInit(): void {
    this.getStudents();
    //this.getForms();
  }

  getStudents() {
    this.studentService.getStudents().subscribe(
      res => {
        this.students = res;
      },
      err => {
        console.error('Błąd pobierania uczniów:', err);
      }
    );
  }

  /*
  getForms() {
    // Pobierz formy sprawdzania wiedzy dla danego kursu
    // Musisz dodać odpowiedni endpoint w backendzie i metodę w GradeService
    // Na przykład:
    this.gradeService.getForms(this.kurs_id).subscribe(
      res => {
        this.forms = res;
      },
      err => {
        console.error('Błąd pobierania form sprawdzania:', err);
      }
    );
  }
  

  addForm() {
    this.gradeService.addForm(this.newForm).subscribe(
      res => {
        alert('Forma sprawdzania dodana');
        this.getForms();
      },
      err => {
        console.error('Błąd dodawania formy sprawdzania:', err);
      }
    );
  }
  */

  addGrade() {
    this.gradeService.addGrade(this.newGrade).subscribe(
      res => {
        alert('Ocena dodana');
        // Możesz odświeżyć listę ocen
      },
      err => {
        console.error('Błąd dodawania oceny:', err);
      }
    );
  }

  calculateAverage() {
    if (this.selectedStudentId) {
      this.gradeService.getAverage(this.kurs_id, this.selectedStudentId).subscribe(
        res => {
          this.average = res.srednia;
        },
        err => {
          console.error('Błąd obliczania średniej:', err);
        }
      );
    }
  }

}