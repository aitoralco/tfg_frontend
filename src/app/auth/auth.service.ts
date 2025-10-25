import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInterface as CurrentUser } from './userInterface';

const STORAGE_KEY = 'tfg_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<CurrentUser | null>(this.readFromStorage());

  get user$(): Observable<CurrentUser | null> {
    return this.userSubject.asObservable();
  }

  get currentUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  setUser(username: string, user_id: number, user_role: number) {
    const user: CurrentUser = { username: username, id: user_id, role: user_role};
    this.userSubject.next(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }

  clearUser() {
    this.userSubject.next(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  private readFromStorage(): CurrentUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }
}
