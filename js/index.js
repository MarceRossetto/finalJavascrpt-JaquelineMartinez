"use strict"

//-- Constantes--

const KEY_ESPECTACULOS = "espectaculos";
const ARREGLO_MENU = [
  { tipo: "PELICULA", texto: "CINE" },
  { tipo: "RECITAL", texto: "RECITALES" },
  { tipo: "TEATRO", texto: "TEATRO" },
];

//-- Class Espectaculo--

class Espectaculo {
  constructor(datosEspectaculo) {
    this.id = parseInt(datosEspectaculo.id);
    this.tipo = datosEspectaculo.tipo; 
    this.nombre = datosEspectaculo.nombre;
    this.lugar = datosEspectaculo.lugar;
    this.precio = parseFloat(datosEspectaculo.precio);
    this.stockEntradas = parseInt(datosEspectaculo.stockEntradas);
    this.imagen = datosEspectaculo.imagen;
    this.entradasVendidas = (datosEspectaculo.entradasVendidas || 0);
  }

  set actualizarEntradas(cantidad) {
    this.stockEntradas -= cantidad;
    this.entradasVendidas += cantidad;
    return true;
  }

  get obtenerStock() {
    return this.stockEntradas;
  }

  comprarEntradas(cantidad) {
    this.actualizarEntradas = cantidad;
  }

  devolverEntradas(cantidad) {
    this.actualizarEntradas = -cantidad;
  }
}

//-- Elementos del carro--

class ItemCarrito {
  constructor(nuevoItem) {
    this.id = nuevoItem.id;
    this.tipo = nuevoItem.tipo;
    this.nombre = nuevoItem.nombre;
    this.precio = nuevoItem.precio;
    this.lugar = nuevoItem.lugar;
    this.cantidad = nuevoItem.cantidad;
    this.imagen = nuevoItem.imagen;
  }
}

//-- Funciones--

const imprimirBotonesPagoCarrito = (espectaculos, carrito) => {
  const total = calcularTotalAPagar(carrito);
  $('#boton-pago').hide()
    .append(`<div class="container pagos-container">
                <h5 class="carrito-total text-center">El total a pagar es de: $${total}.</h5>
              <div>
              <button id="idButtonPagoCarrito" class="btn btn-success">Finalizar Compra</button>
              <button id="idButtonVaciarCarrito" class="btn btn-danger">Vaciar Carrito</button><div><div>`
    )
    .fadeIn(500);
  $("#idButtonPagoCarrito").click(() => { finalizarCompra(espectaculos, carrito) });
  $("#idButtonVaciarCarrito").click(() => { vaciarCarrito(espectaculos, carrito) });
}


const eliminarBotonesPagoCarrito = () => {
  $('#boton-pago').empty();
}


const actualizarCantidadDisponibleEnTarjeta = (espectaculo) => {
  
  const idTarjetaEspectaculo = `${espectaculo.id}_cantidad`;
  
  $(`#${idTarjetaEspectaculo}`)
    .attr({ 'max': espectaculo.obtenerStock })
    .val('0');

  if (espectaculo.obtenerStock === 0) {
    
    const idTarjetaEspectaculo = `espectaculo_${espectaculo.id}`;
    const idButtonTarjetaEspectaculo = `button_${idTarjetaEspectaculo}`;
    const idCantidadTarjetaEspectaculo = `${idTarjetaEspectaculo}_cantidad`;
    const idDivButtonTarjetaEspectaculo = `div_button_${idTarjetaEspectaculo}`;
    $(`#${idDivButtonTarjetaEspectaculo}`).attr('class', 'disabled');     
    $(`#${idButtonTarjetaEspectaculo}`).attr('class', 'btn btn-danger');  
    $(`#${idCantidadTarjetaEspectaculo} input`).addClass('disabled').prop('disabled', true); 
  }
}

const agregarAlCarrito = (espectaculo, carrito) => {
  const idTarjetaEspectaculo = `${espectaculo.id}_cantidad`;  

  if ($(`#${idTarjetaEspectaculo}`)) {        
    const cantEntradas = parseInt($(`#${idTarjetaEspectaculo}`).val()); 
    if (cantEntradas && cantEntradas > 0 && cantEntradas <= espectaculo.obtenerStock) {   
      let pos = carrito.findIndex(elemento => elemento.id === espectaculo.id);   
      if (pos >= 0) {            
        carrito[pos].cantidad = carrito[pos].cantidad + cantEntradas;
      } else {
        const item = new ItemCarrito({
          id: espectaculo.id,
          tipo: espectaculo.tipo,
          nombre: espectaculo.nombre,
          precio: espectaculo.precio,
          lugar: espectaculo.lugar,
          imagen: espectaculo.imagen,
          cantidad: cantEntradas,
        });
        carrito.push(item);
      }
      espectaculo.comprarEntradas(cantEntradas);  
      actualizarCantidadDisponibleEnTarjeta(espectaculo);  
      mostrarMensajeEnModal(`Se agregaron ${cantEntradas} entradas para "${espectaculo.nombre}" al carrito`);
    } else if (cantEntradas === 0) {
      mostrarMensajeEnModal("Por favor seleccione la cantidad de entradas", true);
    } else if (cantEntradas > espectaculo.obtenerStock) {
      mostrarMensajeEnModal(`Superó el número de entradas disponibles. Para "${espectaculo.nombre}" quedan ${espectaculo.obtenerStock} entradas.`, true);
    }
  }
}

const calcularTotalAPagar = (carrito) => {
  let total = 0;
  carrito.forEach(item => { total += (item.cantidad * item.precio) });
  return total;
}

const eliminarItemsCarrito = (carrito) => {
  while (carrito.length > 0) { carrito.pop() };
}

const vaciarCarrito = (espectaculos, carrito) => {
  
  carrito.forEach((item, i) => {
    let pos = espectaculos.findIndex(elemento => elemento.id === item.id); 
    espectaculos[pos].devolverEntradas(item.cantidad);                    
  });
  eliminarItemsCarrito(carrito);                                
  imprimirTarjetasFiltradas(espectaculos, "CARRITO", carrito);  
}

const actualizarTotalPago = (espectaculos, carrito) => {
  eliminarBotonesPagoCarrito();
  imprimirBotonesPagoCarrito(espectaculos, carrito);
}

const eliminarDelCarrito = (espectaculos, carrito, itemCarrito) => {
  const pos = carrito.findIndex(elemento => elemento.id === itemCarrito.id);  
  const posEspectaculo = espectaculos.findIndex(elemento => elemento.id === itemCarrito.id);  
  espectaculos[posEspectaculo].devolverEntradas(carrito[pos].cantidad); 
  carrito.splice(pos, 1);   
  eliminarLaTarjeta(itemCarrito);
  mostrarMensajeEnModal(`${itemCarrito.nombre} fue eliminado del carrito`, true);
  if (carrito.length === 0) {
    imprimirTarjetasFiltradas(espectaculos, "CARRITO", carrito)
  } else {
    actualizarTotalPago(espectaculos, carrito);
  };
}

const agregarCompraAStorage = (carrito) => {
  
  if (localStorage.getItem("compras")) {
    let comprasStorage = JSON.parse(localStorage.getItem("compras"));
    comprasStorage.push(carrito);
    localStorage.setItem("compras", JSON.stringify(comprasStorage));
  } else {
    const listaDeCompras = [carrito];
    localStorage.setItem("compras", JSON.stringify(listaDeCompras));
  }
}

const finalizarCompra = (espectaculos, carrito) => {
  agregarCompraAStorage(carrito);   
  eliminarItemsCarrito(carrito);
  eliminarTarjetas();
  eliminarBotonesPagoCarrito();
  localStorage.setItem(KEY_ESPECTACULOS, JSON.stringify(espectaculos));   
  mostrarMensajeEnModal("Se realizó el pago. Gracias por su compra.");  
  imprimirTarjetasFiltradas(espectaculos, "CARRITO", carrito);
}


const buscador = (espectaculos, carrito, busqueda) => {
  $('#cardsId').addClass('search');
  let mensajeDeBusqueda = '';
  if (busqueda.trim() === '') {
    mensajeDeBusqueda = 'Error: Escribí tu busqueda.';
  } else {
    const listaResultados = espectaculos.filter(espectaculo => espectaculo.nombre.toLowerCase().includes(`${busqueda.trim().toLowerCase()}`));
    if (listaResultados.length === 0) {
      mensajeDeBusqueda = `No se encontró ningún espectáculo que incluya "${busqueda}" en su nombre.`;
    } else {
      mensajeDeBusqueda = `Resultado de la busqueda "${busqueda}":`;
      listaResultados.forEach(espectaculo => {
        imprimirTarjeta(espectaculo, carrito);
      });
      fadeInTarjetas();
    }
  }
  mostrarMensaje(mensajeDeBusqueda);
}


const crearEspectaculo = (element) => {
  const espectaculo = new Espectaculo({
    id: element.id,
    tipo: element.tipo,
    nombre: element.nombre,
    lugar: element.lugar,
    precio: element.precio,
    stockEntradas: element.stockEntradas,
    imagen: element.imagen,
    entradasVendidas: element.entradasVendidas,
  });
  return espectaculo;
}

const iniciarPagina = (listaConvertida, carrito) => {
   
  crearMenuNavBar(ARREGLO_MENU, listaConvertida, carrito);      
  crearCarousel();                                                                    
  crearFormulario();                                                                 
  imprimirTarjetasFiltradas(listaConvertida, "INICIO", carrito) 
}

const convertirEspectaculosStorageEIniciarPagina = (listaStorage, listaConvertida, carrito) => {
 
  listaStorage.forEach(element => {
    const espectaculo = crearEspectaculo(element);
    listaConvertida.push(espectaculo);
  });
  iniciarPagina(listaConvertida, carrito);
}

const inicializarDatosYPagina = (espectaculosStorageConvertidos, listaDeCarrito) => {
  
  if (!localStorage.key(KEY_ESPECTACULOS)) {
    
    const URLJSON = "../json/espectaculos.json";
    
    $.getJSON(URLJSON, (listaDeEspectaculos, estado) => {
      if (estado === "success") {
        
        localStorage.setItem(KEY_ESPECTACULOS, JSON.stringify(listaDeEspectaculos));
        convertirEspectaculosStorageEIniciarPagina(listaDeEspectaculos, espectaculosStorageConvertidos, listaDeCarrito);  
      }
    })
  } else {
    const espectaculosStorage = JSON.parse(localStorage.getItem(KEY_ESPECTACULOS));            
    convertirEspectaculosStorageEIniciarPagina(espectaculosStorage, espectaculosStorageConvertidos, listaDeCarrito);  
  }
}

//-- Variables--


let listaDeCarrito = [];


const espectaculosStorageConvertidos = [];

//-- Programa principal

//-- CARGAR DE ARCHIVO JSON, GUARDAR EN STORAGE, CARGAR DE STORAGE, CREAR NUEVO ARREGLO CON OBJETOS ESPECTACULO, CREA SECCIONES DE LA PAGINA --
inicializarDatosYPagina(espectaculosStorageConvertidos, listaDeCarrito);

window.onbeforeunload = function () {
  scrollTop();
};