import { ProductosComponent } from './productos/app/productos/productos';
import { Dashboard } from './dashboard/components/dashboard';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
export const routes: Routes = [

  // Primera pantalla
  { path: '', component: LoginComponent },

  // Productos
  { path: 'productos', component: ProductosComponent },

  // Ruta de la página de inicio
  { path: 'dashboard', component: Dashboard },

  // Ruta comodín
  { path: '**', redirectTo: '' }

];