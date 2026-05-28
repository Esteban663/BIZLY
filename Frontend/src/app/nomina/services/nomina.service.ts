import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nomina } from '../models/nomina.model';

@Injectable({ providedIn: 'root' })
export class NominaService {
  private readonly apiUrl = 'http://localhost:8080/bizly/nomina';

  constructor(private http: HttpClient) {}

  listar(): Observable<Nomina[]> {
    return this.http.get<Nomina[]>(this.apiUrl);
  }

  agregar(nomina: Nomina): Observable<Nomina> {
    return this.http.post<Nomina>(this.apiUrl, nomina);
  }

  actualizar(id: number, nomina: Nomina): Observable<Nomina> {
    return this.http.put<Nomina>(`${this.apiUrl}/${id}`, nomina);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}