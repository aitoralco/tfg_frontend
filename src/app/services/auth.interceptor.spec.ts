import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should not add the header when there is no token', () => {
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add the Bearer token when logged in', () => {
    localStorage.setItem('token', 'jwt-token');
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush({});
  });

  it('should clear the session and go to /login on 401', () => {
    localStorage.setItem('token', 'expired');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    let status = 0;

    http.get('/test').subscribe({ error: err => (status = err.status) });
    httpMock.expectOne('/test').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(localStorage.getItem('token')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should keep the session on other errors', () => {
    localStorage.setItem('token', 'jwt-token');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');

    http.get('/test').subscribe({ error: () => {} });
    httpMock.expectOne('/test').flush(null, { status: 500, statusText: 'Server Error' });

    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(navigate).not.toHaveBeenCalled();
  });
});
