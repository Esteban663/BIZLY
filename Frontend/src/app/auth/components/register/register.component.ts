import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(control: AbstractControl) {
  const pass    = control.get('contrasena')?.value;
  const confirm = control.get('confirmar')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  loading  = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre:     ['', [Validators.required, Validators.minLength(2)]],
      correo:     ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmar:  ['', Validators.required]
    }, { validators: passwordsMatch });
  }

  get nombre()     { return this.registerForm.get('nombre')!; }
  get correo()     { return this.registerForm.get('correo')!; }
  get contrasena() { return this.registerForm.get('contrasena')!; }
  get confirmar()  { return this.registerForm.get('confirmar')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';

    const { nombre, correo, contrasena } = this.registerForm.value;
    this.authService.register({ nombre, correo, contrasena, rol: 'USER' }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err.error?.mensaje ?? 'Error al registrar. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }
}