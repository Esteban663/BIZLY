import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Movimiento } from '../models/movimiento.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible globalmente en la app
})
export class DashboardService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/bizly';

  // Obtener todos los ingresos de la base de datos
  getIngresos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.API_URL}/ingresos`);
  }

  // Obtener todos los egresos de la base de datos
  getEgresos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.API_URL}/egresos`);
  }

  // Cargar ingresos y egresos al mismo tiempo (Equivalente al forkJoin que tenías antes)
  getDashboardData(): Observable<{ ingresos: Movimiento[], egresos: Movimiento[] }> {
    return forkJoin({
      ingresos: this.getIngresos(),
      egresos: this.getEgresos()
    });
  }

  // Registrar un nuevo ingreso (POST)
  registrarIngreso(movimiento: Movimiento): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.API_URL}/ingresos`, movimiento);
  }

  // Registrar un nuevo egreso (POST)
  registrarEgreso(movimiento: Movimiento): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.API_URL}/egresos`, movimiento);
  }

  updateMovimiento(movimiento: Movimiento): Observable<Movimiento> {
  // Define la URL dependiendo de si es ingreso o egreso basándote en tus endpoints de Spring Boot
  const endpoint = movimiento.tipo === 'INGRESO' ? 'ingresos' : 'egresos';
  
  // Ejecuta la petición PUT apuntando al ID específico: http://localhost:8080/bizly/ingresos/5
  return this.http.put<Movimiento>(`http://localhost:8080/bizly/${endpoint}/${movimiento.id}`, movimiento);
}
}