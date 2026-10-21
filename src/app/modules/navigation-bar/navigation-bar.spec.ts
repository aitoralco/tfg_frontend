import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { NavigationBar } from './navigation-bar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user-model';

const user: User = {
  id: 2,
  username: 'jane',
  email: 'jane@example.com',
  role: { id: 2, name: 'user' },
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
};

const admin: User = { ...user, id: 1, username: 'root', role: { id: 1, name: 'admin' } };

describe('NavigationBar', () => {
  let fixture: ComponentFixture<NavigationBar>;

  async function render(loggedUser: User | null) {
    localStorage.clear();
    if (loggedUser) localStorage.setItem('user_data', JSON.stringify(loggedUser));

    await TestBed.configureTestingModule({
      imports: [NavigationBar],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationBar);
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function buttons(): string[] {
    const el = fixture.nativeElement as HTMLElement;
    return Array.from(el.querySelectorAll('.nav-user button')).map(b => b.textContent!.trim());
  }

  it('should show Register and Login for guests', async () => {
    await render(null);
    expect(buttons()).toEqual(['Register', 'Login']);
  });

  it('should show the username and user buttons for a logged in user', async () => {
    await render(user);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.welcome-text')?.textContent).toContain('jane');
    expect(buttons()).toEqual(['My Videos', 'Logout']);
  });

  it('should show the Admin button only for admins', async () => {
    await render(admin);
    expect(buttons()).toEqual(['Admin', 'My Videos', 'Logout']);
  });

  it('should call logout when clicking Logout', async () => {
    await render(user);
    const authService = TestBed.inject(AuthService);
    const logout = vi.spyOn(authService, 'logout').mockImplementation(() => {});

    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.btn-logout') as HTMLButtonElement).click();

    expect(logout).toHaveBeenCalled();
  });
});
