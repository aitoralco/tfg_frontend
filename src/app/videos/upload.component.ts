import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from './video.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page upload-page">
      <h1>Upload video</h1>
      <input type="file" (change)="onFile($event)" accept="video/*" />
      <div *ngIf="progress >= 0">Progress: {{ progress }}%</div>
      <div *ngIf="message">{{ message }}</div>
      <div style="margin-top:1rem">
        <button (click)="goHome()">Cancel</button>
      </div>
    </section>
  `
})
export class UploadComponent {
  file: File | null = null;
  progress = -1;
  message = '';

  constructor(private video: VideoService, private router: Router) {}

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.file = input.files[0];
    this.upload();
  }

  upload() {
    if (!this.file) return;
    this.progress = 0;
    this.message = 'Uploading...';
    this.video.upload(this.file).subscribe({
      next: (ev) => {
        if (ev.type === HttpEventType.UploadProgress && ev.total) {
          this.progress = Math.round((100 * (ev.loaded || 0)) / ev.total);
        } else if (ev.type === HttpEventType.Response) {
          this.message = 'Upload successful';
          this.progress = 100;
        }
      },
      error: (err) => {
        this.message = 'Upload failed: ' + (err?.message || err);
        this.progress = -1;
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
