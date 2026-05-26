import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  estado: string;
  imagen: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent {
  private readonly logoPredeterminado = 'assets/LogoBizly.png';

  @ViewChild('txtNombre') txtNombre!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPrecio') txtPrecio!: ElementRef<HTMLInputElement>;
  @ViewChild('txtStock') txtStock!: ElementRef<HTMLInputElement>;
  @ViewChild('txtSku') txtSku!: ElementRef<HTMLInputElement>;
  @ViewChild('selectEstado') selectEstado!: ElementRef<HTMLSelectElement>;

  listaProductos: Producto[] = [
    { id: 1, nombre: 'Producto Ejemplo 1', sku: 'SKU-001', precio: 10.00, stock: 10, estado: 'Activo', imagen: this.logoPredeterminado }
  ];

  // INTERFAZ, BUSQUEDA Y FILTROS
  mostrarFormulario: boolean = false;
  imagenPrevisualizada: string = this.logoPredeterminado;
  productoEnEdicion: Producto | null = null;
  terminoBusqueda: string = '';
  estadoSeleccionado: string = 'Todos';

  // CONTROL DE NOTIFICACIONES (MODAL)
  listaNotificaciones: string[] = []; 
  mostrarModalNotificaciones: boolean = false; // Controla la ventana emergente de alertas

  constructor() {}

  get productosFiltrados(): Producto[] {
    return this.listaProductos.filter(producto => {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      const coincideTexto = !termino || 
                            producto.nombre.toLowerCase().includes(termino) || 
                            producto.sku.toLowerCase().includes(termino);

      const coincideEstado = this.estadoSeleccionado === 'Todos' || 
                             producto.estado.toLowerCase() === this.estadoSeleccionado.toLowerCase();

      return coincideTexto && coincideEstado;
    });
  }

  // Registra alertas con la hora exacta
  agregarNotificacion(mensaje: string) {
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.listaNotificaciones.unshift(`[${horaFormateada}] ${mensaje}`);
  }

  // Abre y cierra el modal de notificaciones
  alternarModalNotificaciones() {
    this.mostrarModalNotificaciones = !this.mostrarModalNotificaciones;
  }

  // Vacía el historial de alertas
  limpiarNotificaciones() {
    this.listaNotificaciones = [];
  }

  alternarFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.productoEnEdicion = null;
      this.imagenPrevisualizada = this.logoPredeterminado;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrevisualizada = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarProducto(nombre: string, sku: string, precio: string, stock: string, estado: string) {
    if (!nombre || !sku || !precio || !stock) {
      alert('Por favor, rellene todos los campos del producto.');
      return;
    }

    if (this.productoEnEdicion) {
      this.productoEnEdicion.nombre = nombre;
      this.productoEnEdicion.sku = sku;
      this.productoEnEdicion.precio = parseFloat(precio);
      this.productoEnEdicion.stock = parseInt(stock, 10);
      this.productoEnEdicion.estado = estado;
      this.productoEnEdicion.imagen = this.imagenPrevisualizada;
      
      this.agregarNotificacion(`Se actualizó el producto: "${nombre}" (SKU: ${sku}).`);
      this.productoEnEdicion = null;
    } else {
      const nuevoProd: Producto = {
        id: Date.now(),
        nombre: nombre,
        sku: sku,
        precio: parseFloat(precio),
        stock: parseInt(stock, 10),
        estado: estado || 'Nuevo',
        imagen: this.imagenPrevisualizada
      };
      this.listaProductos.push(nuevoProd);

      this.agregarNotificacion(`Se agregó un nuevo producto: "${nombre}".`);
    }

    this.alternarFormulario();
  }

  editarProducto(producto: Producto) {
    this.productoEnEdicion = producto;
    this.mostrarFormulario = true;
    this.imagenPrevisualizada = producto.imagen;

    setTimeout(() => {
      if (this.txtNombre) this.txtNombre.nativeElement.value = producto.nombre;
      if (this.txtPrecio) this.txtPrecio.nativeElement.value = producto.precio.toString();
      if (this.txtStock) this.txtStock.nativeElement.value = producto.stock.toString();
      if (this.txtSku) this.txtSku.nativeElement.value = producto.sku;
      if (this.selectEstado) this.selectEstado.nativeElement.value = producto.estado;
    }, 50);
  }

  eliminarProducto(id: number) {
    const productoABorrar = this.listaProductos.find(p => p.id === id);
    if (productoABorrar && confirm(`¿Estás seguro de que deseas eliminar el producto "${productoABorrar.nombre}"?`)) {
      this.listaProductos = this.listaProductos.filter(p => p.id !== id);
      this.agregarNotificacion(`Se eliminó el producto: "${productoABorrar.nombre}".`);
    }
  }
}