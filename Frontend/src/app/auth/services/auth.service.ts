import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap, throwError } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly USER_KEY = 'auth_user';
  private apiUrl = environment.apiUrl;

  isAuthenticated = signal<boolean>(this.hasSession());
  currentUser     = signal<AuthResponse | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  // Registro → POST /usuarios
  register(data: RegisterRequest): Observable<AuthResponse> {
    const payload = { ...data, rol: 'USER' };
    return this.http.post<AuthResponse>(`${this.apiUrl}/usuarios`, payload)
      .pipe(tap(res => this.saveSession(res)));
  }

  // Login → GET /usuarios y filtra por correo+contrasena
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.get<AuthResponse[]>(`${this.apiUrl}/usuarios`).pipe(
      map(usuarios => {
        const found = usuarios.find(
          u => u.correo === credentials.correo &&
               u.contrasena === credentials.contrasena
        );
        if (!found) throw { error: { mensaje: 'Correo o contraseña incorrectos' } };
        return found;
      }),
      tap(res => this.saveSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const user = this.getStoredUser();
    return user ? `session-${user.id}` : null;
  }

  private saveSession(user: AuthResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.isAuthenticated.set(true);
    this.currentUser.set(user);
  }

  private hasSession(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  private getStoredUser(): AuthResponse | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}