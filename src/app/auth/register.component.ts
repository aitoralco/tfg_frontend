import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from './register.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  message = '';

  constructor(private registerService: RegisterService, private auth: AuthService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.message = 'Registering...';
    this.registerService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const username = res?.username || this.username;
        if (username) {
          this.auth.setUser({ username, id: res.id });
        }
        this.message = 'Account created successfully.';
        // Redirect to home
        this.router.navigate(['/']);
      },
      error: (err) => this.message = 'Registration failed: ' + (err?.message || err)
    });
  }
}
