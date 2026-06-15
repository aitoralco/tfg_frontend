import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { VideoPreview, VideoPreviewResponse, Video, VideoInfo, CropResponse } from '../models/video-model';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly http = inject(HttpClient);
  readonly apiUrl = environment.apiUrl;

  private _selectedVideo = new BehaviorSubject<VideoPreview | null>(null);
  selectedVideo$ = this._selectedVideo.asObservable();

  setSelectedVideo(video: VideoPreview) {
    this._selectedVideo.next(video);
  }

  getPreviews(offset = 0, limit = 10, userId?: number) {
    let params = new HttpParams().set('offset', offset).set('limit', limit).set('size', 131072);
    if (userId !== undefined) params = params.set('user_id', userId);
    return this.http.get<VideoPreviewResponse>(`${this.apiUrl}/videos/previews`, { params });
  }

  getMine(filters: {
    offset?: number; limit?: number;
    q?: string; date_from?: string; date_to?: string;
    status_id?: number; sort_by?: string; order?: string;
  } = {}) {
    let params = new HttpParams()
      .set('offset', filters.offset ?? 0)
      .set('limit', filters.limit ?? 50)
      .set('size', 131072);
    if (filters.q)          params = params.set('q', filters.q);
    if (filters.date_from)  params = params.set('date_from', filters.date_from);
    if (filters.date_to)    params = params.set('date_to', filters.date_to);
    if (filters.status_id != null) params = params.set('status_id', filters.status_id);
    if (filters.sort_by)    params = params.set('sort_by', filters.sort_by);
    if (filters.order)      params = params.set('order', filters.order);
    return this.http.get<VideoPreviewResponse>(`${this.apiUrl}/videos/mine`, { params });
  }

  search(query: {
    q?: string;
    uploader?: string;
    date_from?: string;
    date_to?: string;
    offset?: number;
    limit?: number;
  }) {
    let params = new HttpParams()
      .set('offset', query.offset ?? 0)
      .set('limit', query.limit ?? 10);
    if (query.q) params = params.set('q', query.q);
    if (query.uploader) params = params.set('uploader', query.uploader);
    if (query.date_from) params = params.set('date_from', query.date_from);
    if (query.date_to) params = params.set('date_to', query.date_to);
    return this.http.get<VideoPreviewResponse>(`${this.apiUrl}/videos/search`, { params });
  }

  getVideoUrl(videoId: number): string {
    return `${this.apiUrl}/videos/${videoId}`;
  }

  upload(title: string, description: string, file: File) {
    const form = new FormData();
    form.append('video_name', title);
    form.append('description', description);
    form.append('file', file);
    const req = new HttpRequest('POST', `${this.apiUrl}/videos/upload`, form, {
      reportProgress: true,
    });
    return this.http.request<{ message: string; video_id: number }>(req);
  }

  getVideoInfo(id: number) {
    return this.http.get<VideoInfo>(`${this.apiUrl}/videos/${id}/info`);
  }

  getDwStreamUrl(id: number): string {
    return `${this.apiUrl}/videos/${id}/dw/stream`;
  }

  getEwCrops(id: number, offset = 0, limit = 20) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<CropResponse>(`${this.apiUrl}/videos/${id}/ew/crops`, { params });
  }

  getDemCrops(id: number, offset = 0, limit = 20) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<CropResponse>(`${this.apiUrl}/videos/${id}/dem/crops`, { params });
  }

  update(videoId: number, data: { title?: string; description?: string; shared?: boolean }) {
    return this.http.patch<Video>(`${this.apiUrl}/videos/${videoId}`, data);
  }

  delete(videoId: number) {
    return this.http.delete(`${this.apiUrl}/videos/${videoId}`, { observe: 'response' });
  }
}
