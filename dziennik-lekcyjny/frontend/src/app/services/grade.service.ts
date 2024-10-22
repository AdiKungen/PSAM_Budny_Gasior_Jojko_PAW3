import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/grades';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  constructor(private http: HttpClient) { }

  addForm(data: any): Observable<any> {
    return this.http.post(`${API_URL}/forms`, data);
  }

  addGrade(data: any): Observable<any> {
    return this.http.post(`${API_URL}`, data);
  }

  updateGrade(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, data);
  }

  getAverage(kurs_id: number, uczen_id: number): Observable<any> {
    return this.http.get(`${API_URL}/average/${kurs_id}/${uczen_id}`);
  }
}