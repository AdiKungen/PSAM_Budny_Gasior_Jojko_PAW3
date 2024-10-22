import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private http: HttpClient) { }

  markAttendance(data: any): Observable<any> {
    return this.http.post(`${API_URL}`, data);
  }

  getAttendanceHistory(kurs_id: number, uczen_id: number): Observable<any> {
    return this.http.get(`${API_URL}/history/${kurs_id}/${uczen_id}`);
  }
}