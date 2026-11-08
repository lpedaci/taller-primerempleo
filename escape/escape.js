/* Escape room "Tu primer sueldo": lógica del juego.
   El contenido sale de data/escape-finanzas.js y la economía de pistas de data/escape-economia.js.
   El avance se guarda en localStorage con prefijo esc_ y no se envía a ningún servidor.
   Con ?modo=simple en la dirección se juega como cuestionario lineal, sin la capa de juego. */
(function () {
  "use strict";
  var D = window.ESC_DATA, E = window.ESC_ECONOMIA;
  var T = D.textos, P = D.personaje, NIVELES = D.niveles, SIMPLE = D.simple;
  var root = document.documentElement;
  var app = document.getElementById("esc-app");
  var live = document.getElementById("esc-live");
  var panel = document.getElementById("objeto-panel");
  var panelT = document.getElementById("objeto-panel-t");
  var panelBody = document.getElementById("objeto-panel-body");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  var MODO = root.classList.contains("is-simple") ? "S" : "E";
  var ES_SIMPLE = MODO === "S";
  var KEY = ES_SIMPLE ? "esc_estado_simple" : "esc_estado";
  var LOG = ES_SIMPLE ? "esc_eventos_simple" : "esc_eventos";
  var THEME_KEY = "primer-empleo-tema";
  var TOTAL = D.salas.length;

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ic(id, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" aria-hidden="true" focusable="false"><use href="#' + id + '"/></svg>';
  }
  function announce(msg) {
    live.textContent = "";
    window.setTimeout(function () { live.textContent = msg; }, 60);
  }
  function plural(n, uno, varios) { return n === 1 ? uno : varios; }
  function salaDe(n) { return T.sala_de.replace("{n}", n).replace("{t}", TOTAL); }
  function preguntaDe(n) { return SIMPLE.pregunta.replace("{n}", n).replace("{t}", TOTAL); }
  /* Normaliza respuestas: sin espacios, puntos de miles, signo $, mayúsculas ni tildes */
  function normalizar(v, tipo) {
    var s = String(v || "").trim().toLowerCase();
    s = s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
    s = s.replace(/\$/g, "").replace(/\s+/g, "");
    if (tipo === "numero") s = s.replace(/,\d{1,2}$/, "").replace(/[.,]/g, "");
    else if (tipo !== "seleccion") s = s.replace(/[.,]/g, "");
    return s;
  }
  /* Enlaces al sitio del taller: se abren en una pestaña nueva para no perder la partida */
  function aTaller(href, inner, cls) {
    return '<a class="' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + inner +
      ic("i-arrow-square-out", "ic-ext") + '<span class="sr-only"> (se abre en una pestaña nueva)</span></a>';
  }
  function miles(digits) { return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

  /* ---------- Chipi: la tarjeta de la cuenta sueldo ----------
     Cambia de color según el nivel (una sala resuelta = un nivel) y tiene cuatro expresiones:
     normal, feliz, preocupado y pensando. Es decorativa: el texto siempre está aparte. */
  var uid = 0;
  function chipi(expr, nivel, cls) {
    var id = "chipi-clip-" + (++uid);
    var nombre = NIVELES[nivel] || NIVELES[0];
    return '<svg class="chipi' + (cls ? " " + cls : "") + '" data-expr="' + (expr || "normal") + '" data-nivel="' + nivel + '" viewBox="0 0 160 140" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + id + '"><rect x="14" y="20" width="132" height="86" rx="14"/></clipPath></defs>' +
      '<ellipse class="ch__sombra" cx="80" cy="133" rx="42" ry="5"/>' +
      '<g class="ch__g">' +
        '<g class="ch__destellos"><path d="M136 12l6-9M146 25l10-3M126 6l1-9"/></g>' +
        '<path class="ch__linea" d="M62 104v18M98 104v18"/>' +
        '<ellipse class="ch__pie" cx="56" cy="124" rx="9.5" ry="5"/><ellipse class="ch__pie" cx="104" cy="124" rx="9.5" ry="5"/>' +
        '<path class="ch__linea" d="M16 66c-9 3-13 10-13 19"/><circle class="ch__mano" cx="3" cy="88" r="5.5"/>' +
        '<g class="ch__brazo ch__brazo--saluda"><path class="ch__linea" d="M144 60c9-4 13-11 13-20"/><circle class="ch__mano" cx="157" cy="37" r="5.5"/></g>' +
        '<g class="ch__brazo ch__brazo--baja"><path class="ch__linea" d="M144 66c9 3 13 10 13 19"/><circle class="ch__mano" cx="157" cy="88" r="5.5"/></g>' +
        '<g class="ch__brazo ch__brazo--piensa"><path class="ch__linea" d="M144 68c12 6 9 22-6 25"/><circle class="ch__mano" cx="137" cy="93" r="5.5"/></g>' +
        '<rect class="ch__cuerpo" x="14" y="20" width="132" height="86" rx="14"/>' +
        '<path class="ch__banda" clip-path="url(#' + id + ')" d="M72 20h22L48 106H26z"/>' +
        '<rect class="ch__cuerpo-borde" x="14" y="20" width="132" height="86" rx="14"/>' +
        '<rect class="ch__chip" x="30" y="40" width="27" height="21" rx="5"/><path class="ch__chip-l" d="M30 50.5h27M43.5 40v21"/>' +
        '<path class="ch__ondas" d="M65 44c3 4 3 9 0 13M71 40c5 6 5 15 0 21"/>' +
        '<text class="ch__texto" x="30" y="93">' + esc(nombre.toUpperCase()) + '</text>' +
        '<ellipse class="ch__cachete" cx="95" cy="67" rx="5.5" ry="3.2"/><ellipse class="ch__cachete" cx="135" cy="67" rx="5.5" ry="3.2"/>' +
        '<g class="ch__ojos ch__ojos--abiertos"><ellipse class="ch__cara" cx="104" cy="56" rx="4.6" ry="6"/><ellipse class="ch__cara" cx="126" cy="56" rx="4.6" ry="6"/><circle class="ch__brillo" cx="105.6" cy="53.6" r="1.6"/><circle class="ch__brillo" cx="127.6" cy="53.6" r="1.6"/></g>' +
        '<g class="ch__ojos ch__ojos--felices"><path class="ch__trazo" d="M98.5 58c2.5-6 8.5-6 11 0M120.5 58c2.5-6 8.5-6 11 0"/></g>' +
        '<g class="ch__cejas"><path class="ch__trazo" d="M97 47.5l10-3M133 47.5l-10-3"/></g>' +
        '<path class="ch__boca ch__boca--sonrisa ch__trazo" d="M108.5 66c3.5 4 9.5 4 13 0"/>' +
        '<path class="ch__boca ch__boca--abierta ch__cara" d="M107 64h16c0 6-3.6 9.5-8 9.5S107 70 107 64z"/>' +
        '<path class="ch__boca ch__boca--duda ch__trazo" d="M109 70c3-3 9-3 12 0"/>' +
        '<path class="ch__boca ch__boca--piensa ch__trazo" d="M110.5 68h9"/>' +
      '</g></svg>';
  }
  function cambiarExpresion(expr) {
    var s = app.querySelector(".candado .chipi");
    if (!s) return;
    s.setAttribute("data-expr", expr);
    s.classList.remove("is-reaccion"); void s.getBoundingClientRect(); s.classList.add("is-reaccion");
  }

  /* ---------- Estado guardado ---------- */
  function nuevoEstado() {
    return {
      v: 1, modo: MODO, pantalla: "intro", sala: 1,
      llaves: E.llaves_iniciales, pistas_pagadas: 0,
      pre: null, post: null, puerta: false, fin: false,
      tiempo_ms: 0, tiempo_visible: false,
      salas: {}
    };
  }
  function cargar() {
    try { var r = localStorage.getItem(KEY); if (r) { var s = JSON.parse(r); if (s && s.v === 1) return s; } } catch (e) {}
    return nuevoEstado();
  }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function registrar(tipo, extra) {
    var ev = { t: Date.now(), tipo: tipo, modo: MODO };
    if (extra) for (var k in extra) ev[k] = extra[k];
    try {
      var l = JSON.parse(localStorage.getItem(LOG) || "[]");
      l.push(ev);
      localStorage.setItem(LOG, JSON.stringify(l));
    } catch (e) {}
  }
  var S = cargar();
  if (S.pantalla === "proximamente") S.pantalla = "sala";
  function estadoSala(id) {
    if (!S.salas[id]) S.salas[id] = { resuelta: false, intentos: 0, fallos_seguidos: 0, pistas: [], debrief: false, reflexion: "" };
    return S.salas[id];
  }
  function datosSala(id) {
    for (var i = 0; i < D.salas.length; i++) if (D.salas[i].id === id) return D.salas[i];
    return null;
  }
  function salaDesbloqueada(id) { return id === 1 || !!(S.salas[id - 1] && S.salas[id - 1].resuelta); }
  function resueltas() { return D.salas.filter(function (s) { return S.salas[s.id] && S.salas[s.id].resuelta; }).length; }
  function pistasUsadas() {
    var n = 0;
    D.salas.forEach(function (s) { if (S.salas[s.id]) n += S.salas[s.id].pistas.length; });
    return n;
  }
  function nivelActual() { return Math.min(resueltas(), NIVELES.length - 1); }

  /* ---------- Tiempo (ascendente, opcional, oculto por defecto) ---------- */
  var tick = null, ultimoTick = 0;
  function formatoTiempo(ms) {
    var s = Math.floor(ms / 1000), m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  }
  function correrTiempo() {
    if (tick) return;
    ultimoTick = Date.now();
    tick = window.setInterval(function () {
      if (document.hidden || S.fin) { ultimoTick = Date.now(); return; }
      var ahora = Date.now();
      S.tiempo_ms += ahora - ultimoTick; ultimoTick = ahora;
      var out = document.getElementById("equipo-tiempo-valor");
      if (out && S.tiempo_visible) out.textContent = formatoTiempo(S.tiempo_ms);
      if (Math.floor(S.tiempo_ms / 1000) % 5 === 0) guardar();
    }, 1000);
  }

  /* ---------- Tema claro / oscuro (igual que en el sitio) ---------- */
  var themeBtn = document.getElementById("theme-btn");
  function temaActual() { return root.getAttribute("data-theme") || (darkScheme.matches ? "dark" : "light"); }
  function syncTema() { themeBtn.setAttribute("aria-label", temaActual() === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"); }
  themeBtn.addEventListener("click", function () {
    var next = temaActual() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    syncTema();
  });
  syncTema();

  /* ---------- Render general ---------- */
  var primerRender = true;
  function render() {
    var p = S.pantalla;
    if (p === "sala" && S.pre) renderSala(S.sala);
    else if (p === "puerta" && S.pre && !ES_SIMPLE) renderPuerta();
    else if (p === "post" && S.pre) renderPost();
    else if (p === "saliste" && S.post) renderSaliste();
    else renderPanel();
    conectarEquipo();
    if (S.pre) correrTiempo();
    guardar();
    if (!primerRender) {
      var h = app.querySelector("[data-foco]");
      if (h) h.focus();
      window.scrollTo(0, 0);
    }
    primerRender = false;
  }
  function ir(pantalla, sala) {
    S.pantalla = pantalla;
    if (sala) S.sala = sala;
    render();
  }

  /* ---------- Piezas compartidas ---------- */
  function fichasHTML() {
    return D.salas.map(function (s) {
      var st = S.salas[s.id], l = st && st.resuelta ? s.fragmento : "";
      return '<span class="ficha' + (l ? " is-llena" : "") + '">' + esc(l) + '</span>';
    }).join("");
  }
  function srCodigo() {
    var cod = D.salas.filter(function (s) { return S.salas[s.id] && S.salas[s.id].resuelta; }).map(function (s) { return s.fragmento; });
    return cod.length ? "Letras del código: " + cod.join(", ") + ". Faltan " + (TOTAL - cod.length) + "." : "Todavía no tenés letras del código.";
  }
  /* Tarjeta de nivel: Chipi con su nivel y cuánto falta para el próximo */
  function nivelHTML(expr, cls) {
    var n = nivelActual(), sig = NIVELES[n + 1];
    var escalera = NIVELES.map(function (nom, i) {
      return '<li class="escalera__p' + (i <= n ? " is-alcanzado" : "") + (i === n ? " is-actual" : "") + '" data-nivel="' + i + '"><span class="sr-only">' + esc(nom) + (i === n ? ", nivel actual" : "") + '</span></li>';
    }).join("");
    return '<div class="nivel' + (cls ? " " + cls : "") + '" data-nivel="' + n + '">' +
      '<div class="nivel__chipi">' + chipi(expr, n, "chipi--nivel") + '</div>' +
      '<div class="nivel__txt"><p class="nivel__k">' + esc(T.nivel) + '</p><p class="nivel__v">' + esc(NIVELES[n]) + '</p>' +
      '<ol class="escalera" aria-label="Niveles de Chipi">' + escalera + '</ol>' +
      '<p class="nivel__sig">' + esc(sig ? T.proximo_nivel.replace("{n}", sig) : T.nivel_max) + '</p></div>' +
    '</div>';
  }
  function escalaAutoeval(nombre, valores) {
    return D.autoeval.afirmaciones.map(function (a, i) {
      var ops = D.autoeval.escala.map(function (txt, j) {
        var v = j + 1, id = nombre + "-" + i + "-" + v;
        return '<li><input type="radio" class="escala__radio" name="' + nombre + i + '" id="' + id + '" value="' + v + '"' + (valores && valores[i] === v ? " checked" : "") + '>' +
          '<label for="' + id + '" class="escala__op"><span class="escala__punto" aria-hidden="true"></span>' + esc(txt) + '</label></li>';
      }).join("");
      return '<fieldset class="escala"><legend class="escala__frase"><span class="escala__i" aria-hidden="true">' + (i + 1) + '</span>' + esc(a) + '</legend><ol class="escala__ops">' + ops + '</ol></fieldset>';
    }).join("");
  }
  function autoevalForm(id, kicker, titulo, intro, boton) {
    return '<form class="tarjeta autoeval" id="' + id + '" tabindex="-1" novalidate>' +
      '<p class="kicker">' + ic("j-lista") + esc(kicker) + '</p>' +
      '<h2 class="autoeval__t">' + esc(titulo) + '</h2>' +
      '<p class="autoeval__intro">' + esc(intro) + '</p>' +
      escalaAutoeval(id === "autoeval-post" ? "post" : "pre", null) +
      '<p class="form-error" id="' + id + '-error" hidden>' + ic("i-x-circle-fill") + '<span>' + esc(D.autoeval.falta) + '</span></p>' +
      '<button type="submit" class="btn-juego btn-juego--ancho"><span>' + esc(boton) + '</span>' + ic("j-flecha") + '</button>' +
    '</form>';
  }
  function leerEscala(form, nombre) {
    var out = [];
    for (var i = 0; i < D.autoeval.afirmaciones.length; i++) {
      var r = form.querySelector('input[name="' + nombre + i + '"]:checked');
      if (!r) return { falta: i };
      out.push(Number(r.value));
    }
    return { valores: out };
  }
  function validarEscala(form, nombre) {
    var res = leerEscala(form, nombre), err = document.getElementById(form.id + "-error");
    if (res.falta != null) {
      err.hidden = false;
      announce(D.autoeval.falta);
      form.querySelectorAll(".escala")[res.falta].querySelector("input").focus();
      return null;
    }
    return res.valores;
  }
  /* Confirmación propia (el confirm() nativo puede estar bloqueado y no avisa) */
  var dlgConfirmar = document.getElementById("confirmar"), confirmarOk = null, confirmarDesde = null;
  function confirmar(msg, alAceptar) {
    document.getElementById("confirmar-txt").textContent = msg;
    confirmarOk = alAceptar;
    confirmarDesde = document.activeElement;
    dlgConfirmar.showModal();
    document.getElementById("confirmar-no").focus();
  }
  document.getElementById("confirmar-no").addEventListener("click", function () { dlgConfirmar.close(); });
  document.getElementById("confirmar-si").addEventListener("click", function () {
    var f = confirmarOk;
    confirmarOk = null; confirmarDesde = null;
    dlgConfirmar.close();
    if (f) f();
  });
  dlgConfirmar.addEventListener("click", function (e) { if (e.target === dlgConfirmar) dlgConfirmar.close(); });
  dlgConfirmar.addEventListener("close", function () { if (confirmarDesde && document.contains(confirmarDesde)) confirmarDesde.focus(); });
  function reiniciar(msg) {
    confirmar(msg || T.reiniciar_confirmar, function () {
      try { localStorage.removeItem(KEY); localStorage.removeItem(LOG); } catch (e) {}
      S = nuevoEstado();
      ir("intro");
      announce("Avance borrado. Empezás de cero.");
    });
  }

  /* ---------- Panel principal (portada) ---------- */
  function salaTile(s) {
    var st = S.salas[s.id], resuelta = !!(st && st.resuelta), libre = !!S.pre && salaDesbloqueada(s.id);
    var estado = resuelta ? T.estado_resuelta : (libre ? (s.id === S.sala ? T.estado_actual : T.estado_libre) : T.estado_bloqueada);
    return '<li class="sala-tile' + (resuelta ? " is-resuelta" : "") + (libre ? "" : " is-bloqueada") + '" data-sala="' + s.id + '">' +
      '<div class="sala-tile__top"><span class="sala-tile__ic">' + ic(s.icono || "j-candado") + '</span>' +
        '<span class="sala-tile__estado">' + (resuelta ? ic("j-check") : "") + esc(estado) + '</span></div>' +
      '<p class="sala-tile__n">Sala ' + s.id + ' | ' + esc(s.nombre) + '</p>' +
      '<h3 class="sala-tile__t">' + esc(s.titulo) + '</h3>' +
      '<p class="sala-tile__premio"><span class="mini-tarjeta" aria-hidden="true"></span><span>' + (resuelta ? "Chipi subió a " : "Chipi sube a ") + '<strong>' + esc(NIVELES[Math.min(s.id, NIVELES.length - 1)]) + '</strong></span></p>' +
      '<div class="sala-tile__pie"><span class="sala-tile__letra" aria-hidden="true">' + (resuelta ? esc(s.fragmento) : "?") + '</span>' +
        '<button type="button" class="redondo" data-ir-sala="' + s.id + '"' + (libre ? "" : " disabled") + ' aria-label="' + esc(T.entrar + " " + s.id + ": " + s.titulo + (libre ? "" : ", " + T.estado_bloqueada)) + '">' + ic(libre ? "j-flecha" : "j-candado") + '</button></div>' +
    '</li>';
  }
  function codigoCard() {
    var anillos = D.salas.map(function (s) {
      var st = S.salas[s.id], ok = !!(st && st.resuelta);
      return '<li class="anillo' + (ok ? " is-ok" : "") + '"><svg viewBox="0 0 44 44" aria-hidden="true" focusable="false"><circle class="anillo__bg" cx="22" cy="22" r="18"/><circle class="anillo__fg" cx="22" cy="22" r="18" pathLength="100"/></svg>' +
        '<span class="anillo__l" aria-hidden="true">' + (ok ? esc(s.fragmento) : "?") + '</span><span class="anillo__k" aria-hidden="true">Sala ' + s.id + '</span></li>';
    }).join("");
    var todas = resueltas() === TOTAL;
    return '<section class="codigo" aria-labelledby="codigo-t">' +
      '<div class="codigo__head"><h2 class="codigo__t" id="codigo-t">' + ic("j-puerta") + esc(T.codigo_t) + '</h2><span class="codigo__n">' + resueltas() + '/' + TOTAL + '</span></div>' +
      '<ol class="codigo__anillos">' + anillos + '</ol>' +
      '<p class="codigo__txt">' + esc(todas ? T.codigo_listo : T.codigo_txt) + '<span class="sr-only"> ' + srCodigo() + '</span></p>' +
      (todas && !S.fin ? '<button type="button" class="btn-juego btn-juego--claro btn-juego--chico btn-juego--ancho codigo__ir" data-ir-puerta><span>' + esc(T.a_la_puerta) + '</span>' + ic("j-flecha") + '</button>' : "") +
      statsCard() +
    '</section>';
  }
  function statsCard() {
    return '<ul class="stats">' +
      '<li class="stat stat--llaves"><span class="stat__ic">' + ic("j-llave") + '</span><span class="stat__txt"><span class="stat__v">' + S.llaves + '</span><span class="stat__k">' + esc(T.llaves) + '</span></span><span class="stat__badge">' + esc(T.llaves_extra) + '</span></li>' +
      '<li class="stat stat--pistas"><span class="stat__ic">' + ic("j-pista") + '</span><span class="stat__txt"><span class="stat__v">' + pistasUsadas() + '</span><span class="stat__k">' + esc(T.pistas_usadas) + '</span></span></li>' +
    '</ul>';
  }
  function renderPanel() {
    if (ES_SIMPLE) { renderSimpleIntro(); return; }
    var iconos = ["j-lista", "j-reloj", "j-llave", "j-check"];
    var reglas = D.datos_juego.map(function (d, i) {
      return '<li>' + ic(iconos[i] || "j-check") + '<span>' + esc(d.titulo) + '<span class="sr-only">: ' + esc(d.texto) + '</span></span></li>';
    }).join("");
    var empezo = !!S.pre, siguiente;
    if (S.fin) siguiente = '<button type="button" class="btn-juego btn-juego--claro" data-ir="saliste"><span>Ver mi resultado</span>' + ic("j-flecha") + '</button>';
    else if (resueltas() === TOTAL) siguiente = '<button type="button" class="btn-juego btn-juego--claro" data-ir-puerta><span>' + esc(T.a_la_puerta) + '</span>' + ic("j-flecha") + '</button>';
    else siguiente = '<button type="button" class="btn-juego btn-juego--claro" data-ir-sala="' + S.sala + '"><span>Seguir en la sala ' + S.sala + '</span>' + ic("j-flecha") + '</button>';
    var acciones = empezo
      ? '<div class="acciones">' + siguiente + '<button type="button" class="btn-juego btn-juego--fantasma" data-reiniciar>' + esc(T.reiniciar) + '</button></div>'
      : '<div class="acciones"><a class="btn-juego btn-juego--claro" href="#autoeval-pre"><span>' + esc(T.empezar) + '</span>' + ic("j-flecha") + '</a></div>';
    app.innerHTML =
      '<section class="portada" aria-labelledby="intro-t">' +
        '<div class="portada__txt">' +
          '<p class="portada__kicker">' + ic("j-candado") + esc(D.kicker) + '</p>' +
          '<h1 class="portada__t" id="intro-t" tabindex="-1" data-foco>' + esc(D.titulo) + '</h1>' +
          '<p class="portada__lead">' + esc(D.historia[0]) + ' ' + esc(D.historia[1]) + '</p>' +
          '<ul class="reglas">' + reglas + '</ul>' +
          acciones +
        '</div>' +
        '<div class="portada__chipi">' +
          '<p class="globo">' + esc(P.saludo) + '</p>' +
          nivelHTML("normal", "nivel--portada") +
        '</div>' +
      '</section>' +
      '<section class="tablero" aria-labelledby="salas-t">' +
        '<div class="tablero__head"><h2 class="tablero__t" id="salas-t">' + esc(T.salas_t) + '</h2><p class="tablero__n">' + resueltas() + ' de ' + TOTAL + ' resueltas</p></div>' +
        '<ol class="salas-tiles">' + D.salas.map(salaTile).join("") + '</ol>' +
        codigoCard() +
      '</section>' +
      (empezo ? "" : autoevalForm("autoeval-pre", "Antes de entrar", D.autoeval.titulo_pre.split("|").pop().trim(), D.autoeval.intro_pre, D.autoeval.boton_pre));
    conectarPre();
  }
  function renderSimpleIntro() {
    var empezo = !!S.pre;
    var acciones = empezo
      ? '<div class="acciones"><button type="button" class="btn-juego" data-ir="' + (S.fin ? "saliste" : (resueltas() === TOTAL ? "post" : "sala")) + '"><span>' + (S.fin ? "Ver mi resultado" : "Seguir") + '</span>' + ic("j-flecha") + '</button>' +
        '<button type="button" class="btn-juego btn-juego--sec" data-reiniciar>' + esc(T.reiniciar) + '</button></div>'
      : "";
    app.innerHTML =
      '<section class="simple-intro tarjeta" aria-labelledby="intro-t">' +
        '<h1 class="simple-intro__t" id="intro-t" tabindex="-1" data-foco>' + esc(SIMPLE.titulo) + '</h1>' +
        '<p class="simple-intro__p">' + esc(SIMPLE.intro) + '</p>' + acciones +
      '</section>' +
      (empezo ? "" : autoevalForm("autoeval-pre", "Antes de empezar", D.autoeval.titulo_pre.split("|").pop().trim(), D.autoeval.intro_pre, D.autoeval.boton_pre_simple));
    conectarPre();
  }
  function conectarPre() {
    var f = document.getElementById("autoeval-pre");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = validarEscala(f, "pre");
      if (!v) return;
      S.pre = v;
      registrar("inicio");
      registrar("autoeval_pre", { valores: v });
      ir("sala", 1);
    });
  }

  /* ---------- Columna lateral de la sala ---------- */
  function progreso(actual) {
    var hechas = resueltas();
    return '<div class="progreso">' +
      '<p class="progreso__t"><span>' + esc(ES_SIMPLE ? preguntaDe(actual) : salaDe(actual)) + '</span><span class="progreso__n">' + hechas + '/' + TOTAL + '<span class="sr-only"> ' + (ES_SIMPLE ? "respondidas" : "candados abiertos") + '</span></span></p>' +
      '<span class="progreso__barra" aria-hidden="true"><i style="--p:' + (hechas / TOTAL) + '"></i></span>' +
    '</div>';
  }
  function camino(actual) {
    var items = D.salas.map(function (s) {
      var st = S.salas[s.id], resuelta = !!(st && st.resuelta), libre = !!S.pre && salaDesbloqueada(s.id);
      var esActual = s.id === actual;
      var estado = resuelta ? T.estado_resuelta : (esActual ? T.estado_actual : (libre ? T.estado_libre : T.estado_bloqueada));
      var paso = resuelta ? ic("j-check") : (libre ? String(s.id) : ic("j-candado"));
      return '<li class="camino__item' + (resuelta ? " is-resuelta" : "") + (esActual ? " is-actual" : "") + (libre ? "" : " is-bloqueada") + '" data-sala="' + s.id + '">' +
        '<span class="camino__paso" aria-hidden="true">' + paso + '</span>' +
        '<button type="button" class="camino__btn" data-ir-sala="' + s.id + '"' + (libre ? "" : " disabled") + (esActual ? ' aria-current="step"' : "") + '>' +
          '<span class="camino__ic" aria-hidden="true">' + ic(s.icono || "j-candado") + '</span>' +
          '<span class="camino__txt"><span class="camino__nombre"><span class="camino__n">' + s.id + '.</span> ' + esc(s.titulo) + '</span><span class="camino__estado">' + esc(estado) + '</span></span>' +
          ic("j-chevron", "camino__chev") +
        '</button></li>';
    }).join("");
    return '<nav class="camino" aria-label="' + (ES_SIMPLE ? "Preguntas" : "Salas del escape room") + '"><ol>' + items + '</ol></nav>';
  }
  function equipo() {
    return '<div class="equipo" role="group" aria-label="' + esc(T.equipo) + '">' +
      '<p class="equipo__tile equipo__tile--llaves"><span class="equipo__ic">' + ic("j-llave") + '</span><span class="equipo__k">' + esc(T.llaves) + '</span><span class="equipo__v" id="equipo-llaves">' + S.llaves + '</span><span class="sr-only"> ' + plural(S.llaves, T.llave, T.llaves) + '</span></p>' +
      '<p class="equipo__tile equipo__tile--tiempo"><button type="button" class="equipo__btn" id="equipo-tiempo" aria-pressed="' + (S.tiempo_visible ? "true" : "false") + '">' +
        '<span class="equipo__ic">' + ic("j-reloj") + '</span><span class="equipo__k">' + esc(T.tiempo) + '</span>' +
        '<span class="equipo__v equipo__v--tiempo" id="equipo-tiempo-valor">' + (S.tiempo_visible ? formatoTiempo(S.tiempo_ms) : esc(T.oculto)) + '</span>' +
        '<span class="sr-only">. ' + (S.tiempo_visible ? T.tiempo_ocultar : T.tiempo_mostrar) + '</span></button></p>' +
      '<p class="equipo__tile equipo__tile--letras"><span class="equipo__ic">' + ic("j-ficha") + '</span><span class="equipo__k">' + esc(T.letras) + '</span><span class="fichas" aria-hidden="true">' + fichasHTML() + '</span><span class="sr-only">' + srCodigo() + '</span></p>' +
    '</div>';
  }
  /* Barra de progreso del juego: nivel de Chipi, pasos de las salas y equipo */
  function pasosHTML(actual) {
    return D.salas.map(function (s) {
      var st = S.salas[s.id], resuelta = !!(st && st.resuelta), libre = !!S.pre && salaDesbloqueada(s.id);
      var esActual = s.id === actual;
      var estado = resuelta ? T.estado_resuelta : (esActual ? T.estado_actual : (libre ? T.estado_libre : T.estado_bloqueada));
      var dot = resuelta ? ic("j-check") : (libre ? String(s.id) : ic("j-candado"));
      return '<li class="pj-paso' + (resuelta ? " is-resuelta" : "") + (esActual ? " is-actual" : "") + (libre ? "" : " is-bloqueada") + '" data-sala="' + s.id + '">' +
        '<button type="button" class="pj-paso__btn" data-ir-sala="' + s.id + '"' + (libre ? "" : " disabled") + (esActual ? ' aria-current="step"' : "") + '>' +
          '<span class="pj-paso__dot" aria-hidden="true">' + dot + '</span>' +
          '<span class="pj-paso__txt"><span class="pj-paso__n">' + (ES_SIMPLE ? "Pregunta " : "Sala ") + s.id + '</span><span class="pj-paso__t">' + esc(s.titulo) + '</span>' +
          '<span class="sr-only">, ' + esc(estado) + '</span></span>' +
        '</button></li>';
    }).join("");
  }
  function recorrido(actual, sube) {
    var n = nivelActual(), hechas = resueltas();
    var nivel = ES_SIMPLE ? "" :
      '<div class="pj__nivel' + (sube ? " is-sube" : "") + '" data-nivel="' + n + '">' + chipi(sube ? "feliz" : "normal", n, "chipi--pj") +
      '<p class="pj__nivel-txt"><small>' + esc(T.nivel) + '</small><b>' + esc(NIVELES[n]) + '</b></p></div>';
    return '<aside class="pj" aria-label="' + esc(T.recorrido) + '">' + nivel +
      '<nav class="pj__pasos" aria-label="' + (ES_SIMPLE ? "Preguntas" : "Salas del escape room") + '">' +
        '<p class="pj__cuenta">' + esc(ES_SIMPLE ? preguntaDe(actual) : salaDe(actual)) + ' | ' + hechas + ' de ' + TOTAL + (ES_SIMPLE ? " respondidas" : " resueltas") + '</p>' +
        '<ol style="--hechas:' + hechas + '">' + pasosHTML(actual) + '</ol>' +
      '</nav>' +
      (ES_SIMPLE ? "" : equipo()) +
    '</aside>';
  }

  /* ---------- Objetos: miniatura y contenido ---------- */
  function miniatura(o) {
    switch (o.tipo) {
      case "recibo":
        return '<span class="objeto-mini objeto-mini--recibo" aria-hidden="true"><span class="papel"><i></i><i></i><i></i><i></i><i></i></span><i class="objeto-mini__mancha"></i></span>';
      case "lista":
        return '<span class="objeto-mini" aria-hidden="true"><span class="papel papel--lista"><i></i><i></i><i></i><i></i><i></i><i></i></span></span>';
      case "resumen":
        return '<span class="objeto-mini" aria-hidden="true"><span class="papel papel--resumen"><b></b><i></i><i></i><i></i></span></span>';
      case "folleto":
        return '<span class="objeto-mini" aria-hidden="true"><span class="mini-folleto"><b>12</b><i></i><i></i><small></small></span></span>';
      case "sobre":
        return '<span class="objeto-mini" aria-hidden="true"><span class="mini-sobre"><i></i></span></span>';
      case "etiqueta":
        return '<span class="objeto-mini" aria-hidden="true"><span class="mini-etiqueta"><i></i><b>+10 %</b></span></span>';
      case "celular":
        return '<span class="objeto-mini" aria-hidden="true"><span class="mini-cel"><i></i><i></i><i></i><i></i></span></span>';
      default:
        return '<span class="objeto-mini objeto-mini--nota" aria-hidden="true"><span class="postit"><i></i><i></i><i></i></span></span>';
    }
  }
  function objetoHTML(o) {
    switch (o.tipo) {
      case "recibo": return reciboHTML(o);
      case "lista": return listaHTML(o);
      case "resumen": return resumenHTML(o);
      case "folleto": return folletoHTML(o);
      case "sobre": return sobreHTML(o);
      case "etiqueta": return etiquetaHTML(o);
      case "celular": return celularHTML(o);
      default: return notaHTML(o);
    }
  }
  function manchado(txt) {
    return '<span class="manchado"><span class="manchado__x" aria-hidden="true">000.000,00</span><span class="sr-only">' + esc(txt) + '</span></span>';
  }
  function reciboHTML(o) {
    var filas = function (arr, conMonto) {
      return arr.map(function (r) {
        return '<tr><th scope="row">' + esc(r.concepto) + '</th><td>' + esc(r.unidad) + '</td><td class="num">' + (conMonto ? esc(r.monto) : manchado(o.mancha)) + '</td></tr>';
      }).join("");
    };
    var cab = '<thead><tr><th scope="col">Concepto</th><th scope="col">Unidad</th><th scope="col" class="num">Monto ($)</th></tr></thead>';
    return '<article class="esc-recibo">' +
      '<header class="esc-recibo__head"><p class="esc-recibo__empresa">' + esc(o.empresa) + '</p><p class="esc-recibo__cuit">CUIT ' + esc(o.cuit) + '</p></header>' +
      '<h3 class="esc-recibo__sec-t esc-recibo__sec-t--datos"><span>1</span>Datos del empleador y del trabajador</h3>' +
      '<dl class="esc-recibo__datos">' +
        '<div><dt>Período</dt><dd>' + esc(o.periodo) + '</dd></div>' +
        '<div><dt>Apellido y nombre</dt><dd>' + esc(o.trabajador) + '</dd></div>' +
        '<div><dt>CUIL</dt><dd>' + esc(o.cuil) + '</dd></div>' +
        '<div><dt>Categoría</dt><dd>' + esc(o.categoria) + '</dd></div>' +
        '<div><dt>Fecha de ingreso</dt><dd>' + esc(o.ingreso) + '</dd></div>' +
      '</dl>' +
      '<section class="esc-recibo__sec"><h3 class="esc-recibo__sec-t"><span>2</span>Contribuciones del empleador</h3>' +
        '<p class="esc-recibo__nota">' + esc(o.contribuciones_nota) + '</p>' +
        '<div class="esc-recibo__tabla"><table>' + cab + '<tbody>' + filas(o.contribuciones, true) + '</tbody>' +
        '<tfoot><tr><th scope="row" colspan="2">Subtotal contribuciones</th><td class="num">' + esc(o.contribuciones_total) + '</td></tr></tfoot></table></div></section>' +
      '<section class="esc-recibo__sec esc-recibo__sec--sueldo"><h3 class="esc-recibo__sec-t"><span>3</span>Remuneración bruta y deducciones</h3>' +
        '<div class="esc-recibo__tabla"><table>' + cab + '<tbody>' + filas(o.haberes, true) +
        '<tr class="esc-recibo__bruto"><th scope="row" colspan="2">Sueldo bruto</th><td class="num">' + esc(o.bruto) + '</td></tr>' +
        filas(o.deducciones, false) + '</tbody></table></div>' +
        '<span class="esc-recibo__mancha" aria-hidden="true"></span></section>' +
      '<section class="esc-recibo__sec esc-recibo__sec--neto"><h3 class="esc-recibo__sec-t"><span>4</span>Remuneración neta</h3>' +
        '<p class="esc-recibo__neto"><span>Sueldo neto</span>' + manchado(o.mancha) + '</p></section>' +
      '<p class="esc-recibo__firma">Recibí original de esta liquidación</p>' +
    '</article>';
  }
  function notaHTML(o) {
    return '<div class="nota-rrhh">' + o.lineas.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join("") +
      '<p class="nota-rrhh__firma">' + esc(o.firma) + '</p></div>';
  }
  function listaHTML(o) {
    return '<article class="doc doc--lista"><h3 class="doc__t">' + esc(o.titulo_doc) + '</h3>' +
      '<table><thead><tr><th scope="col">Gasto</th><th scope="col" class="num">Monto</th></tr></thead><tbody>' +
      o.filas.map(function (f) { return '<tr><th scope="row">' + esc(f.concepto) + '</th><td class="num">' + esc(f.monto) + '</td></tr>'; }).join("") +
      '</tbody></table></article>';
  }
  function resumenHTML(o) {
    return '<article class="doc doc--resumen"><div class="doc__banda"><span class="mini-tarjeta" aria-hidden="true" data-nivel="1"></span><h3 class="doc__t">' + esc(o.titulo_doc) + '</h3></div>' +
      '<dl class="doc__filas">' + o.filas.map(function (f) {
        return '<div' + (f.destacado ? ' class="is-destacado"' : "") + '><dt>' + esc(f.concepto) + '</dt><dd>' + esc(f.monto) + '</dd></div>';
      }).join("") + '</dl>' +
      '<p class="doc__nota">' + esc(o.nota) + '</p></article>';
  }
  function folletoHTML(o) {
    return '<article class="folleto"><p class="folleto__marca">' + esc(o.marca) + '</p>' +
      '<p class="folleto__t">Celular nuevo</p><p class="folleto__cuota">' + esc(o.titular) + '</p>' +
      '<p class="folleto__precio">' + esc(o.precio) + '</p>' +
      '<ul class="folleto__det">' + o.detalles.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join("") + '</ul>' +
      '<dl class="folleto__tasas">' + o.tasas.map(function (t) {
        return '<div' + (t.destacado ? ' class="is-destacado"' : "") + '><dt>' + esc(t.sigla) + '</dt><dd>' + esc(t.valor) + '</dd></div>';
      }).join("") + '</dl></article>';
  }
  function sobreHTML(o) {
    return '<div class="sobre-ahorro"><div class="sobre-ahorro__solapa" aria-hidden="true"></div>' +
      '<p class="sobre-ahorro__rotulo">' + esc(o.rotulo) + '</p><p class="sobre-ahorro__monto">' + esc(o.monto) + '</p>' +
      '<p class="sobre-ahorro__nota">' + esc(o.nota) + '</p></div>';
  }
  function etiquetaHTML(o) {
    return '<div class="etiqueta-precio"><span class="etiqueta-precio__ojal" aria-hidden="true"></span>' +
      '<p class="etiqueta-precio__prod">' + esc(o.producto) + '</p>' +
      '<p class="etiqueta-precio__antes">' + esc(o.antes) + '</p>' +
      '<p class="etiqueta-precio__ahora">' + esc(o.ahora) + '</p></div>';
  }
  function celularHTML(o) {
    return '<div class="celu"><div class="celu__pantalla"><p class="celu__barra" aria-hidden="true"><span>9:41</span><span>4 nuevos</span></p>' +
      '<ul class="celu__lista">' + o.mensajes.map(function (m) {
        return '<li class="celu__msj"><p class="celu__canal">' + esc(m.canal) + '</p><p class="celu__de">' + esc(m.de) + '</p><p class="celu__txt">' + esc(m.texto) + '</p></li>';
      }).join("") + '</ul></div></div>';
  }

  /* ---------- Sala ---------- */
  function cabeceraSala() {
    return '<div class="sala__barra"><button type="button" class="btn-juego btn-juego--sec btn-juego--chico" data-ir="intro">' + ic("j-volver") + '<span>' + esc(ES_SIMPLE ? "Inicio" : T.panel) + '</span></button></div>';
  }
  function renderSala(id) {
    var d = datosSala(id) || datosSala(1), st = estadoSala(d.id);
    if (!salaDesbloqueada(d.id)) { d = datosSala(1); st = estadoSala(1); }
    S.sala = d.id;
    if (!st.inicio) { st.inicio = Date.now(); registrar("sala_inicio", { sala: d.id }); }
    var escena;
    if (ES_SIMPLE) {
      escena = '<div class="escena escena--simple"><h2 class="bloque-t">' + ic("j-lupa") + esc(SIMPLE.datos) + '</h2>' +
        d.objetos.map(function (o) { return '<div class="dato-simple"><h3 class="dato-simple__t">' + esc(o.nombre) + '</h3>' + objetoHTML(o) + '</div>'; }).join("") + '</div>';
    } else {
      escena = '<div class="escena"><h2 class="bloque-t">' + ic("j-lupa") + esc(T.inspeccionar) + '</h2><ul class="objetos">' +
        d.objetos.map(function (o) {
          return '<li><button type="button" class="objeto objeto--' + esc(o.tipo) + '" data-objeto="' + esc(o.id) + '" aria-label="' + esc(o.accion) + '" aria-describedby="obj-res-' + esc(o.id) + '">' +
            miniatura(o) +
            '<span class="objeto__pie"><span class="objeto__txt"><span class="objeto__nombre">' + esc(o.nombre) + '</span><span class="objeto__resumen" id="obj-res-' + esc(o.id) + '">' + esc(o.resumen) + '</span></span>' +
            '<span class="redondo redondo--falso">' + ic("j-lupa") + '</span></span></button></li>';
        }).join("") + '</ul></div>';
    }
    app.innerHTML =
      '<div class="juego' + (ES_SIMPLE ? " juego--simple" : "") + '" data-sala="' + d.id + '">' +
        recorrido(d.id) +
        '<section class="sala" aria-labelledby="sala-t">' +
          '<header class="sala__head">' + cabeceraSala() +
            '<p class="sala__n">' + ic(d.icono || "j-candado") + (ES_SIMPLE ? esc(preguntaDe(d.id)) : 'Sala ' + d.id + ' | ' + esc(d.nombre)) + '</p>' +
            '<h1 class="sala__t" id="sala-t" tabindex="-1"' + (st.resuelta ? "" : " data-foco") + '>' + esc(d.titulo) + '</h1>' +
            (ES_SIMPLE ? "" : '<p class="sala__escena-txt">' + esc(d.escena) + '</p>') +
          '</header>' +
          escena +
          '<div class="sala__panel" id="sala-panel">' + (st.resuelta ? logroHTML(d, st) : (previoHTML(d, st) + candadoHTML(d, st))) + '</div>' +
        '</section>' +
      '</div>';
    conectarSala(d, st);
  }

  /* Desafío previo (Sala 2): clasificar gastos antes de encender el candado */
  function previoHTML(d, st) {
    var p = d.previo;
    if (!p) return "";
    var items = p.items.map(function (it, i) {
      var elegido = st.previo_resp ? st.previo_resp[i] : null;
      var mal = st.previo_marcas && st.previo_marcas[i];
      return '<fieldset class="clasif__item' + (mal ? " is-mal" : "") + (st.previo_ok ? " is-ok" : "") + '"><legend class="clasif__t">' + esc(it.texto) + '</legend>' +
        '<div class="clasif__ops">' + p.categorias.map(function (cat, j) {
          var idr = "clasif-" + it.id + "-" + j;
          return '<span class="clasif__op"><input type="radio" class="escala__radio" name="clasif-' + it.id + '" id="' + idr + '" value="' + j + '"' + (elegido === j ? " checked" : "") + (st.previo_ok ? " disabled" : "") + '><label for="' + idr + '">' + esc(cat) + '</label></span>';
        }).join("") + '</div>' +
        (mal ? '<p class="clasif__mal">' + ic("i-x-circle-fill") + esc(p.revisar) + '</p>' : "") + '</fieldset>';
    }).join("");
    return '<form class="tarjeta clasif" id="previo-form" novalidate>' +
      '<p class="kicker">' + ic("j-lista") + esc(p.titulo) + '</p>' +
      '<p class="clasif__consigna">' + esc(p.consigna) + '</p>' +
      '<div class="clasif__lista">' + items + '</div>' +
      (st.previo_ok
        ? '<p class="candado__fb" id="previo-fb" data-tipo="ok">' + ic("i-check-circle-fill") + '<span>' + esc(p.ok) + '</span></p>'
        : (st.previo_marcas
          ? '<p class="candado__fb" id="previo-fb" data-tipo="error">' + ic("i-x-circle-fill") + '<span>' + esc(p.error) + '</span></p>'
          : '<p class="candado__fb" id="previo-fb" hidden></p>')) +
      (st.previo_ok ? "" : '<button type="submit" class="btn-juego btn-juego--sec btn-juego--chico">' + esc(p.boton) + '</button>') +
    '</form>';
  }
  function revisarPrevio(d, st) {
    var p = d.previo, form = document.getElementById("previo-form"), resp = [], falta = false;
    p.items.forEach(function (it, i) {
      var r = form.querySelector('input[name="clasif-' + it.id + '"]:checked');
      resp.push(r ? Number(r.value) : null);
      if (!r) falta = true;
    });
    st.previo_resp = resp;
    var fb = document.getElementById("previo-fb");
    if (falta) {
      fb.hidden = false; fb.setAttribute("data-tipo", "error");
      fb.innerHTML = ic("i-x-circle-fill") + "<span>" + esc(p.falta) + "</span>";
      announce(p.falta);
      return;
    }
    var marcas = resp.map(function (r, i) { return r !== p.items[i].correcta; });
    var ok = marcas.every(function (m) { return !m; });
    registrar("intento", { sala: d.id, desafio: "clasificar", valor_normalizado: resp.join(""), correcto: ok });
    st.previo_marcas = ok ? null : marcas;
    st.previo_ok = ok;
    guardar();
    var panelSala = document.getElementById("sala-panel");
    panelSala.innerHTML = previoHTML(d, st) + candadoHTML(d, st);
    conectarSala(d, st, true);
    if (ok) {
      announce(p.ok);
      var inp = document.getElementById("candado-input") || panelSala.querySelector(".candado input");
      if (inp) inp.focus();
    } else {
      announce(p.error);
      var primero = panelSala.querySelector(".clasif__item.is-mal input");
      if (primero) primero.focus();
    }
  }

  function pistasHTML(d, st) {
    var proxima = st.pistas.length;
    var items = d.pistas.map(function (txt, i) {
      var p = st.pistas[i];
      if (p) {
        return '<li class="pista is-vista"><span class="pista__ic">' + ic("j-pista") + '</span><span class="pista__cuerpo"><span class="pista__n">' + esc(T.pista) + ' ' + (i + 1) + (p.gratis && !ES_SIMPLE ? ' <span class="pista__gratis">' + esc(T.gratis) + '</span>' : "") + '</span><span class="pista__txt">' + esc(txt) + '</span></span></li>';
      }
      var costo = i === 0 ? E.costo_pista_1 : E.costo_pista_2;
      var habil = i === proxima && (ES_SIMPLE || S.llaves >= costo);
      return '<li class="pista"><button type="button" class="pista__btn" data-pista="' + i + '"' + (habil ? "" : " disabled") + '>' +
        '<span class="pista__ic">' + ic(habil ? "j-pista" : "j-candado") + '</span><span class="pista__label">' + esc(T.ver_pista) + ' ' + (i + 1) + '</span>' +
        (ES_SIMPLE ? "" : '<span class="pista__costo">' + ic("j-llave") + costo + '<span class="sr-only"> ' + plural(costo, T.llave, T.llaves) + '</span></span>') + '</button></li>';
    }).join("");
    var sinLlaves = !ES_SIMPLE && proxima < d.pistas.length && S.llaves < (proxima === 0 ? E.costo_pista_1 : E.costo_pista_2);
    return '<div class="pistas"><h3 class="pistas__t">' + esc(T.pistas_titulo) + '</h3><ol class="pistas__lista">' + items + '</ol>' +
      (sinLlaves ? '<p class="pistas__aviso">' + esc(T.sin_llaves) + '</p>' : "") + '</div>';
  }
  function campoCandado(c, apagado) {
    var dis = apagado ? " disabled" : "";
    if (c.tipo === "seleccion") {
      return '<fieldset class="seleccion" aria-describedby="candado-ayuda candado-fb"' + dis + '><legend class="sr-only">' + esc(c.etiqueta) + '</legend>' +
        c.opciones.map(function (op) {
          return '<span class="seleccion__op"><input type="checkbox" class="seleccion__check" id="sel-' + op.id + '" value="' + op.id + '"><label for="sel-' + op.id + '"><span class="seleccion__caja" aria-hidden="true">' + ic("j-check") + '</span>' + esc(op.texto) + '</label></span>';
        }).join("") + '</fieldset>';
    }
    return '<div class="candado__campo">' + (c.prefijo ? '<span class="candado__prefijo" aria-hidden="true">' + esc(c.prefijo) + '</span>' : "") +
      '<input class="candado__input' + (c.tipo === "palabra" ? " candado__input--palabra" : "") + '" id="candado-input" type="text" autocomplete="off" spellcheck="false" autocapitalize="characters"' +
      (c.tipo === "numero" ? ' inputmode="numeric"' : ' maxlength="12"') + ' aria-describedby="candado-ayuda candado-fb"' + dis + '></div>';
  }
  function candadoHTML(d, st) {
    var c = d.candado, apagado = !!(d.previo && !st.previo_ok);
    var etiqueta = c.tipo === "seleccion"
      ? '<p class="candado__label" id="candado-label">' + esc(c.etiqueta) + '</p>'
      : '<label class="candado__label" for="candado-input">' + esc(c.etiqueta) + '</label>';
    return '<div class="tarjeta candado' + (apagado ? " is-apagado" : "") + '" id="candado">' +
      '<div class="candado__head">' +
        '<div class="candado__intro">' +
          (ES_SIMPLE ? "" : '<p class="kicker kicker--juego"><span class="candado__ic">' + ic("j-candado", "candado__cerrado") + ic("j-candado-abierto", "candado__abierto") + '</span>Candado de la sala ' + d.id + '</p>') +
          etiqueta +
          '<p class="candado__ayuda" id="candado-ayuda">' + esc(apagado ? T.candado_apagado : c.ayuda) + '</p>' +
        '</div>' +
        (ES_SIMPLE ? "" : '<span class="candado__chipi">' + chipi(apagado ? "pensando" : "normal", nivelActual(), "chipi--candado") + '</span>') +
      '</div>' +
      '<form class="candado__form" id="candado-form" novalidate>' +
        campoCandado(c, apagado) +
        '<p class="candado__fb" id="candado-fb" hidden></p>' +
        '<button type="submit" class="btn-juego btn-juego--ancho candado__probar"' + (apagado ? " disabled" : "") + '><span>' + esc(T.probar) + '</span>' + ic("j-flecha") + '</button>' +
      '</form>' +
      '<p class="candado__intentos">' + esc(T.intentos) + ': <span id="candado-intentos">' + st.intentos + '</span></p>' +
      (apagado ? "" : pistasHTML(d, st)) +
    '</div>';
  }
  function extraHTML(d, st) {
    var x = d.extra;
    if (!x) return "";
    var r = st.extra_resp;
    return '<form class="extra" id="extra-form" novalidate><fieldset><legend class="extra__k">' + ic("j-pista") + esc(T.extra_titulo) + '</legend>' +
      '<p class="extra__q">' + esc(x.pregunta) + '</p>' +
      '<div class="extra__ops">' + x.opciones.map(function (op, i) {
        return '<span class="extra__op"><input type="radio" class="escala__radio" name="extra" id="extra-' + i + '" value="' + i + '"' + (r === i ? " checked" : "") + '><label for="extra-' + i + '"><span class="escala__punto" aria-hidden="true"></span>' + esc(op.texto) + '</label></span>';
      }).join("") + '</div></fieldset>' +
      '<p class="candado__fb" id="extra-fb"' + (r != null ? ' data-tipo="' + (x.opciones[r].correcta ? "ok" : "error") + '"' : " hidden") + '>' +
        (r != null ? ic(x.opciones[r].correcta ? "i-check-circle-fill" : "i-x-circle-fill") + '<span>' + esc(x.opciones[r].feedback) + '</span>' : "") + '</p>' +
      '<button type="submit" class="btn-juego btn-juego--sec btn-juego--chico">' + esc(T.extra_boton) + '</button></form>';
  }
  function logroHTML(d, st) {
    var siguiente = datosSala(d.id + 1), btn;
    if (ES_SIMPLE) {
      btn = siguiente
        ? '<button type="button" class="btn-juego btn-juego--ancho" data-ir-sala="' + siguiente.id + '"><span>' + esc(SIMPLE.siguiente) + '</span>' + ic("j-flecha") + '</button>'
        : '<button type="button" class="btn-juego btn-juego--ancho" data-ir="post"><span>' + esc(SIMPLE.terminar) + '</span>' + ic("j-flecha") + '</button>';
    } else {
      btn = siguiente
        ? '<button type="button" class="btn-juego btn-juego--ancho" data-ir-sala="' + siguiente.id + '"><span>' + esc(T.seguir) + ' ' + siguiente.id + '</span>' + ic("j-flecha") + '</button>'
        : '<button type="button" class="btn-juego btn-juego--ancho" data-ir-puerta><span>' + esc(T.a_la_puerta) + '</span>' + ic("j-flecha") + '</button>';
    }
    var pistas = st.pistas.length, n = Math.min(d.id, NIVELES.length - 1);
    var cabeza = ES_SIMPLE
      ? '<div class="logro__head logro__head--simple"><div><p class="kicker kicker--ok">' + ic("j-check") + esc(T.correcto_simple) + '</p>' +
        '<h2 class="logro__t" id="logro-t" tabindex="-1"' + (st.resuelta ? " data-foco" : "") + '>' + esc(T.debrief_titulo) + '</h2></div></div>'
      : '<div class="logro__head">' +
          '<div><p class="kicker kicker--ok">' + ic("j-check") + 'Sala ' + d.id + ' resuelta</p>' +
          '<h2 class="logro__t" id="logro-t" tabindex="-1"' + (st.resuelta ? " data-foco" : "") + '>' + esc(T.logro_titulo) + '</h2>' +
          '<p class="logro__sub">' + esc(T.logro_sub) + '</p>' +
          '<p class="sube" data-nivel="' + n + '"><span class="sube__punto" aria-hidden="true"></span>' + esc(T.subiste.replace("{n}", NIVELES[n])) + '</p></div>' +
          '<span class="logro__chipi">' + chipi("feliz", n, "chipi--logro") + '</span>' +
        '</div>' +
        '<ul class="logro__stats">' +
          '<li><span class="mini-ic mini-ic--ok">' + ic("j-check") + '</span><span class="logro__v">' + st.intentos + '</span><span class="logro__k">' + plural(st.intentos, "intento", "intentos") + '</span></li>' +
          '<li><span class="mini-ic mini-ic--pista">' + ic("j-pista") + '</span><span class="logro__v">' + pistas + '</span><span class="logro__k">' + plural(pistas, "pista", "pistas") + '</span></li>' +
          '<li><span class="mini-ic mini-ic--letra">' + ic("j-ficha") + '</span><span class="logro__v">' + esc(d.fragmento) + '</span><span class="logro__k">' + esc(T.fragmento) + '</span></li>' +
        '</ul>';
    return '<div class="tarjeta logro" id="logro">' + cabeza +
      '<div class="logro__clave">' +
        '<h3 class="logro__clave-t">' + ic("i-lightbulb") + esc(ES_SIMPLE ? "La idea clave" : T.debrief_titulo) + '</h3>' +
        d.debrief.texto.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("") +
      '</div>' +
      extraHTML(d, st) +
      '<form class="reflexion" id="reflexion-form" novalidate>' +
        '<p class="reflexion__k">' + esc(T.reflexion_titulo) + (st.llave_reflexion || ES_SIMPLE ? "" : ' <span class="reflexion__premio">+1 ' + ic("j-llave") + '<span class="sr-only">' + esc(T.llave) + '</span></span>') + '</p>' +
        '<label class="reflexion__label" for="reflexion-input">' + esc(d.reflexion) + '</label>' +
        '<p class="reflexion__ayuda" id="reflexion-ayuda">' + esc(ES_SIMPLE ? T.reflexion_ayuda_simple : T.reflexion_ayuda) + '</p>' +
        '<textarea class="reflexion__input" id="reflexion-input" rows="3" aria-describedby="reflexion-ayuda">' + esc(st.reflexion) + '</textarea>' +
        '<div class="reflexion__fila"><button type="submit" class="btn-juego btn-juego--sec btn-juego--chico">' + esc(T.reflexion_boton) + '</button>' +
        '<p class="reflexion__estado" id="reflexion-estado"' + (st.reflexion ? "" : " hidden") + '>' + ic("j-check") + esc(T.reflexion_guardada) + '</p></div>' +
      '</form>' +
      '<div class="logro__acciones">' + btn +
        (d.debrief.link ? aTaller(d.debrief.link.href, ic(d.icono || "j-recibo") + '<span>' + esc(d.debrief.link.texto) + '</span>', "btn-juego btn-juego--sec btn-juego--ancho") : "") +
      '</div>' +
    '</div>';
  }

  function conectarSala(d, st, soloPanel) {
    if (!soloPanel) {
      app.querySelectorAll("[data-objeto]").forEach(function (b) {
        b.addEventListener("click", function () { abrirObjeto(d, b.getAttribute("data-objeto"), b); });
      });
    }
    var pf = document.getElementById("previo-form");
    if (pf) pf.addEventListener("submit", function (e) { e.preventDefault(); revisarPrevio(d, st); });
    var form = document.getElementById("candado-form");
    if (form) {
      var input = document.getElementById("candado-input");
      if (input && d.candado.tipo === "numero") {
        input.addEventListener("input", function () {
          input.removeAttribute("aria-invalid");
          input.value = miles(input.value.replace(/\D/g, "").slice(0, 9));
        });
      } else if (input) {
        input.addEventListener("input", function () { input.removeAttribute("aria-invalid"); });
      }
      form.addEventListener("submit", function (e) { e.preventDefault(); probar(d, st); });
    }
    conectarPistas(d, st);
    conectarLogro(d, st);
  }
  function conectarLogro(d, st) {
    var rf = document.getElementById("reflexion-form");
    if (rf) rf.addEventListener("submit", function (e) { e.preventDefault(); guardarReflexion(d, st); });
    var xf = document.getElementById("extra-form");
    if (xf) xf.addEventListener("submit", function (e) { e.preventDefault(); responderExtra(d, st); });
  }
  function conectarPistas(d, st) {
    app.querySelectorAll("[data-pista]").forEach(function (b) {
      b.addEventListener("click", function () { comprarPista(d, st, Number(b.getAttribute("data-pista"))); });
    });
  }
  function refrescarPistas(d, st, foco) {
    var cont = app.querySelector(".pistas");
    if (!cont) return;
    cont.outerHTML = pistasHTML(d, st);
    conectarPistas(d, st);
    if (foco != null) {
      var li = app.querySelectorAll(".pistas__lista > li")[foco];
      if (li) { li.setAttribute("tabindex", "-1"); li.focus(); }
    }
  }
  function refrescarEquipo(cambio) {
    var h = app.querySelector(".equipo");
    if (h) { h.outerHTML = equipo(); conectarEquipo(); }
    if (cambio) {
      var t = app.querySelector(".equipo__tile--" + cambio);
      if (t) t.classList.add("is-cambio");
    }
  }
  function refrescarRecorrido(id) {
    var c = app.querySelector(".pj");
    if (c) { c.outerHTML = recorrido(id, true); conectarEquipo(); }
  }
  function comprarPista(d, st, i, gratis, previo) {
    if (i !== st.pistas.length || i >= d.pistas.length) return;
    var costo = i === 0 ? E.costo_pista_1 : E.costo_pista_2;
    if (ES_SIMPLE) gratis = gratis || false;
    else if (!gratis) {
      if (S.llaves < costo) return;
      S.llaves -= costo;
      S.pistas_pagadas += 1;
    }
    st.pistas.push({ gratis: !!gratis });
    registrar("pista", { sala: d.id, n: i + 1, gratis: !!gratis });
    guardar();
    refrescarPistas(d, st, gratis ? null : i);
    if (!ES_SIMPLE) refrescarEquipo(gratis ? null : "llaves");
    cambiarExpresion("pensando");
    announce((previo ? previo + " " : "") + (gratis && !ES_SIMPLE ? T.pista_gratis + " " : "") + T.pista + " " + (i + 1) + ": " + d.pistas[i]);
  }

  function mostrarFeedback(id, tipo, msg) {
    var fb = document.getElementById(id);
    fb.hidden = false;
    fb.setAttribute("data-tipo", tipo);
    fb.innerHTML = ic(tipo === "ok" ? "i-check-circle-fill" : "i-x-circle-fill") + "<span>" + esc(msg) + "</span>";
    fb.classList.remove("is-nuevo"); void fb.offsetWidth; fb.classList.add("is-nuevo");
  }
  /* Lee la respuesta y devuelve { valor, error } con el error esperado si lo hay */
  function evaluar(c) {
    if (c.tipo === "seleccion") {
      var marcados = Array.prototype.slice.call(app.querySelectorAll(".seleccion__check:checked")).map(function (x) { return x.value; }).sort();
      var valor = marcados.join(",");
      if (!valor) return { vacio: true };
      var correcto = c.respuestas.indexOf(valor) !== -1, error = null;
      if (!correcto) {
        if (marcados.indexOf(c.legitimo.id) !== -1) error = { id: "marco_legitimo", mensaje: c.legitimo.mensaje };
        else {
          var falta = Object.keys(c.faltantes).filter(function (k) { return marcados.indexOf(k) === -1; })[0];
          if (falta) error = { id: "falta_" + falta, mensaje: c.faltantes[falta] };
        }
      }
      return { valor: valor, correcto: correcto, error: error };
    }
    var input = document.getElementById("candado-input");
    var v = normalizar(input.value, c.tipo);
    if (!v) return { vacio: true };
    var ok = c.respuestas.some(function (r) { return normalizar(r, c.tipo) === v; }), err = null;
    if (!ok) c.errores.forEach(function (er) {
      if (!err && er.valores.some(function (x) { return normalizar(x, c.tipo) === v; })) err = er;
    });
    return { valor: v, correcto: ok, error: err };
  }
  function probar(d, st) {
    var c = d.candado, r = evaluar(c);
    var input = document.getElementById("candado-input");
    if (r.vacio) {
      var m = c.tipo === "seleccion" ? T.vacio_seleccion : T.vacio;
      mostrarFeedback("candado-fb", "error", m); announce(m);
      (input || app.querySelector(".seleccion__check")).focus();
      return;
    }
    st.intentos += 1;
    document.getElementById("candado-intentos").textContent = st.intentos;
    registrar("intento", { sala: d.id, valor_normalizado: r.valor, error_esperado: r.error ? r.error.id : null, correcto: r.correcto });
    if (r.correcto) { abrirCandado(d, st); return; }
    st.fallos_seguidos += 1;
    var msg = r.error ? r.error.mensaje : T.generico;
    if (input) input.setAttribute("aria-invalid", "true");
    mostrarFeedback("candado-fb", "error", msg);
    cambiarExpresion("preocupado");
    var anuncio = "Incorrecto. " + msg;
    if (st.fallos_seguidos >= E.pista_gratis_tras_intentos_fallidos && st.pistas.length < d.pistas.length) {
      st.fallos_seguidos = 0;
      guardar();
      comprarPista(d, st, st.pistas.length, true, anuncio);
      return;
    }
    guardar();
    announce(anuncio);
  }
  function abrirCandado(d, st) {
    st.resuelta = true;
    st.fin = Date.now();
    if (S.sala === d.id && datosSala(d.id + 1)) S.sala = d.id + 1;
    registrar("sala_fin", { sala: d.id, intentos: st.intentos, pistas: st.pistas.length });
    guardar();
    var cand = document.getElementById("candado");
    var mostrar = function () {
      document.getElementById("sala-panel").innerHTML = logroHTML(d, st);
      st.debrief = true; guardar();
      refrescarRecorrido(d.id);
      if (!ES_SIMPLE) refrescarEquipo("letras");
      conectarLogro(d, st);
      document.getElementById("logro-t").focus();
      announce(ES_SIMPLE ? T.correcto_simple : T.correcto + " " + T.fragmento + ": " + d.fragmento + ". " + T.subiste.replace("{n}", NIVELES[nivelActual()]) + ".");
    };
    if (reduceMotion.matches || ES_SIMPLE) { mostrar(); return; }
    cand.classList.add("is-abriendo");
    cambiarExpresion("feliz");
    mostrarFeedback("candado-fb", "ok", T.correcto);
    window.setTimeout(mostrar, 1000);
  }
  function responderExtra(d, st) {
    var x = d.extra, r = document.querySelector('#extra-form input[name="extra"]:checked');
    if (!r) { announce(T.vacio); return; }
    var i = Number(r.value), op = x.opciones[i];
    st.extra_resp = i;
    registrar("pregunta_extra", { sala: d.id, opcion: i, correcto: op.correcta });
    guardar();
    mostrarFeedback("extra-fb", op.correcta ? "ok" : "error", op.feedback);
    announce((op.correcta ? "Correcto. " : "Todavía no. ") + op.feedback);
  }
  function guardarReflexion(d, st) {
    var ta = document.getElementById("reflexion-input"), txt = ta.value.trim();
    if (!txt) { ta.focus(); return; }
    var primera = !st.llave_reflexion;
    st.reflexion = txt;
    if (primera && !ES_SIMPLE) S.llaves += E.llaves_por_reflexion;
    st.llave_reflexion = true;
    registrar("reflexion", { sala: d.id, largo: txt.length });
    guardar();
    var gana = primera && !ES_SIMPLE;
    var est = document.getElementById("reflexion-estado");
    est.hidden = false;
    est.innerHTML = ic("j-check") + esc(gana ? T.reflexion_ok : T.reflexion_guardada);
    var premio = app.querySelector(".reflexion__premio");
    if (premio) premio.remove();
    if (!ES_SIMPLE) refrescarEquipo(gana ? "llaves" : null);
    announce(gana ? T.reflexion_ok : T.reflexion_guardada);
  }

  /* ---------- Objetos (diálogo modal) ---------- */
  var abridor = null;
  function abrirObjeto(d, id, btn) {
    var o = null;
    d.objetos.forEach(function (x) { if (x.id === id) o = x; });
    if (!o) return;
    abridor = btn;
    panelT.textContent = o.nombre;
    panelBody.innerHTML = objetoHTML(o);
    panel.setAttribute("data-sala", d.id);
    panel.showModal();
    panelBody.scrollTop = 0;
    registrar("objeto_abierto", { sala: d.id, objeto: id });
  }
  document.getElementById("objeto-panel-cerrar").addEventListener("click", function () { panel.close(); });
  panel.addEventListener("click", function (e) { if (e.target === panel) panel.close(); });
  panel.addEventListener("close", function () { if (abridor) abridor.focus(); });

  /* ---------- Puerta final ---------- */
  function renderPuerta() {
    var pu = D.puerta, todas = resueltas() === TOTAL;
    var letras = pu.orden_mostrado.map(function (l) {
      var s = D.salas.filter(function (x) { return x.fragmento === l; })[0];
      var ok = s && S.salas[s.id] && S.salas[s.id].resuelta;
      return '<li class="puerta__letra' + (ok ? " is-llena" : "") + '">' + (ok ? esc(l) : "?") + '</li>';
    }).join("");
    var cuerpo = !todas
      ? '<p class="puerta__falta">' + esc(pu.falta) + '</p><div class="acciones"><button type="button" class="btn-juego" data-ir="intro">' + ic("j-volver") + '<span>' + esc(T.panel) + '</span></button></div>'
      : (S.puerta
        ? '<p class="candado__fb" data-tipo="ok">' + ic("i-check-circle-fill") + '<span>' + esc(pu.abierta) + '</span></p><button type="button" class="btn-juego btn-juego--ancho" data-ir="post"><span>' + esc(D.autoeval.boton_post) + '</span>' + ic("j-flecha") + '</button>'
        : '<form class="candado__form" id="puerta-form" novalidate>' +
            '<label class="candado__label" for="puerta-input">' + esc(pu.pregunta) + '</label>' +
            '<p class="candado__ayuda" id="puerta-ayuda">' + esc(pu.ayuda) + '</p>' +
            '<div class="candado__campo"><input class="candado__input candado__input--palabra" id="puerta-input" type="text" autocomplete="off" spellcheck="false" autocapitalize="characters" maxlength="8" aria-describedby="puerta-ayuda puerta-fb"></div>' +
            '<p class="candado__fb" id="puerta-fb" hidden></p>' +
            '<button type="submit" class="btn-juego btn-juego--ancho"><span>' + esc(pu.boton) + '</span>' + ic("j-flecha") + '</button>' +
          '</form>');
    app.innerHTML =
      '<section class="puerta" aria-labelledby="puerta-t">' +
        '<div class="puerta__arte" aria-hidden="true"><div class="puerta__hoja' + (S.puerta ? " is-abierta" : "") + '"><span class="puerta__pomo"></span></div>' + chipi(S.puerta ? "feliz" : "normal", nivelActual(), "chipi--puerta") + '</div>' +
        '<div class="tarjeta puerta__card">' +
          '<div class="sala__barra"><button type="button" class="btn-juego btn-juego--sec btn-juego--chico" data-ir="intro">' + ic("j-volver") + '<span>' + esc(T.panel) + '</span></button></div>' +
          '<p class="kicker kicker--juego">' + ic("j-puerta") + esc(T.codigo_t) + '</p>' +
          '<h1 class="sala__t" id="puerta-t" tabindex="-1" data-foco>' + esc(pu.titulo) + '</h1>' +
          '<p class="sala__escena-txt">' + esc(pu.texto) + '</p>' +
          '<ol class="puerta__letras" aria-label="Letras que juntaste, desordenadas">' + letras + '</ol>' +
          cuerpo +
        '</div>' +
      '</section>';
    var f = document.getElementById("puerta-form");
    if (!f) return;
    var inp = document.getElementById("puerta-input");
    inp.addEventListener("input", function () { inp.removeAttribute("aria-invalid"); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = normalizar(inp.value, "palabra");
      if (!v) { mostrarFeedback("puerta-fb", "error", T.vacio); announce(T.vacio); inp.focus(); return; }
      var ok = pu.respuestas.some(function (r) { return normalizar(r, "palabra") === v; }), err = null;
      if (!ok) pu.errores.forEach(function (er) { if (!err && er.valores.some(function (x) { return normalizar(x, "palabra") === v; })) err = er; });
      registrar("puerta_final", { valor_normalizado: v, error_esperado: err ? err.id : null, correcto: ok });
      if (!ok) {
        var msg = err ? err.mensaje : pu.generico;
        inp.setAttribute("aria-invalid", "true");
        mostrarFeedback("puerta-fb", "error", msg); announce("Incorrecto. " + msg);
        return;
      }
      S.puerta = true; guardar();
      announce(pu.abierta);
      renderPuerta();
      var b = app.querySelector('[data-ir="post"]');
      if (b) b.focus();
    });
  }

  /* ---------- Autoevaluación final ---------- */
  function renderPost() {
    if (!ES_SIMPLE && !S.puerta) { renderPuerta(); return; }
    if (S.post) { renderSaliste(); return; }
    app.innerHTML =
      '<section class="post" aria-labelledby="post-t">' +
        '<h1 class="sr-only" id="post-t" tabindex="-1" data-foco>' + esc(D.autoeval.titulo_post) + '</h1>' +
        autoevalForm("autoeval-post", ES_SIMPLE ? "Para terminar" : "Antes de salir", D.autoeval.titulo_post.split("|").pop().trim(), D.autoeval.intro_post, D.autoeval.boton_post) +
      '</section>';
    var f = document.getElementById("autoeval-post");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = validarEscala(f, "post");
      if (!v) return;
      S.post = v; S.fin = true;
      registrar("autoeval_post", { valores: v });
      registrar("fin", { codigo: codigoResultado() });
      ir("saliste");
    });
  }

  /* ---------- Pantalla final: Saliste ---------- */
  function selloObtenido() {
    var n = S.pistas_pagadas;
    for (var i = 0; i < E.sellos.length; i++) if (n <= E.sellos[i].pistas_usadas_max) return E.sellos[i];
    return E.sellos[E.sellos.length - 1];
  }
  function codigoResultado() {
    var pistas = ES_SIMPLE ? pistasUsadas() : S.pistas_pagadas;
    return "ESC-" + MODO + "-" + (S.pre || []).join("") + "-" + (S.post || []).join("") + "-" + pistas + "-" + resueltas();
  }
  function renderSaliste() {
    var X = D.saliste, A = D.autoeval.afirmaciones, pre = S.pre, post = S.post;
    var difs = A.map(function (_, i) { return post[i] - pre[i]; });
    var parejas = post.every(function (v) { return v === post[0]; });
    var maxDif = Math.max.apply(null, difs), iFuerte, fuerteTxt, iProx;
    if (maxDif > 0) { iFuerte = difs.indexOf(maxDif); fuerteTxt = X.fortaleza_sube; }
    else { iFuerte = post.indexOf(Math.max.apply(null, post)); fuerteTxt = X.fortaleza_firme; }
    /* El próximo paso es la frase más baja que no sea la fortaleza (en un empate, la primera) */
    iProx = A.map(function (_, i) { return i; })
      .filter(function (i) { return i !== iFuerte; })
      .sort(function (a, b) { return post[a] - post[b] || a - b; })[0];
    var barras = A.map(function (a, i) {
      return '<li class="ad__fila"><p class="ad__frase">' + esc(a) + '</p>' +
        '<span class="ad__barra ad__barra--antes" style="--v:' + pre[i] / 4 + '"><b>' + pre[i] + '</b></span>' +
        '<span class="ad__barra ad__barra--despues" style="--v:' + post[i] / 4 + '"><b>' + post[i] + '</b></span></li>';
    }).join("");
    var filas = A.map(function (a, i) {
      return '<tr><th scope="row">' + esc(a) + '</th><td>' + pre[i] + ' (' + esc(D.autoeval.escala[pre[i] - 1]) + ')</td><td>' + post[i] + ' (' + esc(D.autoeval.escala[post[i] - 1]) + ')</td></tr>';
    }).join("");
    var sello = selloObtenido(), codigo = codigoResultado();
    var cabeza = ES_SIMPLE
      ? '<div class="saliste__head saliste__head--simple"><h1 class="saliste__t" id="saliste-t" tabindex="-1" data-foco>' + esc(X.titulo) + '</h1><p class="saliste__sub">' + esc(X.sub_simple) + '</p></div>'
      : '<div class="saliste__head">' +
          '<div><p class="portada__kicker">' + ic("j-puerta") + esc(D.titulo) + '</p>' +
          '<h1 class="saliste__t" id="saliste-t" tabindex="-1" data-foco>' + esc(X.titulo) + '</h1><p class="saliste__sub">' + esc(X.sub) + '</p>' +
          '<ul class="saliste__datos">' +
            '<li class="sello sello--' + esc(sello.id) + '"><span class="sello__ic">' + ic("j-sello") + '</span><span><small>' + esc(X.sello) + '</small><b>' + esc(sello.nombre) + '</b></span></li>' +
            '<li><small>' + esc(X.pistas_usadas) + '</small><b>' + S.pistas_pagadas + '</b></li>' +
            '<li><small>' + esc(X.salas) + '</small><b>' + resueltas() + '/' + TOTAL + '</b></li>' +
            (S.tiempo_visible ? '<li><small>' + esc(X.tiempo) + '</small><b>' + formatoTiempo(S.tiempo_ms) + '</b></li>' : "") +
          '</ul></div>' +
          '<div class="saliste__chipi">' + chipi("feliz", NIVELES.length - 1, "chipi--saliste") + '</div>' +
        '</div>';
    app.innerHTML =
      '<section class="saliste" aria-labelledby="saliste-t">' + cabeza +
        '<div class="saliste__grid">' +
          '<section class="tarjeta ad" aria-labelledby="ad-t">' +
            '<div class="ad__head"><h2 class="ad__t" id="ad-t">' + esc(X.antes_despues) + '</h2>' +
            '<p class="ad__ley" aria-hidden="true"><span class="ad__punto ad__punto--antes"></span>' + esc(X.antes) + '<span class="ad__punto ad__punto--despues"></span>' + esc(X.despues) + '</p></div>' +
            '<ol class="ad__lista" aria-hidden="true">' + barras + '</ol>' +
            '<details class="ad__tabla"><summary>' + esc(X.tabla) + '</summary><div class="esc-recibo__tabla"><table><thead><tr><th scope="col">Frase</th><th scope="col">' + esc(X.antes) + '</th><th scope="col">' + esc(X.despues) + '</th></tr></thead><tbody>' + filas + '</tbody></table></div></details>' +
            '<p class="sr-only">Tus respuestas antes y después están en la tabla de este apartado.</p>' +
          '</section>' +
          '<div class="saliste__lado">' +
            (parejas
              ? '<section class="tarjeta foco foco--parejas"><p class="kicker kicker--juego">' + ic("j-lista") + esc(X.parejas_t) + '</p><p class="foco__frase">' + esc(X.parejas) + '</p>' +
                  '<div class="foco__salas">' + D.salas.map(function (sa) { return '<button type="button" class="btn-juego btn-juego--sec btn-juego--chico" data-ir-sala="' + sa.id + '">' + esc((ES_SIMPLE ? "Pregunta " : "Sala ") + sa.id) + '</button>'; }).join("") + '</div></section>'
              : '<section class="tarjeta foco foco--fuerte"><p class="kicker kicker--ok">' + ic("j-check") + esc(X.fortaleza) + '</p><p class="foco__frase">' + esc(A[iFuerte]) + '</p><p class="foco__txt">' + esc(fuerteTxt) + '</p></section>' +
                '<section class="tarjeta foco foco--prox"><p class="kicker kicker--juego">' + ic("j-flecha") + esc(X.proximo) + '</p><p class="foco__frase">' + esc(A[iProx]) + '</p><p class="foco__txt">' + esc(X.proximo_txt) + '</p>' +
                  '<button type="button" class="btn-juego btn-juego--sec btn-juego--chico" data-ir-sala="' + (iProx + 1) + '"><span>' + esc((ES_SIMPLE ? SIMPLE.repasar : X.repasar) + " " + (iProx + 1)) + '</span>' + ic("j-flecha") + '</button></section>') +
            '<section class="tarjeta codigo-res" aria-labelledby="codres-t"><h2 class="codigo-res__t" id="codres-t">' + esc(X.codigo_t) + '</h2>' +
              '<p class="codigo-res__v" id="codigo-res-v">' + esc(codigo) + '</p>' +
              '<p class="codigo-res__ayuda">' + esc(X.codigo_ayuda) + '</p>' +
              '<button type="button" class="btn-juego btn-juego--ancho" id="copiar-codigo">' + ic("i-copy") + '<span>' + esc(X.copiar) + '</span></button></section>' +
          '</div>' +
        '</div>' +
        '<div class="acciones saliste__acciones">' + aTaller("../#finanzas", ic("j-volver") + '<span>' + esc(T.volver_taller) + '</span>', "btn-juego btn-juego--sec") +
          '<button type="button" class="btn-juego btn-juego--sec" data-reiniciar-final>' + esc(X.volver) + '</button></div>' +
      '</section>';
    document.getElementById("copiar-codigo").addEventListener("click", function (e) {
      var b = e.currentTarget;
      var hecho = function () {
        b.querySelector("span").textContent = X.copiado;
        b.classList.add("is-copiado");
        announce(X.copiado + ": " + codigo);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(codigo).then(hecho, function () { seleccionarCodigo(); });
      else seleccionarCodigo();
    });
  }
  function seleccionarCodigo() {
    var el = document.getElementById("codigo-res-v"), r = document.createRange();
    r.selectNodeContents(el);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
    announce("Seleccioné el código. Copialo con Control más C.");
  }

  /* ---------- Navegación y equipo ---------- */
  function conectarEquipo() {
    var b = document.getElementById("equipo-tiempo");
    if (!b) return;
    b.addEventListener("click", function () {
      S.tiempo_visible = !S.tiempo_visible;
      guardar();
      refrescarEquipo();
      var nb = document.getElementById("equipo-tiempo");
      if (nb) nb.focus();
    });
  }
  app.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ir-sala]");
    if (b && !b.disabled) { ir("sala", Number(b.getAttribute("data-ir-sala"))); return; }
    if (e.target.closest("[data-ir-puerta]")) { ir(ES_SIMPLE ? "post" : "puerta"); return; }
    var p = e.target.closest("[data-ir]");
    if (p) { ir(p.getAttribute("data-ir")); return; }
    if (e.target.closest("[data-reiniciar]")) { reiniciar(); return; }
    if (e.target.closest("[data-reiniciar-final]")) reiniciar(D.saliste.volver_confirmar);
  });

  /* En el celular, la barra fija del equipo se esconde cuando aparece el pie de página */
  var pie = document.querySelector(".esc-foot");
  if (pie && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle("is-pie-visible", entries[0].isIntersecting);
    }).observe(pie);
  }

  /* En el modo simple no se muestra la capa de juego, tampoco en la barra superior */
  if (ES_SIMPLE) {
    var tag = document.querySelector(".esc-tag");
    if (tag) tag.textContent = "Cuestionario";
    document.title = SIMPLE.titulo;
  }
  render();
  if (!ES_SIMPLE) {
    console.info("[Escape room] Balance: llaves máximas posibles " + (E.llaves_iniciales + TOTAL * E.llaves_por_reflexion) +
      " (" + E.llaves_iniciales + " + " + TOTAL + "), pistas disponibles " + TOTAL * 2 + ".");
  }
})();
