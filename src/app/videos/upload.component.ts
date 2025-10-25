import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from './video.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { UserInterface as CurrentUser } from '../auth/userInterface';


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
  user: CurrentUser | null = null;
  user$: Observable<CurrentUser | null>;

  constructor(private video: VideoService, private router: Router, private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

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

    this.user$.subscribe(user => {
      this.user = user;
    });

    console.log('Uploading file for user id:', this.user?.id);

    if (!this.user) {
      this.message = 'Upload failed: User not logged in.';
      this.progress = -1;
      return;
    }

    this.video.upload(this.file, this.user?.id).subscribe({
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
