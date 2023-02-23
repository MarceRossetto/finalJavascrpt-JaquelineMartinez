//--Tarjetas--
"use strict"

//--Funciones--

const crearTarjeta = (espectaculo, idTarjetaEspectaculo, idButtonTarjetaEspectaculo, esCarrito = false) => {
  const tipoEspectaculo = espectaculo.tipo.toLowerCase();
  let entradas = '<div class="agotado"><strong> Agotado </strong></div>'; 
  let precio = esCarrito ? espectaculo.precio * espectaculo.cantidad : espectaculo.precio;    
  if (esCarrito || espectaculo.stockEntradas > 0) {
    
    const cantidadEntradas = esCarrito ? espectaculo.cantidad : `<input type="number" class="input-cantidad" id="${espectaculo.id}_cantidad" name="cantidad" min="0" max="${espectaculo.obtenerStock}" value="${espectaculo.cantidad || 0}">`;
    const cantidadClasses = esCarrito ? '' : ' d-flex flex-row';
    entradas = `<div id="${idTarjetaEspectaculo}_cantidad" class="cantidad ${cantidadClasses}">
                  <label for="cantidadEntradas">Cantidad:</label>
                  ${cantidadEntradas}
                </div>
                <div id="div_${idButtonTarjetaEspectaculo}">
                  <button id="${idButtonTarjetaEspectaculo}" class="btn btn-primary card-btn"></button>
                </div>`;
  }
  return `<div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center my-5 ${esCarrito && 'carrito'}" id="${idTarjetaEspectaculo}">
            <div class="card p-3 bg-white rounded" style="width: 100%;">
              <img src="${espectaculo.imagen}" class="card-img-top" alt="">
              <div class="card-body">
                <h5 class="card-title text-left">${espectaculo.nombre}</h5>
                <div class="d-flex justify-content-between flex-row">
                  <p class="card-text text-left ${tipoEspectaculo}">${tipoEspectaculo}</p>    
                  <p class="card-text text-left precio"><strong>$ ${precio}</strong></p>  
                </div>          
                <div class="d-flex justify-content-between flex-row">                
                  ${entradas}
                </div>
              </div>
            </div>
          </div>`;
}

const imprimirTarjeta = (espectaculo, carrito) => {
  // Creo Tarjeta
  const idTarjetaEspectaculo = `espectaculo_${espectaculo.id}`;
  const idButtonTarjetaEspectaculo = `button_${idTarjetaEspectaculo}`;

  // Busco la lista, creo la tarjeta html y la incluyo en la lista
  const tarjetaEspectaculo = crearTarjeta(espectaculo, idTarjetaEspectaculo, idButtonTarjetaEspectaculo);
  $('#cardsId').append(tarjetaEspectaculo);

  // Busca el botón, le agrega el texto y la funcionalidad para el click
  $(`#${idButtonTarjetaEspectaculo}`)
    .append('<i class="fas fa-shopping-cart"></i>')
    .click(() => { agregarAlCarrito(espectaculo, carrito) });
}

const imprimirTarjetaCarrito = (espectaculos, carrito, itemCarrito) => {
  
  const idTarjetaEspectaculo = `espectaculo_${itemCarrito.id}`;
  const idButtonTarjetaEspectaculo = `button_${idTarjetaEspectaculo}`;

  const tarjetaEspectaculo = crearTarjeta(itemCarrito, idTarjetaEspectaculo, idButtonTarjetaEspectaculo, true);
  $('#cardsId').append(tarjetaEspectaculo);

  
  $(`#${idButtonTarjetaEspectaculo}`)
    .html('<i class="fas fa-trash"></i>')
    .attr('class', 'btn boton-carrito')
    .click(() => { eliminarDelCarrito(espectaculos, carrito, itemCarrito) });
}


const eliminarTarjetas = () => {
  $('#cardsId')
    .empty()
    .removeClass('search_card')
    .hide();
}

const eliminarLaTarjeta = (itemCarrito) => {
  
  const idTarjetaEspectaculo = `espectaculo_${itemCarrito.id}`;
  $(`#${idTarjetaEspectaculo}`).remove();   
}

const resetearVista = () => {
  scrollTop();                    
  eliminarTarjetas();             
  eliminarMensaje();              
  eliminarBotonesPagoCarrito();   
  eliminarCarousel();             
  eliminarFormulario();           
  eliminarTitulo();               
}

const fadeInTarjetas = () => {
  $('#cardsId').fadeIn(1000);
}

const imprimirTarjetasFiltradas = (espectaculos, tipo, carrito, busqueda = '') => {
  resetearVista();

  if (tipo === "INICIO") {                     
    imprimirCarousel();
    espectaculos.forEach(espectaculo => {
      imprimirTarjeta(espectaculo, carrito);
    });
    fadeInTarjetas();
  } else if (tipo === "CARRITO") {             
    if (carrito.length === 0) {
     
      mostrarMensaje(`No posee elementos en el carrito`);
    } else {                                  
      mostrarTitulo("Carrito");
      imprimirBotonesPagoCarrito(espectaculos, carrito);  
      carrito.forEach(itemCarrito => {
        imprimirTarjetaCarrito(espectaculos, carrito, itemCarrito);
      });
      fadeInTarjetas();
    }
  } else if (tipo === "SUSCRIBITE") {
    mostrarTitulo("Suscripción");
    imprimirFormulario();
  } else if (tipo === "BUSQUEDA") {
    buscador(espectaculos, carrito, busqueda);
  } else {
    const titulo = ARREGLO_MENU.find(m => m.tipo === tipo).texto;
    mostrarTitulo(titulo);                  
    const espectaculoFiltrados = espectaculos.filter(espectaculo => espectaculo.tipo === tipo);
    espectaculoFiltrados.forEach(espectaculo => {
      imprimirTarjeta(espectaculo, carrito);
    });
    fadeInTarjetas();
  }
}
