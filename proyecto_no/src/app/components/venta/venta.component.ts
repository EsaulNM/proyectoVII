import { Component, OnInit, NgModule } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Producto {
  nombre: string;
  precio: number;
  salsas?: boolean;
  salsasSeleccionadas?: { id: string }[];
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  revisarPedidos() {
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
      { nombre: 'Orden de Alitas', precio: 120, salsas: true, },
      { nombre: '1/2 orden de Alitas', precio: 70, salsas: true, },
      { nombre: 'Orden de Boneless', precio: 120, salsas: true, },
      { nombre: '1/2 orden de Boneless', precio: 70, salsas: true, },
      { nombre: 'Orden de Tenders', precio: 120, salsas: true, },
      { nombre: '1/2 orden de Tenders', precio: 70, salsas: true, },
    ]
  }

  productosSeleccionados: any[] = [];
  totalPrecio = 0;
  totalesProductos = 0;

  nombre: any;
  telefono: any;
  direccion: any;
  observaciones: any;

  //Función para agregar productos al ticket y sacar el total y el numero de productos
  /*  seleccionarProducto(producto: any) {
     this.mostrarSeleccionSalsa(producto)
     this.productosSeleccionados.push(producto);
 
     let totalProductos = this.productosSeleccionados.length;
     this.totalesProductos = totalProductos;
 
     this.totalPrecio = 0;
     for (let producto of this.productosSeleccionados) {
       this.totalPrecio += producto.precio;
     }
   } */
  async seleccionarProducto(producto: any) {
    if (producto.salsas) {
      // Mostrar el diálogo para seleccionar las salsas solo si el producto tiene salsas
      const salsasSeleccionadas = await this.mostrarSeleccionSalsa(producto);

      // Agregar el ID de las salsas seleccionadas al objeto producto
      producto.salsasSeleccionadas = salsasSeleccionadas;
    }

    // Agregar el producto a la lista de productos seleccionados
    this.productosSeleccionados.push(producto);
    console.log(this.productosSeleccionados);

    // Calcular el total de productos
    this.totalesProductos = this.productosSeleccionados.length;

    // Calcular el total de precios
    this.totalPrecio = this.productosSeleccionados.reduce((total, producto) => total + producto.precio, 0);
  }


  //Función para mostrar la selección de salsas solo cuando el producto del menu sea true en la varible salsas
  async mostrarSeleccionSalsa(producto: any): Promise<{ id: string }[]> {
    return new Promise<{ id: string }[]>((resolve) => {
      (async () => {
        if (producto.salsas) {
          const { value: accept } = await Swal.fire({
            title: "Selecciona las salsas",
            html: ` 
          <div class="container">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="1" id="Bufalo">
                  <label class="form-check-label text-right" for="Bufalo">
                    Bufalo
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="2" id="Bufalo H">
                  <label class="form-check-label text-right" for="Bufalo H">
                    Bufalo Habanero
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="3" id="Lemon Condimento">
                  <label class="form-check-label text-right" for="Lemon Condimento">
                    Lemon Pepper (Condimento)
                  </label>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="4" id="BBQ">
                  <label class="form-check-label text-right" for="BBQ">
                    BBQ
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="5" id="BBQ H">
                  <label class="form-check-label text-right" for="BBQ H">
                    BBQ Habanero
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="6" id="Lemon Salsa">
                  <label class="form-check-label text-right" for="Lemon Salsa">
                    Lemon Pepper (Salsa)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>`,
            focusConfirm: false,
            confirmButtonText: "Agregar",
            width: "700px",
          });

          if (accept) {
            // Almacena los valores y los IDs de los checkboxes seleccionados
            const salsasSeleccionadas: { id: string }[] = [];
            const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
            checkboxes.forEach((checkbox) => {
              salsasSeleccionadas.push({
                id: checkbox.id,
              });
            });
            // Resuelve la promesa con las salsas seleccionadas
            resolve(salsasSeleccionadas);
          } else {
            // Si no se seleccionaron salsas, resuelve la promesa con un array vacío
            resolve([]);
          }
        }
      })();
    });
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
        status: 1,
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
        confirmButtonText: 'Imprimir Ticket',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(nuevoPedido)
          this.imprimirTicket(nuevoPedido)
        }
      });


      // Limpiamos los campos del ticket
      this.limpiarTicket();
    }
  }
  

//Función para imprimir el ticket
imprimirTicket(pedido: any) {
  // Generar el contenido del ticket en formato HTML
  const contenidoTicket = `
  <div style="text-align: center;">
      <h1 style="font-size: 24px;">Snack&Go</h1>
      <p style="font-size: 16px;">Dirección: Calle Ejemplo #123</p>
      <p style="font-size: 16px;">Teléfono: 123-456-7890</p>
      <hr style="margin-top: 10px; margin-bottom: 10px;">
      <h2 style="font-size: 20px;">Detalles del Pedido</h2>
      <p style="font-size: 16px;">Número de Pedido: ${pedido.numeroPedido}</p>
      <p style="font-size: 16px;">Fecha y Hora: ${pedido.fechaHora}</p>
      <p style="font-size: 16px;">Cliente: ${pedido.nombre}</p>
      <p style="font-size: 16px;">Teléfono: ${pedido.telefono}</p>
      <p style="font-size: 16px;">Dirección: ${pedido.direccion}</p>
      <p style="font-size: 16px;">Observaciones: ${pedido.observaciones || 'Ninguna'}</p>
      <hr style="margin-top: 10px; margin-bottom: 10px;">

      <h3 style="font-size: 18px;">Productos</h3>
      <ul style="margin: 0; padding: 0; list-style: none;">
      ${pedido.productos.map((producto: any) => `
          <li style="font-size: 16px;">${producto.nombre} - $${producto.precio}</li>
          ${producto.salsas ? `
              <ul style="margin: 0; padding: 0; list-style: none;">
                  <li style="font-size: 16px;">Salsas Seleccionadas:</li>
              </ul>
          ` : ''}
      `).join('')}
      </ul>

      <p style="font-size: 16px;">Total de Productos: ${pedido.totalProductos}</p>
      <p style="font-size: 16px;">Total: $${pedido.totalPrecio}</p>
  </div>`;

  // Crear un nuevo elemento div para contener el contenido del ticket
  const ticketElement = document.createElement('div');
  ticketElement.innerHTML = contenidoTicket;

  // Establecer los estilos CSS para los márgenes de la página
  const style = document.createElement('style');
  style.innerHTML = `
      @media print {
          @page {
              margin: 0;
              margin-top: 0;
          }
          body {
              margin-top: 0;
          }
      }
  `;
  document.head.appendChild(style);

  // Agregar el contenido del ticket al cuerpo del documento
  document.body.appendChild(ticketElement);

  // Mostrar el cuadro de diálogo de impresión
  window.print();

  // Remover el contenido del ticket y los estilos del cuerpo del documento después de imprimir
  document.body.removeChild(ticketElement);
  document.head.removeChild(style);
}

 




}
