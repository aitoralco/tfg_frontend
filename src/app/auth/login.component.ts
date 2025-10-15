import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.local.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  // constructor removed; combined constructor is declared below

  constructor(private loginService: LoginService, private auth: AuthService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.message = 'Signing in...';
    this.loginService.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        // Prefer server-provided username, fallback to submitted
        const username = res?.username || this.username;
        if (username) {
          this.auth.setUser({ username, id: res.id });
        }
        this.message = 'Signed in successfully.';
        // Redirect to home
        this.router.navigate(['/']);
      },
      error: (err) => this.message = 'Login failed: ' + (err?.message || err)
    });
  }
}
