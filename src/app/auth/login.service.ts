import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginPayload {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<any> {
    const url = new URL('users/login', this.base).toString();
    return this.http.post(url, payload);
  }
}
