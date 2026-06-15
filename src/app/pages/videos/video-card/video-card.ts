import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VideoPreview } from '../../../models/video-model';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-card',
  imports: [DatePipe, SlicePipe, MatIconModule],
  templateUrl: './video-card.html',
  styleUrl: './video-card.css',
})
export class VideoCardComponent {
  @Input() video!: VideoPreview;

  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly videoService = inject(VideoService);

  get previewUrl(): SafeUrl | null {
    if (!this.video?.preview) return null;
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/jpeg;base64,${this.video.preview}`
    );
  }

  navigate() {
    this.videoService.setSelectedVideo(this.video);
    this.router.navigate(['/videos', this.video.id]);
  }
}
