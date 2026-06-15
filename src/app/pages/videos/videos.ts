import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { VideoPreview, VideoPreviewResponse } from '../../models/video-model';
import { VideoService } from '../../services/video.service';
import { VideoCardComponent } from './video-card/video-card';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-videos-component',
  imports: [VideoCardComponent, FormsModule, MatIconModule],
  templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class VideosComponent implements OnInit {
  private readonly videoService = inject(VideoService);

  videos: VideoPreview[] = [];
  total = 0;
  currentPage = 0;
  isLoading = false;
  isSearchMode = false;
  error = '';

  searchQuery = '';
  searchUploader = '';
  searchDateFrom = '';
  searchDateTo = '';

  get totalPages(): number {
    return Math.ceil(this.total / PAGE_SIZE);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  ngOnInit() {
    this.loadPreviews();
  }

  loadPreviews() {
    this.isLoading = true;
    this.error = '';
    this.videoService
      .getPreviews(this.currentPage * PAGE_SIZE, PAGE_SIZE)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: VideoPreviewResponse) => {
          this.videos = res.previews;
          this.total = res.total;
        },
        error: err => {
          this.error =
            err.status === 0
              ? 'No se puede conectar al servidor.'
              : (err.error?.detail ?? 'Error al cargar los vídeos.');
          this.videos = [];
          this.total = 0;
        },
      });
  }

  onSearch() {
    const hasFilters =
      this.searchQuery || this.searchUploader || this.searchDateFrom || this.searchDateTo;
    this.currentPage = 0;

    if (!hasFilters) {
      this.isSearchMode = false;
      this.loadPreviews();
      return;
    }

    this.isSearchMode = true;
    this.isLoading = true;
    this.error = '';
    this.videoService
      .search({
        q: this.searchQuery || undefined,
        uploader: this.searchUploader || undefined,
        date_from: this.searchDateFrom || undefined,
        date_to: this.searchDateTo || undefined,
        offset: 0,
        limit: PAGE_SIZE,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: VideoPreviewResponse) => {
          this.videos = res.previews;
          this.total = res.total;
        },
        error: err => {
          this.error =
            err.status === 0
              ? 'No se puede conectar al servidor.'
              : (err.error?.detail ?? 'Error en la búsqueda.');
          this.videos = [];
          this.total = 0;
        },
      });
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchUploader = '';
    this.searchDateFrom = '';
    this.searchDateTo = '';
    this.isSearchMode = false;
    this.currentPage = 0;
    this.error = '';
    this.loadPreviews();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;

    if (this.isSearchMode) {
      this.isLoading = true;
      this.error = '';
      this.videoService
        .search({
          q: this.searchQuery || undefined,
          uploader: this.searchUploader || undefined,
          date_from: this.searchDateFrom || undefined,
          date_to: this.searchDateTo || undefined,
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res: VideoPreviewResponse) => {
            this.videos = res.previews;
            this.total = res.total;
          },
          error: err => {
            this.error = err.status === 0
              ? 'No se puede conectar al servidor.'
              : (err.error?.detail ?? 'Error en la búsqueda.');
            this.videos = [];
            this.total = 0;
          },
        });
    } else {
      this.loadPreviews();
    }
  }
}
