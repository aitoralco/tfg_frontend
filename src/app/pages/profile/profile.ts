import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { VideoService } from '../../services/video.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user-model';
import { VideoPreview, StatusName } from '../../models/video-model';

type Tab = 'videos' | 'upload' | 'settings';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, DatePipe, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly videoService = inject(VideoService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  currentUser: User | null = null;
  activeTab: Tab = 'videos';

  // My Videos
  myVideos: VideoPreview[] = [];
  videosLoading = false;
  editingVideoId: number | null = null;

  readonly statusOptions = [
    { id: 1, label: 'Error' },
    { id: 2, label: 'Unprocessed' },
    { id: 3, label: 'Starting' },
    { id: 4, label: 'Detecting whales' },
    { id: 5, label: 'Cropping whales' },
    { id: 6, label: 'Extracting dorsal marks' },
    { id: 7, label: 'Processed' },
  ];

  filterForm = this.fb.group({
    q: [''],
    date_from: [''],
    date_to: [''],
    status_id: [''],
    sort_by: ['created_at'],
    order: ['desc'],
  });

  // Upload
  uploadForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });
  uploadFile: File | null = null;
  uploadLoading = false;
  uploadProgress = 0;
  uploadError = '';
  uploadSuccess = '';

  // Edit video inline form
  editForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    shared: [false],
  });
  editError = '';

  // Settings
  settingsForm = this.fb.group({
    username: [''],
    email: [''],
    new_password: [''],
    current_password: ['', Validators.required],
  });
  settingsLoading = false;
  settingsError = '';
  settingsSuccess = '';

  // Delete account
  deleteForm = this.fb.group({
    current_password: ['', Validators.required],
  });
  deleteLoading = false;
  deleteError = '';
  showDeleteConfirm = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) this.loadMyVideos();
    });
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
    this.uploadError = '';
    this.uploadSuccess = '';
    this.settingsError = '';
    this.settingsSuccess = '';
  }

  loadMyVideos() {
    this.videosLoading = true;
    const { q, date_from, date_to, status_id, sort_by, order } = this.filterForm.value;
    this.videoService.getMine({
      q: q || undefined,
      date_from: date_from || undefined,
      date_to: date_to || undefined,
      status_id: status_id ? Number(status_id) : undefined,
      sort_by: sort_by || undefined,
      order: order || undefined,
    }).subscribe({
      next: res => {
        this.myVideos = res.previews;
        this.videosLoading = false;
      },
      error: () => (this.videosLoading = false),
    });
  }

  applyFilters() {
    this.loadMyVideos();
  }

  clearFilters() {
    this.filterForm.reset({ q: '', date_from: '', date_to: '', status_id: '', sort_by: 'created_at', order: 'desc' });
    this.loadMyVideos();
  }

  get hasActiveFilters(): boolean {
    const { q, date_from, date_to, status_id } = this.filterForm.value;
    return !!(q || date_from || date_to || status_id);
  }

  getStatusClass(status: StatusName): string {
    if (status === 'error') return 'status-error';
    if (status === 'processed') return 'status-ok';
    if (status?.startsWith('processing_')) return 'status-processing';
    return 'status-pending';
  }

  getStatusLabel(status: StatusName): string {
    const labels: Record<StatusName, string> = {
      error: 'Error',
      unprocessed: 'Unprocessed',
      processing_0: 'Starting',
      processing_dw: 'Detecting whales',
      processing_ew: 'Cropping whales',
      processing_dem: 'Extracting dorsal marks',
      processed: 'Processed',
    };
    return labels[status] ?? status;
  }

  getStatusIcon(status: StatusName): string {
    if (status === 'error') return 'error';
    if (status === 'processed') return 'check_circle';
    if (status?.startsWith('processing_')) return 'autorenew';
    return 'schedule';
  }

  getPreviewUrl(video: VideoPreview): SafeUrl | null {
    if (!video.preview) return null;
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/jpeg;base64,${video.preview}`
    );
  }

  watchVideo(video: VideoPreview) {
    this.videoService.setSelectedVideo(video);
    this.router.navigate(['/videos', video.id]);
  }

  startEdit(video: VideoPreview) {
    this.editingVideoId = video.id;
    this.editForm.patchValue({ title: video.title, description: video.description, shared: video.shared });
    this.editError = '';
  }

  cancelEdit() {
    this.editingVideoId = null;
    this.editError = '';
  }

  saveEdit(videoId: number) {
    if (this.editForm.invalid) return;
    const { title, description, shared } = this.editForm.value;
    this.videoService.update(videoId, { title: title!, description: description ?? '', shared: shared ?? false }).subscribe({
      next: () => {
        const v = this.myVideos.find(x => x.id === videoId);
        if (v) {
          v.title = title!;
          v.description = description ?? '';
          v.shared = shared ?? false;
        }
        this.editingVideoId = null;
      },
      error: err => {
        this.editError = err.error?.detail ?? 'Update failed.';
      },
    });
  }

  deleteVideo(videoId: number) {
    if (!confirm('Delete this video?')) return;
    this.videoService.delete(videoId).subscribe({
      next: () => {
        this.myVideos = this.myVideos.filter(v => v.id !== videoId);
      },
      error: err => alert(err.error?.detail ?? 'Delete failed.'),
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.uploadFile = input.files?.[0] ?? null;
  }

  onUpload() {
    if (this.uploadForm.invalid || !this.uploadFile) return;
    this.uploadLoading = true;
    this.uploadProgress = 0;
    this.uploadError = '';
    this.uploadSuccess = '';

    const { title, description } = this.uploadForm.value;
    this.videoService
      .upload(title!, description ?? '', this.uploadFile!)
      .pipe(finalize(() => (this.uploadLoading = false)))
      .subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / (event.total ?? event.loaded)));
          } else if (event.type === HttpEventType.Response) {
            this.uploadSuccess = `Video uploaded! ID: ${event.body!.video_id}`;
            this.uploadForm.reset();
            this.uploadFile = null;
            if (this.currentUser) this.loadMyVideos();
            setTimeout(() => (this.uploadProgress = 0), 1500);
          }
        },
        error: err => {
          this.uploadProgress = 0;
          const detail = err?.error && typeof err.error === 'object' ? err.error.detail : null;
          this.uploadError = detail ?? (err?.status > 0 ? `Upload failed (${err.status}).` : 'Cannot reach server.');
        },
      });
  }

  onSaveSettings() {
    if (this.settingsForm.invalid) return;
    this.settingsLoading = true;
    this.settingsError = '';
    this.settingsSuccess = '';

    const { username, email, new_password, current_password } = this.settingsForm.value;
    const body: Record<string, string> = { current_password: current_password! };
    if (username) body['username'] = username;
    if (email) body['email'] = email;
    if (new_password) body['new_password'] = new_password;

    this.userService.updateMe(body as any).subscribe({
      next: updatedUser => {
        this.settingsLoading = false;
        this.settingsSuccess = 'Profile updated successfully.';
        this.authService.updateCurrentUser(updatedUser);
        this.settingsForm.reset();
      },
      error: err => {
        this.settingsLoading = false;
        this.settingsError =
          err.status === 403 ? 'Wrong current password.' : (err.error?.detail ?? 'Update failed.');
      },
    });
  }

  onDeleteAccount() {
    if (this.deleteForm.invalid) return;
    this.deleteLoading = true;
    this.deleteError = '';

    this.userService.deleteMe(this.deleteForm.value.current_password!).subscribe({
      next: () => {
        this.authService.logout();
      },
      error: err => {
        this.deleteLoading = false;
        this.deleteError =
          err.status === 403 ? 'Wrong password.' : (err.error?.detail ?? 'Delete failed.');
      },
    });
  }
}
