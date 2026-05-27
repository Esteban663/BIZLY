import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidebar } from "./app/sidebar/sidebar";
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // <-- Asegúrate de importar esto para el *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, CommonModule], // <-- Añadido CommonModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
  
  // Signal para controlar si se muestra el sidebar
  showSidebar = signal<boolean>(false);
  
  private router = inject(Router);

  constructor() {
    // Escuchar los eventos del enrutador para saber en qué página estamos
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la ruta es vacía '' (tu login), ocultamos el sidebar.
      // Si estás en '/productos', se mostrará.
      const isLoginPage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '';
      this.showSidebar.set(!isLoginPage);
    });
  }
}