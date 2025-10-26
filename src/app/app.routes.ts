import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
	},
	{
		path: 'about',
		loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
	}
,
	{
		path: 'videos',
		loadComponent: () => import('./videos/videos.component').then(m => m.VideosComponent)
	},
	{
		path: 'videos/upload',
		loadComponent: () => import('./videos/upload.component').then(m => m.UploadComponent)
	},
	{
		path: 'login',
		loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
	},
	{
		path: 'register',
		loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent)
	},
	{
		path: 'user',
		loadComponent: () => import('./user/user.component').then(m => m.UserComponent)
	},
	{
		path: 'users-backoffice',
		loadComponent: () => import('./users_backoffice/users.backoffice').then(m => m.UsersBackoffice)
	}
];
