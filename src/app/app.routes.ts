import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Videos } from './pages/videos/videos';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [

    {
        path: '',
        component: Home
    },
    {
        path: 'videos',
        component: Videos
    },
    {
        path: 'contact',
        component: Contact
    },
];
