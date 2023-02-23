//--MENU DE NAVBAR--
"use strict"

//--Funciones--

const crearBotonMenuNavBar = (elementoMenu, espectaculos, carrito) => {
  const button = ($('<button>')
    .text(elementoMenu.texto)
    .attr('class', 'dropdown-item nav-button')
    .click(() => { imprimirTarjetasFiltradas(espectaculos, elementoMenu.tipo, carrito) }));
  return button;
}

const crearMenuNavBar = (arregloMenu, espectaculos, carrito) => {
  $('#btnInicio').click(() => { imprimirTarjetasFiltradas(espectaculos, 'INICIO', carrito) });
  $('#btnCarrito').click(() => { imprimirTarjetasFiltradas(espectaculos, 'CARRITO', carrito) });
  $('#btnSubcripcion').click(() => { imprimirTarjetasFiltradas(espectaculos, 'SUSCRIBITE', carrito) });
  arregloMenu.forEach(elementoMenu => {
    const button = crearBotonMenuNavBar(elementoMenu, espectaculos, carrito);
    const divCategorias = $('<div>').append(button);
    $('#categorias').append(divCategorias);
  });

  $("#formBusqueda").submit((event) => {
    event.preventDefault();
    imprimirTarjetasFiltradas(espectaculos, "BUSQUEDA", carrito, $('#textoBusqueda').val());
    $('#textoBusqueda').val('');
    $('.navbar-collapse').collapse('hide');
  })
}

$('.nav-item').on('click', function () {
  $('.navbar-collapse').collapse('hide');
});

// El logo lleva al inicio--
$("#botonLogo").click(() => {
  imprimirTarjetasFiltradas(espectaculosStorageConvertidos, "INICIO", listaDeCarrito)
});
