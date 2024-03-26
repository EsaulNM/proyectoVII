import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor() { }

  pedidos: any;

  ngOnInit() {
    this.pedidos = this.getPedidosFromLocalStorage();
    console.log(this.pedidos)
  }
  
  getPedidosFromLocalStorage(): any[] {
    const pedidosString = localStorage.getItem('pedidos');
    if (pedidosString) {
      return JSON.parse(pedidosString);
    } else {
      return [];
    }
  }
  
  eliminarPedido(numeroPedido: number) {
    const pedidos = this.getPedidosFromLocalStorage();
    const index = pedidos.findIndex((pedido: any) => pedido.numeroPedido === numeroPedido);
    if (index !== -1) {
      pedidos.splice(index, 1);
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
      console.log(`Pedido ${numeroPedido} eliminado.`);
      this.pedidos = this.getPedidosFromLocalStorage();
    } else {
      console.log(`No se encontró el pedido ${numeroPedido}.`);
    }
  }
  
    
}
