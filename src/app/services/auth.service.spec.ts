import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { User } from '../models/user-model';
import { environment } from '../../environments/environment';

const api = environment.apiUrl;

const user: User = {
  id: 2,
  username: 'jane',
  email: 'jane@example.com',
  role: { id: 2, name: 'user' },
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
};

describe('AuthService', () => {
  let http: HttpTestingController;

  function setup(): AuthService {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthService);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => http.verify());

  it('should start without user when storage is empty', () => {
    const service = setup();
    expect(service.getToken()).toBeNull();
    expect(service.isAdmin).toBe(false);
  });

  it('should restore the user saved in localStorage', () => {
    localStorage.setItem('user_data', JSON.stringify({ ...user, role: { id: 1, name: 'admin' } }));
    const service = setup();
    expect(service.isAdmin).toBe(true);
  });

  it('should store token and user after login', () => {
    const service = setup();
    let emitted: User | null = null;
    service.currentUser$.subscribe(u => (emitted = u));

    service.login({ username: 'jane', password: 'secret' }).subscribe();

    const req = http.expectOne(`${api}/users/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'jane', password: 'secret' });
    req.flush({ access_token: 'jwt-token', token_type: 'bearer', user });

    expect(service.getToken()).toBe('jwt-token');
    expect(JSON.parse(localStorage.getItem('user_data')!)).toEqual(user);
    expect(emitted).toEqual(user);
    expect(service.isAdmin).toBe(false);
  });

  it('should not store anything when login fails', () => {
    const service = setup();
    service.login({ username: 'jane', password: 'wrong' }).subscribe({ error: () => {} });

    http.expectOne(`${api}/users/login`).flush({ detail: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(service.getToken()).toBeNull();
  });

  it('should clear the session and go home on logout', () => {
    localStorage.setItem('token', 'jwt-token');
    localStorage.setItem('user_data', JSON.stringify(user));
    const service = setup();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user_data')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not call the API on restoreSession without token', () => {
    const service = setup();
    service.restoreSession();
    http.expectNone(`${api}/users/me`);
  });

  it('should refresh the user on restoreSession', () => {
    localStorage.setItem('token', 'jwt-token');
    const service = setup();

    service.restoreSession();
    http.expectOne(`${api}/users/me`).flush({ ...user, username: 'jane2' });

    expect(JSON.parse(localStorage.getItem('user_data')!).username).toBe('jane2');
  });

  it('should clear the session when restoreSession fails', () => {
    localStorage.setItem('token', 'expired');
    const service = setup();

    service.restoreSession();
    http.expectOne(`${api}/users/me`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(service.getToken()).toBeNull();
  });
});
