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
  user_id = 0;
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
        const user_id = res?.id || this.user_id;
        const user_role = res?.role.role_number || 0;
        if (username) {
          this.auth.setUser(username, user_id, user_role);
        }
        this.message = 'Signed in successfully.';
        // Redirect to home
        this.router.navigate(['/']);
      },
      error: (err) => this.message = 'Login failed: ' + (err?.message || err)
    });
  }
}
