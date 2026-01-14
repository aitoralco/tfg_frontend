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
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales aliquet mi mattis dignissim. Aliquam tincidunt sed magna non lacinia. Nulla sit amet nunc nulla. Curabitur ligula dui, efficitur a pharetra nec, commodo sed nunc. Sed convallis vel lacus id venenatis. Pellentesque dolor tortor, egestas sit amet velit vitae, suscipit ornare mauris. Aenean viverra tincidunt eros, ac sodales tellus laoreet a. Nunc ac odio neque. Maecenas ac tincidunt magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla eleifend tempus condimentum. Cras elementum leo sit amet tincidunt lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque pellentesque tellus tellus, ac auctor ligula hendrerit non. Quisque eros enim, efficitur mattis auctor ac, lacinia quis erat.

      Sed ultrices nunc quis dui lacinia posuere. Praesent nec odio tellus. Etiam ut eleifend dui. Phasellus volutpat libero magna, sollicitudin tincidunt arcu suscipit sed. Fusce nec turpis luctus, dictum mauris vel, imperdiet erat. Sed eu elit et neque aliquet interdum. Vivamus nec eros mi. Mauris euismod ipsum sed lectus varius, eu efficitur ipsum aliquam. Cras molestie est sed venenatis volutpat. Fusce a dui sed neque cursus vulputate a nec ipsum. Mauris a pellentesque nibh.

      Donec in velit mi. Quisque sed diam elementum mi scelerisque vulputate. Aliquam egestas arcu dolor, sodales molestie dolor rhoncus a. Proin tempor sit amet urna a malesuada. Maecenas libero dolor, molestie vel facilisis sed, sagittis cursus ante. Ut at sodales neque. Fusce ultricies tincidunt turpis non pellentesque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc fermentum, massa a varius mollis, erat nisi tempor sem, eu commodo elit sem eu est. Aliquam ac congue leo, non maximus ante.

      Proin blandit euismod massa. Etiam viverra sodales ipsum, hendrerit finibus felis lobortis eu. Curabitur aliquam sapien non metus placerat, quis molestie neque porta. Pellentesque tincidunt sed dui quis hendrerit. Sed bibendum nibh auctor, feugiat libero non, feugiat tortor. Maecenas sed mi et magna scelerisque dignissim. Mauris rhoncus libero id arcu congue viverra. Donec fermentum elementum dui eget egestas. Duis arcu nibh, pulvinar bibendum tristique vitae, fringilla sit amet diam. Sed tincidunt turpis a leo hendrerit semper.

      Pellentesque sit amet pretium arcu. Vestibulum interdum faucibus odio ultrices suscipit. Suspendisse potenti. Donec lorem elit, egestas id elementum eget, porta vitae mauris. Duis nec sapien id mauris dictum varius eget ac urna. Nulla sit amet libero elit. Praesent efficitur vel elit ultrices ullamcorper. Aliquam erat volutpat. Vestibulum eget lobortis augue. Duis porttitor ex vitae felis commodo, eget lobortis quam molestie. Suspendisse potenti. Cras vitae libero felis.`,
    },
    {
      name: 'Learning Angular',
      author: 'John Doe',
      uploadDate: new Date(2024, 5, 12),
      thumbnailUrl: 'https://via.placeholder.com/150',
      description: 'A begginer guide to Angular',
    },
    {
      name: 'Learning Angular',
      author: 'John Doe',
      uploadDate: new Date(2024, 5, 12),
      thumbnailUrl: 'https://via.placeholder.com/150',
      description: 'A begginer guide to Angular',
    },
    {
      name: 'Learning Angular',
      author: 'John Doe',
      uploadDate: new Date(2024, 5, 12),
      thumbnailUrl: 'https://via.placeholder.com/150',
      description: 'A begginer guide to Angular',
    },
  ];
}
