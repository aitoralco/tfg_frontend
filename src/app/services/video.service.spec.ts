import { TestBed } from '@angular/core/testing';
import { HttpEventType, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { VideoService } from './video.service';
import { environment } from '../../environments/environment';

const api = environment.apiUrl;

describe('VideoService', () => {
  let service: VideoService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VideoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should build stream URLs without token for guests', () => {
    expect(service.getVideoUrl(42)).toBe(`${api}/videos/42`);
    expect(service.getDwStreamUrl(42)).toBe(`${api}/videos/42/dw/stream`);
  });

  it('should add the token to stream URLs when logged in', () => {
    localStorage.setItem('token', 'a.b+c');
    expect(service.getVideoUrl(42)).toBe(`${api}/videos/42?token=a.b%2Bc`);
    expect(service.getDwStreamUrl(42)).toBe(`${api}/videos/42/dw/stream?token=a.b%2Bc`);
  });

  it('should request previews with pagination and optional user filter', () => {
    service.getPreviews(20, 10, 3).subscribe();
    const req = http.expectOne(r => r.url === `${api}/videos/previews`);
    expect(req.request.params.get('offset')).toBe('20');
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('user_id')).toBe('3');
    req.flush({ previews: [], total: 0, offset: 20, limit: 10 });
  });

  it('should only send the search filters that are set', () => {
    service.search({ q: 'humpback', date_to: '2026-12-31' }).subscribe();
    const req = http.expectOne(r => r.url === `${api}/videos/search`);
    expect(req.request.params.get('q')).toBe('humpback');
    expect(req.request.params.get('date_to')).toBe('2026-12-31');
    expect(req.request.params.has('uploader')).toBe(false);
    expect(req.request.params.get('offset')).toBe('0');
    req.flush({ previews: [], total: 0, offset: 0, limit: 10 });
  });

  it('should send filters and sorting for my videos', () => {
    service.getMine({ status_id: 0, sort_by: 'title', order: 'asc' }).subscribe();
    const req = http.expectOne(r => r.url === `${api}/videos/mine`);
    expect(req.request.params.get('status_id')).toBe('0');
    expect(req.request.params.get('sort_by')).toBe('title');
    expect(req.request.params.get('order')).toBe('asc');
    expect(req.request.params.get('limit')).toBe('50');
    req.flush({ previews: [], total: 0, offset: 0, limit: 50 });
  });

  it('should upload the video as multipart form data with progress events', () => {
    const file = new File(['data'], 'whale.mp4', { type: 'video/mp4' });
    const events: HttpEventType[] = [];
    service.upload('Title', 'Desc', file).subscribe(e => events.push(e.type));

    const req = http.expectOne(`${api}/videos/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.reportProgress).toBe(true);
    const body = req.request.body as FormData;
    expect(body.get('video_name')).toBe('Title');
    expect(body.get('description')).toBe('Desc');
    expect((body.get('file') as File).name).toBe('whale.mp4');
    req.flush({ message: 'Video uploaded successfully', video_id: 1 });

    expect(events).toContain(HttpEventType.Response);
  });

  it('should request processing results', () => {
    service.getVideoInfo(42).subscribe();
    http.expectOne(`${api}/videos/42/info`).flush({});

    service.getEwCrops(42, 20).subscribe();
    const ew = http.expectOne(r => r.url === `${api}/videos/42/ew/crops`);
    expect(ew.request.params.get('offset')).toBe('20');
    expect(ew.request.params.get('limit')).toBe('20');
    ew.flush({ crops: [], total: 0, offset: 20, limit: 20 });

    service.getDemCrops(42).subscribe();
    http.expectOne(r => r.url === `${api}/videos/42/dem/crops`).flush({ crops: [], total: 0, offset: 0, limit: 20 });
  });

  it('should update and delete videos', () => {
    service.update(42, { shared: false }).subscribe();
    const patch = http.expectOne(`${api}/videos/42`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ shared: false });
    patch.flush({});

    service.delete(42).subscribe();
    const del = http.expectOne(`${api}/videos/42`);
    expect(del.request.method).toBe('DELETE');
    del.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should share the selected video', () => {
    let selected: unknown = null;
    service.selectedVideo$.subscribe(v => (selected = v));
    const video = { id: 1 } as any;
    service.setSelectedVideo(video);
    expect(selected).toBe(video);
  });
});
