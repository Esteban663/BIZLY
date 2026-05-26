import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading   = false;
  errorMsg  = '';

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email()    { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const email = this.loginForm.value.email;
  const password = this.loginForm.value.password;

  // Usuario de prueba
  if (email === 'admin@bizly.com' && password === '123456') {

    this.errorMsg = '';
    this.router.navigate(['/productos']);

  } else {

    this.errorMsg = 'Credenciales incorrectas';

  }
}
}