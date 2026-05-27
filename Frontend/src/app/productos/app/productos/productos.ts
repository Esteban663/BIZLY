import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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

  @ViewChild('txtNombre') txtNombre!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPrecio') txtPrecio!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCantidad') txtCantidad!: ElementRef<HTMLInputElement>;
  @ViewChild('txtCodigo') txtCodigo!: ElementRef<HTMLInputElement>;
  @ViewChild('selectCategoria') selectCategoria!: ElementRef<HTMLSelectElement>;

  listaProductos: Producto[] = [];

  mostrarFormulario: boolean = false;
  productoEnEdicion: Producto | null = null;
  terminoBusqueda: string = '';
  categoriaSeleccionada: string = 'Todos';

  listaNotificaciones: string[] = []; 
  mostrarModalNotificaciones: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProductosDB();
  }

  obtenerProductosDB() {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.listaProductos = data;
      },
      error: (err) => console.error('Error cargando datos de la base de datos:', err)
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

      return coincideTexto && coincideCategoria;
    });
  }

  agregarNotificacion(mensaje: string) {
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.listaNotificaciones.unshift(`[${horaFormateada}] ${mensaje}`);
  }

  alternarModalNotificaciones() {
    this.mostrarModalNotificaciones = !this.mostrarModalNotificaciones;
  }

  limpiarNotificaciones() {
    this.listaNotificaciones = [];
  }

  alternarFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.productoEnEdicion = null;
    }
  }

  guardarProducto(nombre: string, codigo: string, precio: string, cantidad: string, categoria: string) {
    if (!nombre || !codigo || !precio || !cantidad) {
      alert('Por favor, rellene todos los campos obligatorios del producto.');
      return;
    }

    const datosProducto: any = {
      nombre: nombre,
      codigo: codigo,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad, 10),
      categoria: categoria || 'General'
    };

    // 1. REVISAMOS PRIMERO SI ES EDICIÓN ANTES DE CERRAR EL MODAL
    if (this.productoEnEdicion) {
      datosProducto.id = this.productoEnEdicion.id;
      
      // Ahora sí, cerramos el formulario de forma segura
      this.alternarFormulario();

      // Petición de actualización (PUT)
      this.http.put(`${this.apiUrl}/${datosProducto.id}`, datosProducto).subscribe({
        next: () => {
          // Mensaje exacto de actualización
          this.agregarNotificacion(`Se actualizó: "${nombre}" (Código: ${codigo}).`);
          this.obtenerProductosDB(); 
        },
        error: (err) => {
          alert('Error al actualizar en la Base de Datos');
          this.obtenerProductosDB();
        }
      });

    } else {
      // Si no hay producto en edición, es uno nuevo
      this.alternarFormulario();

      // Petición de guardado nuevo (POST)
      this.http.post(this.apiUrl, datosProducto).subscribe({
        next: () => {
          // Mensaje exacto de guardado
          this.agregarNotificacion(`Se guardó: "${nombre}".`);
          this.obtenerProductosDB(); 
        },
        error: (err) => {
          alert('Error al guardar en la Base de Datos');
          this.obtenerProductosDB();
        }
      });
    }
  }

  editarProducto(producto: Producto) {
    this.mostrarFormulario = true;
    this.productoEnEdicion = producto;

    setTimeout(() => {
      if (this.txtNombre) this.txtNombre.nativeElement.value = producto.nombre || '';
      if (this.txtPrecio) this.txtPrecio.nativeElement.value = producto.precio ? producto.precio.toString() : '';
      if (this.txtCantidad) this.txtCantidad.nativeElement.value = producto.cantidad ? producto.cantidad.toString() : '';
      if (this.txtCodigo) this.txtCodigo.nativeElement.value = producto.codigo || '';
      if (this.selectCategoria) this.selectCategoria.nativeElement.value = producto.categoria || 'General';
    }, 50);
  }

  eliminarProducto(id: number) {
    const productoABorrar = this.listaProductos.find(p => p.id === id);
    if (productoABorrar && confirm(`¿Estás seguro de que deseas eliminar permanentemente "${productoABorrar.nombre}"?`)) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.agregarNotificacion(`Se eliminó: "${productoABorrar.nombre}".`);
          this.obtenerProductosDB(); 
        },
        error: (err) => alert('Error al eliminar de la Base de Datos')
      });
    }
  }
}