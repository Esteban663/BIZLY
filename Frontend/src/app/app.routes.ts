import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { ProductosComponent } from './productos/app/productos/productos';
import { Dashboard } from './dashboard/components/dashboard.components';
// 1. Aquí importamos tu nuevo componente (Ajusta la ruta si tu archivo se llama diferente)
import { NominaComponent } from './nomina/nomina';

export const routes: Routes = [
  // Primera pantalla
  { path: '', component: LoginComponent },

  // Productos
  { path: 'productos', component: ProductosComponent },

  // Ruta de la página de inicio
  { path: 'dashboard', component: Dashboard },

  // Nómina (Agregada correctamente con su coma correspondiente antes de cerrar)
  { path: 'nomina', component: NominaComponent },

  // Ruta comodín (SIEMPRE debe ir al final de todo para que no intercepte las otras rutas)
  { path: '**', redirectTo: '' }
];