import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { VideoService } from '../videos/video.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  user: { 
    username: string,
    id: number
  } | null = null;
  user_id: number | null = null;
  videoUrl: string | null = null;

  videos: Array<any> = [];
  selectedVideo: any = null;
  selectedSrc = '';

  constructor(private auth: AuthService, private router: Router, private videoService: VideoService) {
    this.user = this.auth.currentUser;
    this.auth.user$.subscribe(u => this.user = u);
    // For now show the test video with id 4
    //try {
    //  this.videoUrl = new URL('videos/4', environment.apiBaseUrl).toString();
    //} catch {
    //  this.videoUrl = `${environment.apiBaseUrl}videos/4`;
    //}
  }

  ngOnInit(): void {
    this.loadPreviews();
    console.log(this.user);
  }

  logout() {
    this.auth.clearUser();
    this.router.navigate(['/']);
  }

  goUpload() {
    this.router.navigate(['/videos/upload']);
  }

  getVideoUrl(id: number) {
    return this.videoService.getVideoUrl(id);
  }

  @ViewChild('player') playerRef!: ElementRef<HTMLVideoElement>;

  selectVideo(v: any) {
    console.log('Selecting video', v);
    this.selectedVideo = v;
    // Always use the server stream URL for the main player so the browser requests
    // the resource and the backend can serve Range requests. Keep previews for
    // the small cards only.
    this.selectedSrc = this.getVideoUrl(v.id);

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

  loadPreviews(offset = 0, limit = 20, size = 1024) {
    this.videoService.getPreviews(offset, limit, size).subscribe({ next: (res) => {
      this.videos = res.previews || [];
    }, error: (err) => {
      console.error('Failed to load previews', err);
    }});
  }
}
 
