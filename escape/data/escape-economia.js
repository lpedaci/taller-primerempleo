/* Economía de pistas del escape room "Tu primer sueldo".
   Se edita acá para balancear el juego sin tocar el código. */
window.ESC_ECONOMIA = {
  llaves_iniciales: 3,
  llaves_por_reflexion: 1,
  costo_pista_1: 1,
  costo_pista_2: 1,
  pista_gratis_tras_intentos_fallidos: 3,
  sellos: [
    { id: "oro", nombre: "Salida limpia", pistas_usadas_max: 1 },
    { id: "plata", nombre: "Buena estrategia", pistas_usadas_max: 4 },
    { id: "bronce", nombre: "Saliste", pistas_usadas_max: 99 }
  ]
};
