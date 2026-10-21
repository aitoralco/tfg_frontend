import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Observable, firstValueFrom } from 'rxjs';

import { authGuard, adminGuard } from './auth.guard';
import { User } from '../models/user-model';

const user: User = {
  id: 2,
  username: 'jane',
  email: 'jane@example.com',
  role: { id: 2, name: 'user' },
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
};

const admin: User = { ...user, id: 1, role: { id: 1, name: 'admin' } };

describe('auth guards', () => {
  function run(guard: typeof authGuard, loggedUser: User | null): Promise<boolean | UrlTree> {
    localStorage.clear();
    if (loggedUser) localStorage.setItem('user_data', JSON.stringify(loggedUser));

    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });

    const result = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    return firstValueFrom(result as Observable<boolean | UrlTree>);
  }

  function url(result: boolean | UrlTree): string {
    return TestBed.inject(Router).serializeUrl(result as UrlTree);
  }

  describe('authGuard', () => {
    it('should redirect guests to /login', async () => {
      expect(url(await run(authGuard, null))).toBe('/login');
    });

    it('should allow logged in users', async () => {
      expect(await run(authGuard, user)).toBe(true);
    });
  });

  describe('adminGuard', () => {
    it('should redirect guests to /login', async () => {
      expect(url(await run(adminGuard, null))).toBe('/login');
    });

    it('should redirect non-admin users to /', async () => {
      expect(url(await run(adminGuard, user))).toBe('/');
    });

    it('should allow admins', async () => {
      expect(await run(adminGuard, admin)).toBe(true);
    });
  });
});
