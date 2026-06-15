import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user-model';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  private currentUser = new BehaviorSubject<User | null>(this.getUserFromStorage());

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  get isAdmin(): boolean {
    return this.currentUser.value?.role?.name === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): User | null {
    const raw = localStorage.getItem('user_data');
    return raw ? JSON.parse(raw) : null;
  }

  login(body: { username: string; password: string }) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, body).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user_data', JSON.stringify(res.user));
        this.currentUser.next(res.user);
      })
    );
  }

  register(body: { username: string; email: string; password: string }) {
    return this.http.post<User>(`${this.apiUrl}/users/register`, body);
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/']);
  }

  updateCurrentUser(user: User) {
    localStorage.setItem('user_data', JSON.stringify(user));
    this.currentUser.next(user);
  }

  clearSession() {
    localStorage.clear();
    this.currentUser.next(null);
  }

  restoreSession() {
    if (!this.getToken()) return;
    this.http.get<User>(`${this.apiUrl}/users/me`).subscribe({
      next: user => {
        localStorage.setItem('user_data', JSON.stringify(user));
        this.currentUser.next(user);
      },
      error: () => this.clearSession(),
    });
  }
}
