import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  newStudent = {
    imie: '',
    nazwisko: '',
  };

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().subscribe(
      (res) => {
        this.students = res;
      },
      (err) => {
        console.error('Błąd pobierania uczniów:', err);
      }
    );
  }

  addStudent(studentForm: NgForm) {
    if (studentForm.invalid) {
      return;
    }

    this.studentService.addStudent(this.newStudent).subscribe(
      (res) => {
        alert('Uczeń dodany');
        this.getStudents();
        studentForm.resetForm();
        this.newStudent = {
          imie: '',
          nazwisko: '',
        };
      },
      (err) => {
        console.error('Błąd dodawania ucznia:', err);
      }
    );
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(
      (res) => {
        alert('Uczeń usunięty');
        this.getStudents();
      },
      (err) => {
        console.error('Błąd usuwania ucznia:', err);
      }
    );
  }
}