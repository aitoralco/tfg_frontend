import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { VideosComponent } from './pages/videos/videos';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { VideoDetail } from './pages/videos/video-detail/video-detail';
import { Profile } from './pages/profile/profile';
import { Admin } from './pages/admin/admin';
import { authGuard, adminGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'videos', component: VideosComponent },
  { path: 'videos/:id', component: VideoDetail },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
