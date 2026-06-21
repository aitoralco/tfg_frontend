import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password } = this.form.value;
    this.authService
      .register({ username: username!, email: email!, password: password! })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => {
          this.errorMessage =
            err.error?.detail ??
            (err.status === 422
              ? 'Invalid data. Check your fields.'
              : 'Registration failed. Try again.');
        },
      });
  }
}
