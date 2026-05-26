import { ProductosComponent } from './productos/app/productos/productos';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
export const routes: Routes = [

  // Primera pantalla
  { path: '', component: LoginComponent },

  // Productos
  { path: 'productos', component: ProductosComponent },

  // Ruta comodín
  { path: '**', redirectTo: '' }

];