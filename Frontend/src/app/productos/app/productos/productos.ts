import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

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
  imports: [CommonModule, FormsModule, HttpClientModule],
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

  listaNotificaciones: string[] = []; 
  mostrarModalNotificaciones: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carga los datos automáticamente apenas abre la página
    this.refrescarTodo();
  }

  /**
   * Resetea filtros de búsqueda y jala los datos más recientes del servidor
   */
  refrescarTodo(): void {
    this.terminoBusqueda = '';
    this.categoriaSeleccionada = 'Todos';
    this.limpiarFormulario();
    this.obtenerProductosDB();
  }

  /**
   * Consume el backend para traer la lista actualizada de productos
   */
  obtenerProductosDB(): void {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.listaProductos = data;
        this.verificarStockCritico(); // Valida las alertas de stock bajo
      },
      error: (err) => console.error('Error cargando datos del servidor:', err)
    });
  }

  /**
   * Valida si quedan pocas unidades (menos de 2) y dispara la notificación
   */
  verificarStockCritico(): void {
    this.listaProductos.forEach(producto => {
      if (producto.cantidad < 2) {
        const yaExisteAlerta = this.listaNotificaciones.some(n => n.includes(`⚠️ STOCK BAJO: "${producto.nombre}"`));
        if (!yaExisteAlerta) {
          this.agregarNotificacion(`⚠️ STOCK BAJO: "${producto.nombre}" (Solo quedan ${producto.cantidad} u.).`);
        }
      }
    });
  }

  /**
   * Filtro dinámico en tiempo real para la barra de búsqueda
   */
  get productosFiltrados(): Producto[] {
    return this.listaProductos.filter(producto => {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      const coincideTexto = !termino || 
                            (producto.nombre && producto.nombre.toLowerCase().includes(termino)) || 
                            (producto.codigo && producto.codigo.toLowerCase().includes(termino));

      const coincideCategoria = this.categoriaSeleccionada === 'Todos' || 
                                (producto.categoria && producto.categoria.toLowerCase() === this.categoriaSeleccionada.toLowerCase());

      return coincideTexto && coincideCategoria;
    });
  }

  /**
   * Agrega un evento con hora actual al historial de notificaciones
   */
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
    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario(): void {
    this.productoEnEdicion = null;
    this.formNombre = '';
    this.formPrecio = null;
    this.formCantidad = null;
    this.formCodigo = '';
    this.formCategoria = 'General';
  }

  /**
   * Guarda o actualiza el producto y ejecuta la recarga automática en caliente
   */
  guardarProducto(): void {
    if (!this.formNombre || !this.formCodigo || this.formPrecio === null || this.formCantidad === null) {
      alert('Por favor, rellene todos los campos obligatorios del producto.');
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

    // CASO: EDITAR PRODUCTO (PUT)
    if (this.productoEnEdicion) {
      datosProducto.id = this.productoEnEdicion.id;
      this.alternarFormulario();

      this.http.put(`${this.apiUrl}/${datosProducto.id}`, datosProducto).subscribe({
        next: () => {
          // ALERTA CORREGIDA: Sin mencionar Postgres
          this.agregarNotificacion(`Se actualizó el producto: "${nombreGuardado}" (Código: ${codigoGuardado}).`);
          this.refrescarTodo(); // Fuerza la recarga inmediata en pantalla
        },
        error: (err) => {
          alert('Error al actualizar en la Base de Datos');
          this.refrescarTodo();
        }
      });

    // CASO: NUEVO PRODUCTO (POST)
    } else {
      this.alternarFormulario();

      this.http.post(this.apiUrl, datosProducto).subscribe({
        next: () => {
          // ALERTA CORREGIDA: Sin mencionar Postgres
          this.agregarNotificacion(`Se guardó el producto: "${nombreGuardado}".`);
          this.refrescarTodo(); // Fuerza la recarga inmediata en pantalla
        },
        error: (err) => {
          alert('Error al guardar en la Base de Datos');
          this.refrescarTodo();
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

  /**
   * Elimina un producto y limpia la interfaz al instante
   */
  eliminarProducto(id: number): void {
    const productoABorrar = this.listaProductos.find(p => p.id === id);
    if (productoABorrar && confirm(`¿Estás seguro de que deseas eliminar permanentemente "${productoABorrar.nombre}"?`)) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          // ALERTA CORREGIDA: Sin mencionar Postgres
          this.agregarNotificacion(`Se eliminó el producto: "${productoABorrar.nombre}".`);
          this.refrescarTodo(); // Fuerza la recarga inmediata en pantalla
        },
        error: (err) => alert('Error al eliminar de la Base de Datos')
      });
    }
  }
}