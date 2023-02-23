//--Titulos de cat--
"use strict"

//--Funciones--

const mostrarTitulo = (texto) => {
  $('#titulo')
    .empty()
    .append(texto)
    .slideDown(150);
}

const eliminarTitulo = () => {
  $('#titulo')
    .hide()
    .empty();
}
