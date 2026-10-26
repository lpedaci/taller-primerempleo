/* Modo presentación: muestra el sitio como diapositivas para proyectar.
   No cambia el contenido ni el diseño de la web: cada parada se ve como en la web, dentro de un lienzo 16:9,
   y lo que no entra en la pantalla sigue en la diapositiva siguiente.
   Se entra con el botón «Presentar» de la barra superior o con ?presentar en la dirección. */
(function () {
  "use strict";
  var root = document.documentElement;
  var btn = document.getElementById("pres-btn");
  if (!btn) return;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var STORE = "primer-empleo-diapositiva";
  var HEADING = "h4, h5, .fin-sub";
  /* Lo que nunca queda solo al final de una diapositiva: los títulos, las pestañas y las actividades
     (que suelen presentar la plantilla que viene después) */
  var KEEP = HEADING + ", .tabs, .activity";
  /* Las animaciones, capturas y hojas de CV no se achican con la letra */
  var FIXED = ".mg, .captura, .perfiles, .tabs, .cvpanel, .sheet-wrap";
  /* Figuras que se pueden achicar enteras (con zoom) para aprovechar el lugar */
  var MEDIA = ".mg, .captura, .perfiles";
  var ic = function (n, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>';
  };
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function text(el) { return el ? el.textContent.replace(/\s+/g, " ").trim() : ""; }
  function kids(el, skip) {
    return Array.prototype.filter.call(el.children, function (c) {
      if (skip && c.matches(skip)) { c.setAttribute("data-pres-skip", ""); return false; }
      return true;
    });
  }

  /* ---------- Apartados ----------
     Portada, mapa, separadores de línea y paradas. Los apartados especiales solo se mencionan,
     con sus tarjetas del mapa, como en la parte superior de la web. */
  var groups = [], slides = [], built = false;
  /* Escenario fijo de 1920 × 1080: en otra pantalla todo se ve igual, más chico o más grande */
  var STAGE_W = 1920, STAGE_H = 1080, scale = 1;
  function setStage() {
    scale = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
    root.style.setProperty("--s", scale.toFixed(4));
    root.style.setProperty("--ox", ((window.innerWidth - STAGE_W * scale) / 2).toFixed(1) + "px");
    root.style.setProperty("--oy", ((window.innerHeight - STAGE_H * scale) / 2).toFixed(1) + "px");
  }
  function build() {
    if (built) return;
    built = true;
    /* Los pasos guardan su número: si una lista se reparte en dos diapositivas, la numeración sigue */
    $$("ol.steps").forEach(function (ol) {
      Array.prototype.forEach.call(ol.children, function (li, i) { li.setAttribute("data-n", i + 1); });
    });
    var hero = $(".hero"), mapa = $(".mapa");
    if (hero) groups.push({ frame: hero, label: "Portada", color: "var(--t1)", fixed: [[$(".hero > .wrap")]] });
    if (mapa) {
      var wrap = $(".mapa > .wrap");
      var head = kids(wrap, ".howto").filter(function (c) { return !c.matches(".especiales"); });
      groups.push({ frame: mapa, label: "El mapa del recorrido", color: "var(--t3)", fixed: [head] });
      groups.push({ frame: mapa, label: "Apartados especiales", color: "var(--t4)", fixed: [[$(".especiales", wrap)]] });
    }
    $$("#contenido > .line-head, #contenido > .station:not(.especial)").forEach(function (el) {
      var color = el.classList.contains("line-1") ? "var(--l1)" : "var(--l2)";
      if (el.matches(".line-head")) {
        groups.push({ frame: el, label: text($("h2", el)), color: color, fixed: [kids(el)] });
        return;
      }
      var n = el.id.match(/^p(\d+)$/);
      groups.push({ frame: el, label: "Parada " + n[1] + ": " + text($("h3", el)), color: color, items: kids(el, ".station-end") });
    });
    linkPins();
    buildUI();
  }

  /* Al pasar el cursor por una marca del CV se resalta su explicación, y al revés */
  function linkPins() {
    $$(".sheet-wrap").forEach(function (wrap) {
      var list = wrap.nextElementSibling;
      if (!list || !list.matches("ol.callouts")) return;
      var items = Array.prototype.slice.call(list.children);
      $$(".pin", wrap).forEach(function (pin) {
        var li = items[+pin.textContent.trim() - 1];
        if (!li) return;
        var on = function (v) { pin.classList.toggle("is-hot", v); li.classList.toggle("is-hot", v); };
        [pin, li].forEach(function (el) {
          el.addEventListener("mouseenter", function () { on(true); });
          el.addEventListener("mouseleave", function () { on(false); });
        });
      });
    });
  }

  /* ---------- Paginado ----------
     Se mide cada bloque tal como se ve en la web y se llena cada diapositiva hasta donde entra.
     Un título nunca queda solo al final: pasa a la diapositiva siguiente con su contenido.
     Una lista o una tabla que no entra entera se reparte por renglones. */
  function clearShown() {
    $$(".pres-cur").forEach(function (f) { f.classList.remove("pres-cur", "pres-center", "pres-feature", "pres-duo", "pres-cvs"); });
    $$(".pres-on").forEach(function (el) { el.classList.remove("pres-on", "pres-anim"); });
    $$("[data-pres-split]").forEach(function (el) { el.removeAttribute("data-pres-split"); });
    $$(".pres-row").forEach(function (el) { el.classList.remove("pres-row"); });
    $$("[data-pres-zoom]").forEach(function (el) { el.style.zoom = ""; el.removeAttribute("data-pres-zoom"); });
  }
  function availOf(frame) {
    var cs = getComputedStyle(frame);
    return frame.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 2;
  }
  /* Alto de un bloque en el escenario de 1920 × 1080 (sin la escala de la pantalla) */
  function outer(el) {
    var cs = getComputedStyle(el);
    return el.getBoundingClientRect().height / scale + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
  }
  /* Lo que no queda último en una diapositiva: títulos, pestañas, actividades y párrafos que presentan
     una lista (terminan en dos puntos) */
  function isKeep(el) {
    return el.matches(KEEP) || (el.tagName === "P" && /:\s*$/.test(el.textContent));
  }
  /* Renglones que se pueden repartir: los ítems de una lista o las filas de una tabla */
  function rowsOf(el) {
    /* Una lista que se ve en grilla no se reparte: sus ítems están uno al lado del otro */
    if (getComputedStyle(el).display === "grid") return null;
    if (el.matches("ul, ol")) return Array.prototype.slice.call(el.children);
    var body = el.matches(".table-wrap") && $("tbody", el);
    return body ? Array.prototype.slice.call(body.children) : null;
  }
  function paginate() {
    slides = [];
    clearShown();
    groups.forEach(function (g) {
      g.first = slides.length;
      if (g.fixed) {
        g.fixed.forEach(function (els) { slides.push({ group: g, parts: els.map(function (el) { return { el: el }; }), title: g.label }); });
        return;
      }
      var frame = g.frame;
      frame.classList.add("pres-cur");
      g.items.forEach(function (el) { el.classList.add("pres-on"); });
      var avail = availOf(frame);
      var hs = g.items.map(outer);
      /* El CV de ejemplo y sus problemas numerados van uno al lado del otro: la lista solo suma lo que
         sobresale debajo del CV */
      g.items.forEach(function (el, i) {
        if (el.matches("ol.callouts") && i && g.items[i - 1].matches(".sheet-wrap")) hs[i] = Math.max(0, hs[i] - hs[i - 1]);
      });
      var page = [], used = 0, heading = "", pages = [];
      /* Cierra la diapositiva. Con carry, un título que quedó último pasa a la siguiente con su contenido */
      var flush = function (carry) {
        var tail = [];
        while (carry && page.length > 1 && page[page.length - 1].h && isKeep(page[page.length - 1].el)) {
          var t = page.pop(); used -= t.h; tail.unshift(t);
        }
        if (page.length) pages.push({ group: g, parts: page, title: page.title || heading, used: used });
        page = tail; used = tail.reduce(function (a, t) { return a + t.h; }, 0);
        page.title = heading;
      };
      page.title = "";
      g.items.forEach(function (el, i) {
        var h = hs[i];
        if (el.matches(HEADING)) heading = text(el.matches(".fin-sub") ? $("h4", el) : el);
        /* Un título necesita lugar para sí y para el comienzo de lo que sigue */
        /* Los paneles de unas pestañas van siempre con sus pestañas, en la misma diapositiva */
        /* Ejemplos de CV: los tres paneles se muestran juntos, uno al lado del otro, en su propia diapositiva
           (con el título y la frase que los presentan) */
        if (el.matches(".tabs")) {
          /* El título del tema (y lo que lo sigue) pasa con los CV a su diapositiva */
          var hi = -1;
          page.forEach(function (pt, k) { if (pt.el.matches(HEADING)) hi = k; });
          if (hi > 0) {
            var moving = page.splice(hi);
            used -= moving.reduce(function (a, t) { return a + (t.h || 0); }, 0);
            flush();
            moving.forEach(function (t) { page.push(t); used += t.h || 0; });
          } else if (used > avail * 0.35 && hi < 0) flush(true);
          page.push({ el: el, h: 0 }); return;
        }
        if (el.matches(".cvpanel") && page.length) {
          page.push({ el: el, h: 0 });
          if (!(g.items[i + 1] && g.items[i + 1].matches(".cvpanel"))) { used = avail; flush(); }
          return;
        }
        var next = hs[i + 1];
        /* Si lo que sigue es una lista o tabla que se puede repartir, alcanza con que entre su comienzo */
        var nextSplits = next && rowsOf(g.items[i + 1]);
        var need = isKeep(el) && next ? h + (next <= avail && !nextSplits ? next : 160) : h;
        /* Antes de dejar mucho espacio vacío, la diapositiva se achica un poco para que entre el bloque
           siguiente (shrink lo ajusta al mostrarla) */
        var limit = used < avail * 0.6 ? avail / 0.76 : avail / 0.9;
        /* Con animaciones, capturas u hojas de CV no hay margen: esos bloques no se achican con la letra */
        var rigid = el.matches(FIXED) || page.some(function (pt) { return pt.el.matches(FIXED); });
        if (rigid) limit = avail;
        /* Una figura que se puede achicar no fuerza el cambio si queda bastante lugar */
        var mediaFits = el.matches(MEDIA) && used && avail - used >= Math.max(340, h * 0.55);
        if (used && used + need > limit && !mediaFits) flush(true);
        if (!page.length) page.title = heading;
        if (used + h <= (used ? limit : avail)) { page.push({ el: el, h: h }); used += h; return; }
        /* No entra entero: si se puede, se reparte por renglones (aprovechando el lugar que queda) */
        var rows = rowsOf(el);
        if (rows && h <= avail && avail - used < avail * 0.3) { flush(); page.push({ el: el, h: h }); used += h; return; }
        if (!rows || rows.length < 2) {
          /* Una animación o captura se achica para ocupar el lugar que queda, si queda bastante */
          var media = el.matches(MEDIA);
          if (media && used && avail - used >= Math.max(340, h * 0.55)) {
            page.push({ el: el, h: avail - used, zoom: (avail - used) * 0.97 / h }); used = avail; flush(); return;
          }
          /* Si no, va en su diapositiva, con el título que lo presenta si venía justo antes */
          var onlyKeeps = page.every(function (p) { return isKeep(p.el); });
          if (used && !onlyKeeps) flush(true);
          var part1 = { el: el, h: h };
          if (media && h > avail - used) { part1.zoom = Math.max(0.5, (avail - used) * 0.97 / h); part1.h = avail - used; }
          page.title = heading; page.push(part1); used += part1.h; flush(); return;
        }
        var rh = rows.map(outer);
        var shell = h - rh.reduce(function (a, b) { return a + b; }, 0);
        var part = null;
        rows.forEach(function (r, k) {
          if (part && used + rh[k] > avail) { flush(); part = null; }
          if (!part) {
            if (used + shell + rh[k] > avail && used) flush();
            part = { el: el, rows: [] }; page.push(part); used += shell;
          }
          part.rows.push(r); used += rh[k];
        });
      });
      flush();
      /* Ninguna diapositiva queda con un bloque suelto y mucho vacío: se une a la anterior o a la siguiente
         (y al mostrarla se achica lo justo para que entre) */
      var roomy = avail / 0.74;
      var scalable = function (a, b) {
        return !a.parts.concat(b.parts).some(function (pt) { return pt.el.matches(FIXED); });
      };
      var merged = true;
      while (merged && pages.length > 1) {
        merged = false;
        for (var k = 0; k < pages.length && !merged; k++) {
          var pg = pages[k], prev = pages[k - 1], nxt = pages[k + 1];
          if (pg.used >= avail * 0.45) continue;
          var toPrev = prev && prev.used + pg.used <= roomy && scalable(prev, pg);
          var toNext = nxt && nxt.used + pg.used <= roomy && scalable(pg, nxt);
          /* Se une con la vecina que quede menos cargada */
          if (toPrev && (!toNext || prev.used <= nxt.used)) {
            prev.parts = prev.parts.concat(pg.parts); prev.used += pg.used; pages.splice(k, 1); merged = true;
          } else if (toNext) {
            pg.parts = pg.parts.concat(nxt.parts); pg.used += nxt.used; pages.splice(k + 1, 1); merged = true;
          }
        }
      }
      /* Si no se pudo unir, se equilibra con la anterior: pasan sus últimos bloques para que las dos queden parejas */
      for (var q = 1; q < pages.length; q++) {
        var cur = pages[q], before = pages[q - 1];
        if (cur.used >= avail * 0.45 || !scalable(cur, before)) continue;
        while (before.parts.length > 1 && cur.used < avail * 0.5) {
          var last = before.parts[before.parts.length - 1];
          if (!last.h || last.rows || last.el.matches(".cvpanel")) break;
          if (cur.used + last.h > avail || before.used - last.h < avail * 0.35) break;
          before.parts.pop(); before.used -= last.h;
          cur.parts.unshift(last); cur.used += last.h;
          /* Un título no queda último: acompaña a lo que presenta */
          var tail = before.parts[before.parts.length - 1];
          if (tail && tail.h && isKeep(tail.el) && before.parts.length > 1) {
            before.parts.pop(); before.used -= tail.h; cur.parts.unshift(tail); cur.used += tail.h;
          }
        }
      }
      /* Revisión final: si una diapositiva termina en un título o en una frase que presenta lo que sigue,
         ese bloque pasa al comienzo de la siguiente */
      for (var w = 0; w < pages.length - 1; w++) {
        var pw = pages[w];
        while (pw.parts.length > 1) {
          var lp = pw.parts[pw.parts.length - 1];
          if (!lp.h || lp.rows || !isKeep(lp.el)) break;
          pw.parts.pop(); pw.used -= lp.h;
          pages[w + 1].parts.unshift(lp); pages[w + 1].used += lp.h;
        }
      }
      /* Título de cada diapositiva: su primer subtítulo o, si continúa un tema, el último que venía */
      var lastHead = "";
      var headText = function (el) { return text(el.matches(".fin-sub") ? $("h4", el) : el); };
      pages.forEach(function (pg) {
        var heads = pg.parts.filter(function (pt) { return pt.el.matches(HEADING); });
        pg.title = heads.length ? headText(heads[0].el) : lastHead;
        if (heads.length) lastHead = headText(heads[heads.length - 1].el);
        slides.push(pg);
      });
      g.items.forEach(function (el) { el.classList.remove("pres-on"); });
      frame.classList.remove("pres-cur");
    });
  }

  /* ---------- Controles ---------- */
  var bar, counter, crumb, progress, prevBtn, nextBtn, fsBtn, dialog, live = $("#live");
  function buildUI() {
    bar = document.createElement("div");
    bar.className = "pres-bar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "Controles de la presentación");
    bar.innerHTML =
      '<span class="pres-progress" aria-hidden="true"><i></i></span>' +
      '<button type="button" class="pres-b pres-exit">' + ic("x") + "<span>Salir</span></button>" +
      '<p class="pres-crumb"><i class="pres-dot"></i><span></span></p>' +
      '<p class="pres-count" aria-hidden="true"></p>' +
      '<button type="button" class="pres-b pres-b--icon pres-index-btn" aria-label="Índice de la presentación (O)">' + ic("squares-four") + "</button>" +
      '<button type="button" class="pres-b pres-b--icon pres-fs" aria-label="Pantalla completa (F)">' + ic("corners-out") + "</button>" +
      '<button type="button" class="pres-b pres-b--icon pres-prev" aria-label="Diapositiva anterior">' + ic("arrow-right", "flip") + "</button>" +
      '<button type="button" class="pres-b pres-b--icon pres-b--main pres-next" aria-label="Diapositiva siguiente">' + ic("arrow-right") + "</button>";
    document.body.appendChild(bar);
    counter = $(".pres-count", bar); crumb = $(".pres-crumb", bar); progress = $(".pres-progress i", bar);
    prevBtn = $(".pres-prev", bar); nextBtn = $(".pres-next", bar); fsBtn = $(".pres-fs", bar);
    $(".pres-exit", bar).addEventListener("click", function () { exit(); });
    prevBtn.addEventListener("click", function () { go(index - 1); });
    nextBtn.addEventListener("click", function () { go(index + 1); });
    fsBtn.addEventListener("click", toggleFullscreen);
    $(".pres-index-btn", bar).addEventListener("click", openIndex);

    dialog = document.createElement("dialog");
    dialog.className = "pres-index";
    dialog.setAttribute("aria-labelledby", "pres-index-t");
    document.body.appendChild(dialog);
    dialog.addEventListener("click", function (e) {
      var b = e.target.closest("[data-go]");
      if (b) { dialog.close(); go(+b.getAttribute("data-go")); }
      else if (e.target.closest(".pres-index-close") || e.target === dialog) dialog.close();
    });
  }
  function openIndex() {
    var cur = slides[index].group;
    dialog.innerHTML =
      '<div class="pres-index-head"><h2 id="pres-index-t">Índice</h2><button type="button" class="pres-b pres-b--icon pres-index-close" aria-label="Cerrar el índice">' + ic("x") + "</button></div>" +
      '<ol class="pres-index-list">' + groups.map(function (g, i) {
        var count = (groups[i + 1] ? groups[i + 1].first : slides.length) - g.first;
        return '<li><button type="button" data-go="' + g.first + '" class="' + (g === cur ? "is-current" : "") + '" style="--c:' + g.color + '"><i></i><span>' + g.label + "</span><small>" + count + (count === 1 ? " diapositiva" : " diapositivas") + "</small></button></li>";
      }).join("") + "</ol>" +
      '<p class="pres-keys"><kbd>←</kbd> <kbd>→</kbd> avanzar y retroceder · <kbd>F</kbd> pantalla completa · <kbd>O</kbd> índice · <kbd>Esc</kbd> salir</p>';
    dialog.showModal();
    var b = $(".is-current", dialog);
    if (b) b.focus();
  }

  /* ---------- Navegación ---------- */
  var index = 0, active = false;
  /* Un bloque solo que igual no entra (por ejemplo, una figura grande) se achica lo justo */
  function shrink(frame, parts) {
    root.style.removeProperty("--pres-fs");
    frame.classList.remove("pres-center", "pres-feature");
    /* Una actividad o una plantilla sola es una diapositiva propia: se destaca en grande */
    if (parts.length === 1 && parts[0].el.matches(".activity, .template")) frame.classList.add("pres-feature");
    var measure = function () {
      var top = Infinity, bottom = -Infinity;
      parts.forEach(function (p) {
        var r = p.el.getBoundingClientRect(), cs = getComputedStyle(p.el);
        if (!r.height) return;
        top = Math.min(top, r.top - parseFloat(cs.marginTop) * scale);
        bottom = Math.max(bottom, r.bottom + parseFloat(cs.marginBottom) * scale);
      });
      return (bottom - top) / scale / availOf(frame);
    };
    /* Los tres CV se comparan a tamaño fijo: cada uno se desplaza por dentro */
    if (frame.classList.contains("pres-cvs")) return;
    var f = 1;
    while (measure() > 0.985 && f > 0.72) {
      f -= 0.04;
      root.style.setProperty("--pres-fs", f.toFixed(2));
    }
    /* Con poco contenido, la letra crece apenas y el bloque se centra: no queda un objeto suelto arriba */
    if (f === 1 && measure() < 0.7) {
      while (f < 1.24) {
        root.style.setProperty("--pres-fs", (f + 0.04).toFixed(2));
        if (measure() > 0.92) { root.style.setProperty("--pres-fs", f.toFixed(2)); break; }
        f += 0.04;
      }
      var hasHead = parts.some(function (p) { return p.el.matches(".station-head"); });
      if (measure() < 0.75 && !hasHead) frame.classList.add("pres-center");
    }
  }
  function go(i, instant) {
    if (!slides.length) return;
    i = Math.max(0, Math.min(slides.length - 1, i));
    var dir = i >= index ? "next" : "prev";
    var s = slides[i], frame = s.group.frame;
    clearShown();
    frame.classList.add("pres-cur");
    frame.setAttribute("data-dir", dir);
    s.parts.forEach(function (p) {
      p.el.classList.add("pres-on");
      if (p.zoom) { p.el.style.zoom = p.zoom.toFixed(3); p.el.setAttribute("data-pres-zoom", ""); }
      if (p.rows) {
        p.el.setAttribute("data-pres-split", "");
        p.rows.forEach(function (r) { r.classList.add("pres-row"); });
      }
      if (!instant && !reduceMotion.matches) { void p.el.offsetWidth; p.el.classList.add("pres-anim"); }
    });
    $$(".reveal", frame).forEach(function (el) { el.classList.add("is-in"); });
    frame.classList.toggle("pres-cvs", s.parts.some(function (p) { return p.el.matches(".tabs"); }));
    frame.classList.toggle("pres-duo", s.parts.some(function (p) { return p.el.matches(".sheet-wrap"); }) && s.parts.some(function (p) { return p.el.matches("ol.callouts"); }));
    index = i;
    shrink(frame, s.parts);
    frame.scrollTop = 0;
    var label = s.group.label + (s.title && s.title !== s.group.label ? " · " + s.title : "");
    counter.textContent = (i + 1) + " / " + slides.length;
    $("span", crumb).textContent = label;
    crumb.style.setProperty("--c", s.group.color);
    progress.style.transform = "scaleX(" + ((i + 1) / slides.length) + ")";
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === slides.length - 1;
    if (live) live.textContent = "Diapositiva " + (i + 1) + " de " + slides.length + ": " + label;
    try { sessionStorage.setItem(STORE, String(i)); } catch (e) {}
  }
  /* La diapositiva donde está un elemento (para los enlaces internos, como las paradas del mapa) */
  function slideOf(el) {
    for (var i = 0; i < slides.length; i++) {
      var s = slides[i];
      if (s.group.frame === el) return s.group.first;
      for (var k = 0; k < s.parts.length; k++) {
        var p = s.parts[k];
        if (p.el === el || p.el.contains(el)) {
          if (!p.rows || p.rows.some(function (r) { return r === el || r.contains(el); }) || el === p.el) return i;
        }
      }
    }
    return -1;
  }
  window.addEventListener("hashchange", function () {
    if (!active) return;
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    var i = slideOf(el);
    /* Un apartado especial no está en la presentación: se abre en la web */
    if (i < 0) exit(el);
    else go(i);
  });

  function enter(fromLoad) {
    build();
    var start = 0;
    var from = null;
    if (!fromLoad) {
      /* Empieza donde estabas leyendo: la parada abierta o, si estabas arriba, la portada */
      var view = $$("#contenido > .station:not(.especial):not([hidden])")[0];
      var mapa = $(".mapa");
      if (view && view.getBoundingClientRect().top < window.innerHeight * 0.6) from = view;
      else if (mapa && mapa.getBoundingClientRect().top < window.innerHeight * 0.5 && mapa.getBoundingClientRect().bottom > 0) from = mapa;
      if (root.requestFullscreen && !document.fullscreenElement) root.requestFullscreen().catch(function () {});
    }
    active = true;
    root.classList.add("is-pres");
    setStage();
    paginate();
    if (fromLoad) { try { start = +sessionStorage.getItem(STORE) || 0; } catch (e) {} }
    else if (from) start = Math.max(0, slideOf(from));
    var url = new URL(location.href);
    url.searchParams.set("presentar", "");
    history.replaceState(history.state, "", url.toString().replace("presentar=", "presentar"));
    go(start, true);
    wake();
  }
  /* Sale a la web. Sin destino, vuelve a la parada de la diapositiva actual */
  function exit(dest) {
    if (!active) return;
    active = false;
    var s = slides[index];
    root.classList.remove("is-pres", "pres-idle");
    root.style.removeProperty("--pres-fs");
    clearTimeout(idle);
    clearShown();
    if (dialog.open) dialog.close();
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    var url = new URL(location.href);
    url.searchParams.delete("presentar");
    history.replaceState(history.state, "", url.toString());
    var target = dest || null;
    if (!target) {
      var f = s.group.frame;
      target = f.matches(".station") ? f : f.matches(".mapa") ? f : null;
      if (target && location.hash !== "#" + target.id) location.hash = target.id;
    }
    if (target) requestAnimationFrame(function () { target.scrollIntoView({ block: "start" }); });
    else window.scrollTo(0, 0);
    btn.focus({ preventScroll: true });
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    else if (root.requestFullscreen) root.requestFullscreen().catch(function () {});
  }
  document.addEventListener("fullscreenchange", function () {
    if (!fsBtn) return;
    $("use", fsBtn).setAttribute("href", document.fullscreenElement ? "#i-corners-in" : "#i-corners-out");
    fsBtn.setAttribute("aria-label", document.fullscreenElement ? "Salir de pantalla completa (F)" : "Pantalla completa (F)");
  });

  /* Teclado: no interfiere con campos, botones ni pestañas del contenido */
  document.addEventListener("keydown", function (e) {
    if (!active || e.altKey || e.ctrlKey || e.metaKey) return;
    if (dialog.open) return;
    var t = e.target;
    var typing = t.closest && t.closest("input, textarea, select, [contenteditable], [role='tab']");
    var k = e.key;
    if (k === "Escape") { if (!document.fullscreenElement) exit(); return; }
    if (typing) return;
    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !t.closest("button, a, summary"))) { e.preventDefault(); go(index + 1); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); go(index - 1); }
    else if (k === "Home") { e.preventDefault(); go(0); }
    else if (k === "End") { e.preventDefault(); go(slides.length - 1); }
    else if (k === "f" || k === "F") toggleFullscreen();
    else if (k === "o" || k === "O") openIndex();
  });
  /* Deslizar con el dedo en pantallas táctiles */
  var touchX = null;
  document.addEventListener("touchstart", function (e) { touchX = active && e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 70 && !e.target.closest("input, .sheet-wrap, .table-wrap")) go(index + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* La barra se atenúa si el mouse no se mueve, para no tapar lo proyectado */
  var idle;
  function wake() {
    if (!active) return;
    root.classList.remove("pres-idle");
    clearTimeout(idle);
    idle = setTimeout(function () { if (!bar.matches(":hover, :focus-within")) root.classList.add("pres-idle"); }, 2600);
  }
  document.addEventListener("mousemove", wake, { passive: true });
  /* Si cambia el tamaño de la pantalla, se vuelve a paginar y se queda en el mismo contenido */
  var resizeT;
  window.addEventListener("resize", function () {
    if (!active) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      var anchor = slides[index].parts[0];
      var el = anchor.rows ? anchor.rows[0] : anchor.el;
      setStage();
      paginate();
      go(Math.max(0, slideOf(el)), true);
    }, 200);
  });

  btn.addEventListener("click", function () { enter(false); });
  if (/[?&]presentar(?:=|&|$)/.test(location.search)) {
    if (document.readyState === "complete") enter(true);
    else window.addEventListener("load", function () { enter(true); });
  }
})();
