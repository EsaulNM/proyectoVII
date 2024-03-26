import { Component, OnInit, NgModule } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  revisarPedidos(){
    this.router.navigate(['tickets'])
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

  nombre: any;
  telefono: any;
  direccion : any;
  observaciones: any;

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

  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
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

    this.nombre = '';
    this.telefono = '';
    this.direccion = '';
    this.observaciones = '';
  }
  

  //Función para obtener los pedidos actuales
  getPedidosFromLocalStorage(): any[] {
    const pedidosString = localStorage.getItem('pedidos');
    if (pedidosString) {
      return JSON.parse(pedidosString);
    } else {
      return [];
    }
  }
  
  //Función para generar el pedido
  generarPedido() {
    if (!this.nombre || !this.telefono || !this.direccion) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, completa los campos de nombre, teléfono y dirección para continuar.',
        confirmButtonText: 'Ok'
      });
    } else {
      // Obtenemos todos los pedidos existentes del almacenamiento local
      const pedidos = this.getPedidosFromLocalStorage();
  
      // Obtenemos el último número de pedido
      let ultimoNumeroPedido = 0;
      if (pedidos.length > 0) {
        // Si hay pedidos existentes, obtenemos el número del último pedido
        ultimoNumeroPedido = pedidos[pedidos.length - 1].numeroPedido;
      }
  
      // Incrementamos el número de pedido para el nuevo pedido
      ultimoNumeroPedido++;
  
      const fechaHora = new Date().toLocaleString();
      
      // Creamos el nuevo pedido
      const nuevoPedido = {
        numeroPedido: ultimoNumeroPedido,
        fechaHora: fechaHora,
        nombre: this.nombre,
        telefono: this.telefono,
        direccion: this.direccion,
        observaciones: this.observaciones,
        productos: this.productosSeleccionados, 
        totalProductos: this.totalesProductos,
        totalPrecio: this.totalPrecio,
      };
  
      // Agregamos el nuevo pedido al array de pedidos
      pedidos.push(nuevoPedido);
  
      // Guardamos el array actualizado de pedidos en el almacenamiento local
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
  
      // Mostramos un mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Pedido Generado',
        text: `Pedido Generado: ${fechaHora}`,
        confirmButtonText: 'Ok'
      });
  
      // Limpiamos los campos del ticket
      this.limpiarTicket();
    }
  }

}
