import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './auth/guards/auth.guard';
import { ProductosComponent } from './productos/app/productos/productos';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./auth/components/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./auth/components/register/register.component')
      .then(m => m.RegisterComponent)
  },
  { path: 'dashboard',  canActivate: [authGuard], component: Dashboard },
  { path: 'productos',  canActivate: [authGuard], component: ProductosComponent },
  { path: '',           redirectTo: 'login', pathMatch: 'full' },
  { path: '**',         redirectTo: 'login' }
];