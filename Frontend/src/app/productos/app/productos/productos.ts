import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
  codigo: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:8080/bizly/inventario';

  formNombre: string = '';
  formPrecio: number | null = null;
  formCantidad: number | null = null;
  formCodigo: string = '';
  formCategoria: string = 'General';

  listaProductos: Producto[] = [];

  mostrarFormulario: boolean = false;
  productoEnEdicion: Producto | null = null;
  terminoBusqueda: string = '';
  categoriaSeleccionada: string = 'Todos';
  stockFiltro: string = 'Todos';   // NUEVO: filtro de stock

  listaNotificaciones: string[] = [];
  mostrarModalNotificaciones: boolean = false;

  // Errores de validación
  errorPrecio: string = '';
  errorCantidad: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.refrescarTodo();
  }

  refrescarTodo(): void {
    this.terminoBusqueda = '';
    this.categoriaSeleccionada = 'Todos';
    this.stockFiltro = 'Todos';
    this.limpiarFormulario();
    this.obtenerProductosDB();
  }

  obtenerProductosDB(): void {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.listaProductos = [...data];
        this.verificarStockCritico();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando datos del servidor:', err)
    });
  }

  verificarStockCritico(): void {
    this.listaProductos.forEach(producto => {
      if (producto.cantidad < 2) {
        const yaExiste = this.listaNotificaciones.some(n =>
          n.includes(`⚠️ STOCK BAJO: "${producto.nombre}"`)
        );
        if (!yaExiste) {
          this.agregarNotificacion(`⚠️ STOCK BAJO: "${producto.nombre}" (Solo quedan ${producto.cantidad} u.).`);
        }
      }
    });
  }

  get productosFiltrados(): Producto[] {
    return this.listaProductos.filter(producto => {
      const termino = this.terminoBusqueda.toLowerCase().trim();

      const coincideTexto = !termino ||
        (producto.nombre && producto.nombre.toLowerCase().includes(termino)) ||
        (producto.codigo && producto.codigo.toLowerCase().includes(termino));

      const coincideCategoria = this.categoriaSeleccionada === 'Todos' ||
        (producto.categoria && producto.categoria.toLowerCase() === this.categoriaSeleccionada.toLowerCase());

      // NUEVO: filtro de stock
      const coincideStock =
        this.stockFiltro === 'Todos' ||
        (this.stockFiltro === 'Disponible' && producto.cantidad >= 2) ||
        (this.stockFiltro === 'StockBajo' && producto.cantidad < 2);

      return coincideTexto && coincideCategoria && coincideStock;
    });
  }

  // NUEVO: validar que precio no sea negativo
  validarPrecio(): void {
    if (this.formPrecio !== null && this.formPrecio < 0) {
      this.formPrecio = 0;
      this.errorPrecio = 'El precio no puede ser negativo.';
    } else {
      this.errorPrecio = '';
    }
  }

  // NUEVO: validar que cantidad no sea negativa
  validarCantidad(): void {
    if (this.formCantidad !== null && this.formCantidad < 0) {
      this.formCantidad = 0;
      this.errorCantidad = 'La cantidad no puede ser negativa.';
    } else {
      this.errorCantidad = '';
    }
  }

  agregarNotificacion(mensaje: string): void {
    const ahora = new Date();
    const horaTexto = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.listaNotificaciones.unshift(`[${horaTexto}] ${mensaje}`);
  }

  alternarModalNotificaciones(): void {
    this.mostrarModalNotificaciones = !this.mostrarModalNotificaciones;
  }

  limpiarNotificaciones(): void {
    this.listaNotificaciones = [];
  }

  alternarFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.productoEnEdicion = null;
    this.formNombre = '';
    this.formPrecio = null;
    this.formCantidad = null;
    this.formCodigo = '';
    this.formCategoria = 'General';
    this.errorPrecio = '';
    this.errorCantidad = '';
  }

  guardarProducto(): void {
    if (!this.formNombre || !this.formCodigo || this.formPrecio === null || this.formCantidad === null) {
      alert('Por favor, rellene todos los campos obligatorios del producto.');
      return;
    }

    if (this.formPrecio < 0 || this.formCantidad < 0) {
      alert('El precio y la cantidad no pueden ser negativos.');
      return;
    }

    const datosProducto: any = {
      nombre: this.formNombre,
      codigo: this.formCodigo,
      precio: this.formPrecio,
      cantidad: this.formCantidad,
      categoria: this.formCategoria || 'General'
    };

    const nombreGuardado = this.formNombre;
    const codigoGuardado = this.formCodigo;

    if (this.productoEnEdicion) {
      const id = this.productoEnEdicion.id;
      datosProducto.id = id;
      this.alternarFormulario();

      this.http.put(`${this.apiUrl}/${id}`, datosProducto).subscribe({
        next: () => {
          this.agregarNotificacion(`Se actualizó el producto: "${nombreGuardado}" (Código: ${codigoGuardado}).`);
          this.obtenerProductosDB();
        },
        error: () => {
          alert('Error al actualizar en la Base de Datos');
          this.obtenerProductosDB();
        }
      });

    } else {
      this.alternarFormulario();

      this.http.post(this.apiUrl, datosProducto).subscribe({
        next: () => {
          this.agregarNotificacion(`Se guardó el producto: "${nombreGuardado}".`);
          this.obtenerProductosDB();
        },
        error: () => {
          alert('Error al guardar en la Base de Datos');
          this.obtenerProductosDB();
        }
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.productoEnEdicion = producto;
    this.formNombre = producto.nombre;
    this.formPrecio = producto.precio;
    this.formCantidad = producto.cantidad;
    this.formCodigo = producto.codigo;
    this.formCategoria = producto.categoria || 'General';
    this.mostrarFormulario = true;
  }

  eliminarProducto(id: number): void {
    const productoABorrar = this.listaProductos.find(p => p.id === id);
    if (productoABorrar && confirm(`¿Estás seguro de que deseas eliminar permanentemente "${productoABorrar.nombre}"?`)) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.agregarNotificacion(`Se eliminó el producto: "${productoABorrar.nombre}".`);
          this.obtenerProductosDB();
        },
        error: () => alert('Error al eliminar de la Base de Datos')
      });
    }
  }
}