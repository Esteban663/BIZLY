import { ProductosComponent } from './productos/app/productos/productos';
import { Dashboard } from './dashboard/dashboard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto (redirige a productos al entrar a la app)
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  
  // Ruta de la página de productos
  { path: 'productos', component: ProductosComponent },

  // Ruta de la página de inicio
  { path: 'dashboard', component: Dashboard },
  
  // Ruta comodín (por si escriben una URL que no existe)
  { path: '**', redirectTo: 'productos' }
];