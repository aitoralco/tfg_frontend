import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaivourSubject mantiene el estado del login actual
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  // Para guardar el user
  private currentUser = new BehaviorSubject<User | null>(this.getUserFromStorage());

  // Helper para obtener los datos del usuario del localStorage al refrescar
  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  }

  // Observable para que los componentes sepan quien está logged
  get currentUser$() {
    return this.currentUser.asObservable();
  }

  login(token: string, userData: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));

    this.loggedIn.next(true);
    this.currentUser.next(userData);
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }
}
