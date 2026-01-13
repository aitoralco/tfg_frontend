import { Component } from '@angular/core';
import { Video } from '../../models/video-model';
import { VideoCardComponent } from './video-card/video-card';

@Component({
  selector: 'app-videos-component',
  imports: [VideoCardComponent],
  templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class VideosComponent {
  videos_list: Video[] = [
    {
      name: 'Learning Angular',
      author: 'John Doe',
      uploadDate: new Date(2024, 5, 12),
      thumbnailUrl: 'https://via.placeholder.com/150',
      description: 'A begginer guide to Angular',
    },
  ];
}
