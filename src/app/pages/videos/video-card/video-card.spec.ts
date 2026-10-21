import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { VideoCardComponent } from './video-card';
import { VideoService } from '../../../services/video.service';
import { VideoPreview } from '../../../models/video-model';

const video: VideoPreview = {
  id: 42,
  title: 'Humpback at sunset',
  description: 'A humpback whale breaching.',
  file_name: 'abc.mp4',
  uploader: 'jane',
  created_at: '2026-01-01T00:00:00',
  preview: null,
  shared: true,
  status: { id: 7, status_name: 'processed' },
};

describe('VideoCardComponent', () => {
  let fixture: ComponentFixture<VideoCardComponent>;

  async function render(data: VideoPreview) {
    await TestBed.configureTestingModule({
      imports: [VideoCardComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCardComponent);
    fixture.componentInstance.video = data;
    fixture.detectChanges();
  }

  it('should render title and uploader', async () => {
    await render(video);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.video-name')?.textContent).toContain('Humpback at sunset');
    expect(el.querySelector('.video-meta')?.textContent).toContain('jane');
  });

  it('should show a placeholder when there is no thumbnail', async () => {
    await render(video);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('img.thumb')).toBeNull();
    expect(el.querySelector('.thumb-placeholder')).not.toBeNull();
  });

  it('should show the JPEG thumbnail when there is one', async () => {
    await render({ ...video, preview: 'AAAA' });
    const img = (fixture.nativeElement as HTMLElement).querySelector('img.thumb') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toBe('data:image/jpeg;base64,AAAA');
  });

  it('should truncate long descriptions', async () => {
    await render({ ...video, description: 'x'.repeat(200) });
    const text = (fixture.nativeElement as HTMLElement).querySelector('.video-description')!.textContent!.trim();
    expect(text).toBe('x'.repeat(120) + '...');
  });

  it('should select the video and navigate to its page on click', async () => {
    await render(video);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const select = vi.spyOn(TestBed.inject(VideoService), 'setSelectedVideo');

    (fixture.nativeElement.querySelector('.video-card') as HTMLElement).click();

    expect(select).toHaveBeenCalledWith(video);
    expect(navigate).toHaveBeenCalledWith(['/videos', 42]);
  });
});
