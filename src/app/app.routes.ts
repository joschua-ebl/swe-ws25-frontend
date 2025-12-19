import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'suche',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'suche',
        loadComponent: () =>
            import('./features/suche/suche.component').then(m => m.SucheComponent),
    },
    {
        // WICHTIG: 'neu' muss VOR ':id' stehen, da ':id' sonst 'neu' matcht
        path: 'buch/neu',
        loadComponent: () =>
            import('./features/anlegen/anlegen.component').then(m => m.AnlegenComponent),
        canActivate: [authGuard],
    },
    {
        path: 'buch/:id',
        loadComponent: () =>
            import('./features/detail/detail.component').then(m => m.DetailComponent),
    },
    {
        path: '**',
        redirectTo: 'suche',
    },
];
