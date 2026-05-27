import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(control: AbstractControl) {
  const pass    = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
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
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre:          ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6),
                             Validators.pattern(/(?=.*[A-Z])(?=.*\d)/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatch });
  }

  get nombre()          { return this.registerForm.get('nombre')!; }
  get email()           { return this.registerForm.get('email')!; }
  get password()        { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading  = true;
    this.errorMsg = '';

    const { nombre, email, password } = this.registerForm.value;
    this.authService.register({ nombre, email, password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err.error?.mensaje ?? 'Error al registrar usuario';
        this.loading  = false;
      }
    });
  }
}