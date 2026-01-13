import { Component, Input } from '@angular/core';
import { Video } from '../../../models/video-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-video-card',
  imports: [DatePipe],
  templateUrl: './video-card.html',
  styleUrl: './video-card.css',
})
export class VideoCardComponent {
  @Input() videoData!: Video;
}
