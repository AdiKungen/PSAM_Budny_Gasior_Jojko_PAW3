import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/attendance';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private http: HttpClient) {}

  getAttendanceDatesByCourse(kurs_id: number): Observable<any> {
    return this.http.get(`${API_URL}/dates/${kurs_id}`);
  }

  getAttendanceByCourse(kurs_id: number): Observable<any> {
    return this.http.get(`${API_URL}/${kurs_id}`);
  }

  updateAttendanceStatus(data: any): Observable<any> {
    return this.http.put(`${API_URL}/update`, data);
  }

  addAttendanceForToday(kurs_id: number): Observable<any> {
    return this.http.post(`${API_URL}/add-today`, { kurs_id });
  }
}