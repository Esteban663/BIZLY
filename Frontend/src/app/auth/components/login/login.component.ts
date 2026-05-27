import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(control: AbstractControl) {
  const pass    = control.get('contrasena')?.value;
  const confirm = control.get('confirmar')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  // ── Login ──────────────────────────────────────
  loginForm!: FormGroup;
  loginLoading  = false;
  loginError    = '';

  // ── Registro ───────────────────────────────────
  registerForm!: FormGroup;
  registerLoading = false;
  registerError   = '';
  registerSuccess = '';
  showModal       = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo:     ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      nombre:     ['', [Validators.required, Validators.minLength(2)]],
      correo:     ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmar:  ['', Validators.required]
    }, { validators: passwordsMatch });
  }

  // Getters login
  get lCorreo()     { return this.loginForm.get('correo')!; }
  get lContrasena() { return this.loginForm.get('contrasena')!; }

  // Getters registro
  get rNombre()     { return this.registerForm.get('nombre')!; }
  get rCorreo()     { return this.registerForm.get('correo')!; }
  get rContrasena() { return this.registerForm.get('contrasena')!; }
  get rConfirmar()  { return this.registerForm.get('confirmar')!; }

  // ── Abrir / cerrar modal ────────────────────────
  abrirModal(): void {
    this.registerForm.reset();
    this.registerError   = '';
    this.registerSuccess = '';
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
  }

  // ── Submit login ───────────────────────────────
  onLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loginLoading = true;
    this.loginError   = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loginError   = err.error?.error ?? 'Correo o contraseña incorrectos';
        this.loginLoading = false;
      }
    });
  }

  // ── Submit registro ────────────────────────────
  onRegister(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.registerLoading = true;
    this.registerError   = '';
    this.registerSuccess = '';

    const { nombre, correo, contrasena } = this.registerForm.value;
    this.authService.register({ nombre, correo, contrasena, rol: 'USER' }).subscribe({
      next: () => {
        this.registerSuccess = '¡Cuenta creada! Ya puedes iniciar sesión.';
        this.registerLoading = false;
        this.registerForm.reset();
        setTimeout(() => this.cerrarModal(), 2000);
      },
      error: (err) => {
        this.registerError   = err.error?.error ?? 'Error al registrar. Intenta de nuevo.';
        this.registerLoading = false;
      }
    });
  }
}