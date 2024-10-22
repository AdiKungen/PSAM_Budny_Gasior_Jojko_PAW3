import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/students';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) { }

  addStudent(data: any): Observable<any> {
    return this.http.post(`${API_URL}`, data);
  }

  updateStudent(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, data);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  getStudents(): Observable<any> {
    return this.http.get(`${API_URL}`);
  }
}