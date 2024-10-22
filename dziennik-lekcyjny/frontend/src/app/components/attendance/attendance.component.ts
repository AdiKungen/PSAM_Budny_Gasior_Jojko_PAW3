import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  kurs_id = 1; // Identyfikator kursu (możesz pobrać z parametrów routingu)
  data = new Date().toISOString().substring(0, 10);
  students: any[] = [];
  attendanceData: any[] = [];

  constructor(private attendanceService: AttendanceService, private studentService: StudentService) { }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().subscribe(
      res => {
        this.students = res;
        this.initializeAttendance();
      },
      err => {
        console.error('Błąd pobierania uczniów:', err);
      }
    );
  }

  initializeAttendance() {
    this.attendanceData = this.students.map(student => ({
      uczen_id: student.id,
      status: false,
      data: this.data
    }));
  }

  markAttendance() {
    const payload = {
      kurs_id: this.kurs_id,
      obecnosci: this.attendanceData
    };

    this.attendanceService.markAttendance(payload).subscribe(
      res => {
        alert('Obecność zapisana');
      },
      err => {
        console.error('Błąd zapisywania obecności:', err);
      }
    );
  }

}