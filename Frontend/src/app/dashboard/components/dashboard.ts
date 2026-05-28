import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { Movimiento, MetricCard } from '../models/movimiento.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})  
//Clase
export class Dashboard implements OnInit {
  // Inyectamos nuestro nuevo servicio especializado
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  // Estados financieros expuestos a las Cards del HTML
  ingresosTotal: number = 0;
  egresosTotal: number = 0;
  stockBajoCount: number = 0; 
  rendimientoValue: string = '0%';

  // Listas de datos tipadas usando el Modelo
  listaIngresos: Movimiento[] = [];
  listaEgresos: Movimiento[] = [];
  ultimosMovimientos: Movimiento[] = [];
  totalNetoMovimientos: number = 0;

  // Control del Popup y Categorías dinámicas
  modoEdicion: boolean = false;
  mostrarPopup: boolean = false;
  tipoMovimiento: 'INGRESO' | 'EGRESO' = 'INGRESO';
  categoriasDisponibles: string[] = [];

  // Inicialización del formulario respetando la interfaz Movimiento
  nuevoMovimiento: Movimiento = this.inicializarFormulario();

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: ({ ingresos, egresos }) => {
        this.listaIngresos = ingresos;
        this.listaEgresos = egresos;
        this.calcularMetricasYTabla();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al mapear datos en el componente:', err)
    });
  }

  abrirEditar(movimiento: Movimiento): void {
  this.modoEdicion = true;
  this.tipoMovimiento = movimiento.tipo || 'INGRESO';
  this.nuevoMovimiento = { ...movimiento };
  this.categoriasDisponibles = this.tipoMovimiento === 'INGRESO' 
    ? ['Venta', 'Ganancia ocasional'] 
    : ['Pago deuda','Nomina', 'Costos operacion'];
    this.mostrarPopup = true;
  }

  abrirFormulario(tipo: 'INGRESO' | 'EGRESO'): void {
    this.tipoMovimiento = tipo;
    this.mostrarPopup = true;
    
    if (tipo === 'INGRESO') {
      this.categoriasDisponibles = ['Venta', 'Ganancia ocasional'];
      this.nuevoMovimiento = this.inicializarFormulario('Venta');
    } else {
      this.categoriasDisponibles = ['Pago deuda', 'Nomina', 'Costos operación'];
      this.nuevoMovimiento = this.inicializarFormulario('Costos operación');
    }
  }

  cerrarFormulario(): void {
    this.mostrarPopup = false;
    this.modoEdicion = false;
    this.nuevoMovimiento = this.inicializarFormulario();
  }

  registrarMovimiento(): void {
  if (!this.nuevoMovimiento.monto || !this.nuevoMovimiento.descripcion) {
    alert('Por favor, complete el monto y la descripción.');
    return;
  }

  if (this.modoEdicion) {
    // ---- LÓGICA DE ACTUALIZACIÓN (PUT) ----
    this.dashboardService.updateMovimiento(this.nuevoMovimiento).subscribe({
      next: () => {
        alert('Movimiento actualizado con éxito en PostgreSQL');
        this.cerrarFormulario();
        this.cargarDatosDashboard(); 
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  } else {
    // ---- SOLUCIÓN AL ERROR DE CREACIÓN ----
    // Evaluamos el tipo de movimiento para usar los métodos reales de tu Service
    if (this.tipoMovimiento === 'INGRESO') {
      this.dashboardService.registrarIngreso(this.nuevoMovimiento).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarDatosDashboard();
        },
        error: (err) => console.error('Error al crear ingreso:', err)
      });
    } else {
      this.dashboardService.registrarEgreso(this.nuevoMovimiento).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarDatosDashboard();
        },
        error: (err) => console.error('Error al crear egreso:', err)
      });
    }
  }
}

  private calcularMetricasYTabla(): void {
    this.ingresosTotal = this.listaIngresos.reduce((sum, item) => sum + (item.monto || 0), 0);
    this.egresosTotal = this.listaEgresos.reduce((sum, item) => sum + (item.monto || 0), 0);

    if (this.ingresosTotal > 0) {
      const rendimiento = ((this.ingresosTotal - this.egresosTotal) / this.ingresosTotal) * 100;
      this.rendimientoValue = `${rendimiento.toFixed(2)}%`;
    } else {
      this.rendimientoValue = '0%';
    }

    const ingMapeados = this.listaIngresos.map(i => ({ ...i, tipo: 'INGRESO' as const }));
    const egrMapeados = this.listaEgresos.map(e => ({ ...e, tipo: 'EGRESO' as const }));
    
    const todos = [...ingMapeados, ...egrMapeados].sort((a, b) => (b.id || 0) - (a.id || 0));
    this.ultimosMovimientos = todos.slice(0, 4);

    this.totalNetoMovimientos = this.ultimosMovimientos.reduce((sum, item) => {
      return item.tipo === 'INGRESO' ? sum + (item.monto || 0) : sum - (item.monto || 0);
    }, 0);
    this.calcularRentabilidadCategorias();
  }

  private inicializarFormulario(categoriaDefecto: string = ''): Movimiento {
    return {
      monto: null,
      descripcion: '',
      categoria: categoriaDefecto,
      referencia: '',
      fecha: new Date().toISOString().split('T')[0]
    };
  }
  // Datos del gráfico de rentabilidad por categoría
rentabilidadCategorias: { categoria: string; ingresos: number; egresos: number; neto: number; porcentaje: number }[] = [];

private calcularRentabilidadCategorias(): void {
  const mapa = new Map<string, { ingresos: number; egresos: number }>();

  this.listaIngresos.forEach(i => {
    const cat = i.categoria || 'General';
    const actual = mapa.get(cat) || { ingresos: 0, egresos: 0 };
    mapa.set(cat, { ...actual, ingresos: actual.ingresos + (i.monto || 0) });
  });

  this.listaEgresos.forEach(e => {
    const cat = e.categoria || 'General';
    const actual = mapa.get(cat) || { ingresos: 0, egresos: 0 };
    mapa.set(cat, { ...actual, egresos: actual.egresos + (e.monto || 0) });
  });

  const maxNeto = Math.max(...Array.from(mapa.values()).map(v => Math.abs(v.ingresos - v.egresos)), 1);

  this.rentabilidadCategorias = Array.from(mapa.entries())
    .map(([categoria, val]) => {
      const neto = val.ingresos - val.egresos;
      return {
        categoria,
        ingresos: val.ingresos,
        egresos: val.egresos,
        neto,
        porcentaje: Math.round((Math.abs(neto) / maxNeto) * 100)
      };
    })
    .sort((a, b) => b.neto - a.neto);
}
}