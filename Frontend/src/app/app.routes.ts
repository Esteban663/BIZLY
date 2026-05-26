import { ProductosComponent } from './productos/app/productos/productos';
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto (redirige a productos al entrar a la app)
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  
  // Ruta de la página de productos
  { path: 'productos', component: ProductosComponent },
  
  // Ruta comodín (por si escriben una URL que no existe)
  { path: '**', redirectTo: 'productos' }
];