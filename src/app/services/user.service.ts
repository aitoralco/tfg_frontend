import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user-model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMe() {
    return this.http.get<User>(`${this.apiUrl}/users/me`);
  }

  updateMe(data: {
    current_password: string;
    username?: string;
    email?: string;
    new_password?: string;
  }) {
    return this.http.patch<User>(`${this.apiUrl}/users/me`, data);
  }

  deleteMe(current_password: string) {
    return this.http.delete(`${this.apiUrl}/users/me`, {
      body: { current_password },
      observe: 'response',
    });
  }

  getAllUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/users/all`);
  }

  getUserById(userId: number) {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(
    userId: number,
    data: { username?: string; email?: string; password?: string; role_id?: number }
  ) {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, data);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { observe: 'response' });
  }
}
