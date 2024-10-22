import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/courses';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient) { }

  createCourse(data: any): Observable<any> {
    return this.http.post(`${API_URL}`, data);
  }

  getCourses(): Observable<any> {
    return this.http.get(`${API_URL}`);
  }
}