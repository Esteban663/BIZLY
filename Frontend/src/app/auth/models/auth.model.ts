export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
}

export interface AuthResponse {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
}