import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Upload a video file. Sends multipart/form-data with field 'file'.
   */
  upload(file: File): Observable<HttpEvent<any>> {
    const url = new URL('videos/upload', this.base).toString();
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(url, fd, { reportProgress: true, observe: 'events' });
  }

  /**
   * Build a direct URL to stream a video by id. Browsers will send Range requests.
   */
  getVideoUrl(id: number): string {
    return new URL(`videos/${id}`, this.base).toString();
  }

  /**
   * Get video previews page. Returns an object like { previews: [...] }
   */
  getPreviews(offset = 0, limit = 10, size = 1024) {
    const url = new URL('videos/previews', this.base);
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('size', String(size));
    return this.http.get<{ previews: Array<any> }>(url.toString());
  }

  getPreviewsUser(user_id: number, offset = 0, limit = 10, size = 1024) {
    const url = new URL('videos/previews', this.base);
    url.searchParams.set('user_id', String(user_id));
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('size', String(size));
    return this.http.get<{ previews: Array<any> }>(url.toString());
  }
}
