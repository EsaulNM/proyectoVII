import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  catalogoProductos = {
    productos: [
      { nombre: 'Papas Chicas', precio: 40 },
      { nombre: 'Papas Medianas', precio: 50 },
      { nombre: 'Papas Grandes', precio: 60 },
      { nombre: 'Salchipulpos Chicos', precio: 40 },
      { nombre: 'Salchipulpos Medianos', precio: 50 },
      { nombre: 'Salchipulpos Grandes', precio: 60 },
      { nombre: 'Combinado Chico', precio: 40 },
      { nombre: 'Combinado Mediano', precio: 50 },
      { nombre: 'Combinado Grande', precio: 60 },
      { nombre: 'Orden de Alitas', precio: 120 },
      { nombre: '1/2 orden de Alitas', precio: 70 },
      { nombre: 'Orden de Boneless', precio: 120 },
      { nombre: '1/2 orden de Boneless', precio: 70 },
      { nombre: 'Orden de Tenders', precio: 120 },
      { nombre: '1/2 orden de Tenders', precio: 70 },
    ]
  }

  productosSeleccionados: any[] = [];
  totalPrecio = 0;
  totalesProductos = 0;

  //Función para agregar productos al ticket y sacar el total y el numero de productos
  seleccionarProducto(producto: any) {
    this.productosSeleccionados.push(producto);
    
    let totalProductos = this.productosSeleccionados.length;
    this.totalesProductos = totalProductos;

    this.totalPrecio = 0;
    for (let producto of this.productosSeleccionados) {
      this.totalPrecio += producto.precio;
    }
  }

  //Función para limpiar todo el ticket
  limpiarTicket() {
    this.productosSeleccionados = [];
    this.totalPrecio = 0;
    this.totalesProductos = 0;
  }

  //Función para generar el pedido
  generarPedido() {
    console.log(this.productosSeleccionados)
  }

}
