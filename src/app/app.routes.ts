import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        //loadComponent: () => import('./components/home/home').then(m => m.Home)
        loadComponent: () => import('./modules/home-page/home-page').then(m => m.HomePage)
    }
];
