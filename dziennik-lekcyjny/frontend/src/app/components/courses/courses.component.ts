import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  newCourse = {
    nazwa: '',
    data_rozpoczecia: '',
  };

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      (res) => {
        this.courses = res;
      },
      (err) => {
        console.error('Błąd pobierania kursów:', err);
      }
    );
  }

  createCourse() {
    this.courseService.createCourse(this.newCourse).subscribe(
      (res) => {
        alert('Kurs utworzony');
        this.getCourses();
      },
      (err) => {
        console.error('Błąd tworzenia kursu:', err);
      }
    );
  }

  goToCourseDetails(kurs_id: number) {
    this.router.navigate(['/courses', kurs_id]);
  }
}
