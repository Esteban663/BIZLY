import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Nomina } from './models/nomina.model';

@Component({
  selector: 'app-nomina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nomina.html',
  styleUrl: './nomina.css'
})
export class NominaComponent implements OnInit {

  private readonly apiUrl = 'http://localhost:8080/bizly/nomina';
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  listaNomina: Nomina[] = [];

  mostrarFormulario: boolean = false;
  nominaEnEdicion: Nomina | null = null;

  formNombre: string = '';
  formCedula: string = '';
  formSueldo: number | null = null;

  terminoBusqueda: string = '';

  listaNotificaciones: string[] = [];
  mostrarModalNotificaciones: boolean = false;

  ngOnInit(): void {
    this.cargarNomina();
  }

  cargarNomina(): void {
    this.http.get<Nomina[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.listaNomina = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando nómina:', err)
    });
  }

  get nominaFiltrada(): Nomina[] {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (!termino) return this.listaNomina;
    return this.listaNomina.filter(n =>
      n.nombreEmpleado.toLowerCase().includes(termino) ||
      n.cedula.toLowerCase().includes(termino)
    );
  }

  get totalNomina(): number {
    return this.listaNomina.reduce((acc, n) => acc + (n.sueldoBase || 0), 0);
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nominaEnEdicion = null;
    this.formNombre = '';
    this.formCedula = '';
    this.formSueldo = null;
  }

  editarNomina(nomina: Nomina): void {
    this.nominaEnEdicion = nomina;
    this.formNombre = nomina.nombreEmpleado;
    this.formCedula = nomina.cedula;
    this.formSueldo = nomina.sueldoBase;
    this.mostrarFormulario = true;
  }

  guardarNomina(): void {
    if (!this.formNombre || !this.formCedula || this.formSueldo === null) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const datos: Nomina = {
      nombreEmpleado: this.formNombre,
      cedula: this.formCedula,
      sueldoBase: this.formSueldo
    };

    const nombreGuardado = this.formNombre;

    if (this.nominaEnEdicion && this.nominaEnEdicion.id !== undefined) {
      // Guardamos el id ANTES de cerrar el modal (alternarFormulario limpia nominaEnEdicion)
      const id = this.nominaEnEdicion.id;
      this.alternarFormulario();

      this.http.put<Nomina>(`${this.apiUrl}/${id}`, datos).subscribe({
        next: () => {
          this.agregarNotificacion(`Se actualizó la nómina de: "${nombreGuardado}".`);
          this.cargarNomina();
        },
        error: () => alert('Error al actualizar en la Base de Datos.')
      });

    } else {
      this.alternarFormulario();

      this.http.post<Nomina>(this.apiUrl, datos).subscribe({
        next: () => {
          this.agregarNotificacion(`Se registró la nómina de: "${nombreGuardado}".`);
          this.cargarNomina();
        },
        error: () => alert('Error al guardar en la Base de Datos.')
      });
    }
  }

  eliminarNomina(id: number, nombre: string): void {
    if (confirm(`¿Eliminar permanentemente la nómina de "${nombre}"?`)) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.agregarNotificacion(`Se eliminó la nómina de: "${nombre}".`);
          this.cargarNomina();
        },
        error: () => alert('Error al eliminar de la Base de Datos.')
      });
    }
  }

  agregarNotificacion(mensaje: string): void {
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.listaNotificaciones.unshift(`[${hora}] ${mensaje}`);
  }

  alternarModalNotificaciones(): void {
    this.mostrarModalNotificaciones = !this.mostrarModalNotificaciones;
  }

  limpiarNotificaciones(): void {
    this.listaNotificaciones = [];
  }
}