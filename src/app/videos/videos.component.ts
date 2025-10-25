import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from './video.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  sampleUrl = '';
  videos: Array<any> = [];
  selectedVideo: any = null;
  selectedSrc = '';

  constructor(private videoService: VideoService) {
    this.sampleUrl = this.videoService.getVideoUrl(4);
  }

  getVideoUrl(id: number) {
    return this.videoService.getVideoUrl(id);
  }

  ngOnInit(): void {
    this.loadPreviews();
  }

  loadPreviews(offset = 0, limit = 20, size = 1024) {
    this.videoService.getPreviews(0, offset, limit, size).subscribe({ next: (res) => {
      this.videos = res.previews || [];
    }, error: (err) => {
      console.error('Failed to load previews', err);
    }});
  }

  @ViewChild('player') playerRef!: ElementRef<HTMLVideoElement>;

  selectVideo(v: any) {
    console.log('Selecting video', v);
    this.selectedVideo = v;
    // Always use the server stream URL for the main player so the browser requests
    // the resource and the backend can serve Range requests. Keep previews for
    // the small cards only.
    this.selectedSrc = this.getVideoUrl(v.id);
    console.log('Selected src video url', this.selectedSrc);

    // Give Angular a tick; then load & play
    setTimeout(() => {
      try {
        const p = this.playerRef?.nativeElement;
        if (p) {
          p.load();
          const playPromise = p.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(() => {/* autoplay blocked by browser; user can press play */});
          }
        }
      } catch (e) { console.warn('Could not autoplay', e); }
    }, 50);
  }
}
