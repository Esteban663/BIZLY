import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definimos cómo luce un Producto
interface Producto {
  id: number;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  estado: 'Activo' | 'Nuevo' | 'Agotado';
  imagen?: string; // Ruta de la imagen o logo establecido
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']})
export class ProductosComponent {

  private readonly logoPredeterminado = 'assets/LogoBizly.png';

  // Lista inicial simulando la base de datos con los datos de tu diseño
  listaProductos: Producto[] = [
    { id: 1, nombre: 'Producto Ejemplo 1', sku: 'SKU-001', precio: 10.00, stock: 10, estado: 'Activo', imagen: this.logoPredeterminado }
  ];

  constructor() {}

  // C - Crear
  crearProducto() {
    const nuevoNombre = prompt('Introduce el nombre del nuevo producto:');
    if (nuevoNombre) {
      const nuevoProd: Producto = {
        id: Date.now(), // Genera un ID temporal único
        nombre: nuevoNombre,
        sku: 'SKU-' + Math.floor(Math.random() * 1000),
        precio: 15.50,
        stock: 5,
        estado: 'Nuevo',
        imagen: this.logoPredeterminado
      };
      this.listaProductos.push(nuevoProd);
    }
  }

  // R - Leer (Ya se ejecuta automáticamente en la tabla mediante el *ngFor)

  // U - Actualizar
  editarProducto(producto: Producto) {
    const nuevoNombre = prompt('Editar nombre del producto:', producto.nombre);
    if (nuevoNombre) {
      producto.nombre = nuevoNombre;
    }
  }

  // D - Borrar
  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.listaProductos = this.listaProductos.filter(p => p.id !== id);
    }
  }
}