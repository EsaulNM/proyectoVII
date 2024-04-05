import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';



interface Pedido {
  numeroPedido: number;
  fechaHora: string;
  nombre: string;
  telefono: string;
  direccion: string;
  productos: { nombre: string, precio: number, salsas?: boolean, salsasSeleccionadas?: { id: string }[] }[];
  totalProductos: number;
  totalPrecio: number;
  status: number;
  observaciones?: string;
}

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor() { }

  pedidos: any;
  pedidosEnProceso: any;
  pedidosTerminados: any;

  ngOnInit() {
    this.pedidos = this.getPedidosFromLocalStorage();
    console.log(this.pedidos)

    const pedidos: Pedido[] = this.pedidos;

    this.pedidosEnProceso = pedidos.filter((pedido: Pedido) => pedido.status === 1);
    console.log(this.pedidosEnProceso)

    this.pedidosTerminados = pedidos.filter((pedido: Pedido) => pedido.status === 2);
    console.log(this.pedidosTerminados)

  }

  getPedidosFromLocalStorage(): any[] {
    const pedidosString = localStorage.getItem('pedidos');
    if (pedidosString) {
      return JSON.parse(pedidosString);
    } else {
      return [];
    }
  }

  //Función para eliminar un pedido
  eliminarPedido(numeroPedido: number) {
    // Mostrar un SweetAlert para confirmar la eliminación del pedido
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Seguro que quieres eliminar el pedido ${numeroPedido}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'swal2-confirm-custom-button' // Aplica la clase CSS personalizada al botón de confirmación
      }
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la eliminación, procede a eliminar el pedido
            const pedidos = this.getPedidosFromLocalStorage();
            const index = pedidos.findIndex((pedido: any) => pedido.numeroPedido === numeroPedido);
            if (index !== -1) {
                pedidos.splice(index, 1);
                localStorage.setItem('pedidos', JSON.stringify(pedidos));
                console.log(`Pedido ${numeroPedido} eliminado.`);
                this.pedidos = this.getPedidosFromLocalStorage();
                this.ngOnInit();
            } else {
                console.log("No se pudo eliminar el pedido");
            }
        }
    });
}

  //Función para marcar pedido en proceso a pedido entregado
  marcarPedidoTerminado(numeroPedido: number) {
    console.log(numeroPedido)
    const pedidos: Pedido[] = this.pedidos;
    const pedido = pedidos.find(pedido => pedido.numeroPedido === numeroPedido);
    console.log(pedido)
    if (pedido) {
      // Cambiamos el estado del pedido a 2
      pedido.status = 2;
      // Actualizamos los pedidos en la vista
      this.actualizarPedidosLocalStorage();
    }
  }

  regresarPedidoEnProceso(numeroPedido: number) {
    console.log(numeroPedido)
    const pedidos: Pedido[] = this.pedidos;
    const pedido = pedidos.find(pedido => pedido.numeroPedido === numeroPedido);
    console.log(pedido)
    if (pedido) {
      // Cambiamos el estado del pedido a 1
      pedido.status = 1;
      // Actualizamos los pedidos en la vista
      this.actualizarPedidosLocalStorage();
    }

  }

  //Función para actualizar los pedidos en la vista
  actualizarPedidosLocalStorage() {
    // Convierte los pedidos a una cadena JSON y los guardamos en localStorage
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
    this.ngOnInit();
  }

   //Función para Editar 
   editarPedido(data : any) {
    console.log(data)
    this.nombre = data.nombre;
    this.telefono = data.telefono;
    this.direccion = data.direccion;
    this.productosSeleccionados = data.productos;
    this.totalPrecio = data.totalPrecio;
    this.totalesProductos = data.totalProductos;
    this.status = data.status;
    this.fechaHora = data.fechaHora;
    this.nPedido = data.numeroPedido;
    
  }

  //Información y funciones para el moodal de editar productos.
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
  nPedido: any;
  fechaHora: any;
  status: any;
  nombre: any;
  telefono: any;
  direccion: any;
  observaciones: any;


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


  guardarCambios(){
    let cambioPedido = this.pedidos.findIndex((pedido: Pedido) => pedido.numeroPedido === this.nPedido );
    if (cambioPedido !== -1) {
      console.log(this.pedidos)
      console.log(cambioPedido);
      console.log(this.pedidos[cambioPedido])

      this.pedidos[cambioPedido].nombre = this.nombre; 
      this.pedidos[cambioPedido].telefono = this.telefono; 
      this.pedidos[cambioPedido].direccion = this.direccion;
      this.pedidos[cambioPedido].productos = this.productosSeleccionados;  
      this.pedidos[cambioPedido].totalPrecio = this.totalPrecio;
      this.pedidos[cambioPedido].totalProductos = this.totalesProductos;  
      //this.pedidos[cambioPedido].status = this.status;
      //this.pedidos[cambioPedido].fechaHora = this.fechaHora;  

      localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
     
      Swal.fire({
        icon: 'success',
        title: 'Pedido Generado',
        text: 'Se guardo correctamente',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("guardar cambios")
          location.reload()
        }
      });
    } else {
      // Si no se encuentra el pedido, muestra un mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el pedido para modificar',
        confirmButtonText: 'OK',
      });
    }


    /* const pedido = {
        numeroPedido: this.nPedido,
        fechaHora: this.fechaHora,
        nombre: this.nombre,
        telefono: this.telefono,
        direccion: this.direccion,
        observaciones: this.observaciones,
        productos: this.productosSeleccionados,
        totalProductos: this.totalesProductos,
        totalPrecio: this.totalPrecio,
        status: this.status,
    }
    console.log(pedido)
    console.log("guardar cambios")
    Swal.fire({
      icon: 'success',
      title: 'Pedido Generado',
      text: 'Se guardo correctamente',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("guardar cambios")
        location.reload()
      }
    }); */
  }
}
