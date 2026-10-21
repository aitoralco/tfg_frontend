import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { VideosComponent } from './videos';
import { VideoPreview, VideoPreviewResponse } from '../../models/video-model';
import { environment } from '../../../environments/environment';

const api = environment.apiUrl;

function page(count: number, total: number, offset = 0): VideoPreviewResponse {
  const previews: VideoPreview[] = Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    title: `Video ${offset + i + 1}`,
    description: null,
    file_name: 'a.mp4',
    uploader: 'jane',
    created_at: '2026-01-01T00:00:00',
    preview: null,
    shared: true,
    status: { id: 7, status_name: 'processed' },
  }));
  return { previews, total, offset, limit: 10 };
}

describe('VideosComponent', () => {
  let fixture: ComponentFixture<VideosComponent>;
  let component: VideosComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VideosComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // ngOnInit
  });

  afterEach(() => http.verify());

  it('should load the first page of previews on init', () => {
    const req = http.expectOne(r => r.url === `${api}/videos/previews`);
    expect(req.request.params.get('offset')).toBe('0');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(page(10, 25));

    expect(component.videos.length).toBe(10);
    expect(component.total).toBe(25);
    expect(component.totalPages).toBe(3);
    expect(component.isLoading).toBe(false);
  });

  it('should request the right offset when changing page', () => {
    http.expectOne(r => r.url === `${api}/videos/previews`).flush(page(10, 25));

    component.goToPage(2);
    const req = http.expectOne(r => r.url === `${api}/videos/previews`);
    expect(req.request.params.get('offset')).toBe('20');
    req.flush(page(5, 25, 20));

    expect(component.currentPage).toBe(2);
    expect(component.videos.length).toBe(5);
  });

  it('should ignore pages out of range', () => {
    http.expectOne(r => r.url === `${api}/videos/previews`).flush(page(10, 25));

    component.goToPage(3);
    component.goToPage(-1);

    http.expectNone(r => r.url === `${api}/videos/previews`);
    expect(component.currentPage).toBe(0);
  });

  it('should show a connection error when the server is unreachable', () => {
    http
      .expectOne(r => r.url === `${api}/videos/previews`)
      .error(new ProgressEvent('error'), { status: 0 });

    expect(component.error).toBe('Cannot connect to server.');
    expect(component.videos).toEqual([]);
  });

  it('should call search with only the filters that are set', () => {
    http.expectOne(r => r.url === `${api}/videos/previews`).flush(page(10, 25));

    component.searchQuery = 'humpback';
    component.searchUploader = 'jane';
    component.onSearch();

    const req = http.expectOne(r => r.url === `${api}/videos/search`);
    expect(req.request.params.get('q')).toBe('humpback');
    expect(req.request.params.get('uploader')).toBe('jane');
    expect(req.request.params.has('date_from')).toBe(false);
    req.flush(page(2, 2));

    expect(component.isSearchMode).toBe(true);
    expect(component.total).toBe(2);
  });

  it('should go back to previews when searching without filters', () => {
    http.expectOne(r => r.url === `${api}/videos/previews`).flush(page(10, 25));

    component.onSearch();

    http.expectOne(r => r.url === `${api}/videos/previews`).flush(page(10, 25));
    http.expectNone(r => r.url === `${api}/videos/search`);
    expect(component.isSearchMode).toBe(false);
  });

  it('should reset filters and reload previews on clearSearch', () => {
    http.expectOne(r => r.url === `${api}/videos/previews`).flush(page(10, 25));
    component.searchQuery = 'humpback';
    component.onSearch();
    http.expectOne(r => r.url === `${api}/videos/search`).flush(page(2, 2));

    component.clearSearch();

    http.expectOne(r => r.url === `${api}/videos/previews`).flush(page(10, 25));
    expect(component.searchQuery).toBe('');
    expect(component.isSearchMode).toBe(false);
  });
});
