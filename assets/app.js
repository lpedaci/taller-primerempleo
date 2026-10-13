(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "primer-empleo-v1";
  var THEME_KEY = "primer-empleo-tema";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function load() { try { var r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  var state = load();
  state.stations = state.stations || {};
  state.checks = state.checks || {};
  var live = $("#live");
  function announce(msg) { if (live) live.textContent = msg; }

  /* ---------- Tema claro / oscuro ---------- */
  function currentTheme() {
    return root.getAttribute("data-theme") || (darkScheme.matches ? "dark" : "light");
  }
  /* Colores ya resueltos del tema activo, para pasarlos a las animaciones */
  function themeVars() {
    var probe = document.createElement("i"), out = {};
    probe.style.display = "none"; document.body.appendChild(probe);
    ["bg", "surface", "ink", "muted", "rule", "l1", "l1-soft", "l2", "l2-soft", "on-line", "yes", "no"].forEach(function (name) {
      probe.style.color = "var(--" + name + ")";
      out["--" + name] = getComputedStyle(probe).color;
    });
    document.body.removeChild(probe);
    return out;
  }
  function syncFigures() {
    figures.forEach(function (f) { f.send({ cmd: "theme", value: currentTheme() }); f.send({ cmd: "vars", value: themeVars() }); });
  }
  var themeBtn = $("#theme-btn");
  function syncThemeBtn() {
    if (themeBtn) themeBtn.setAttribute("aria-label", currentTheme() === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  }
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    syncThemeBtn();
    syncFigures();
  });

  /* ---------- Paradas recorridas ---------- */
  var stationBoxes = $$("input[data-station]");
  var total = stationBoxes.length;
  var cta = $("#cta-start");
  var nextStop = $("#next-stop"), nextLabel = $("#next-label");
  /* Nombre corto de una parada, tomado del mapa (sin los textos para lector de pantalla) */
  function stopName(id) {
    var el = $('.metro a[data-stop="' + id + '"] .stop-name');
    return Array.prototype.filter.call(el.childNodes, function (c) { return c.nodeType === 3; })
      .map(function (c) { return c.textContent; }).join("").trim();
  }
  function refresh(popId) {
    var n = 0, firstPending = null;
    stationBoxes.forEach(function (b) {
      var id = b.getAttribute("data-station"), done = !!state.stations[id];
      b.checked = done;
      if (done) n++; else if (!firstPending) firstPending = id;
      $$('[data-stop="' + id + '"]').forEach(function (el) {
        el.classList.toggle("is-done", done);
        var sr = $(".stop-state", el);
        if (sr) sr.textContent = done ? " (recorrida)" : "";
        if (done && id === popId) {
          var dot = $(".dot", el);
          if (dot) { dot.classList.remove("is-pop"); void dot.offsetWidth; dot.classList.add("is-pop"); }
        }
      });
    });
    $$(".done-count").forEach(function (el) { el.textContent = String(n); });
    root.style.setProperty("--done", (n / total).toFixed(3));
    if (nextStop) {
      nextLabel.textContent = firstPending ? "Próxima parada" : "Recorrido completo";
      nextStop.href = "#" + (firstPending || "p10");
      nextStop.textContent = firstPending ? stopName(firstPending) : "Repasar tu plan";
    }
    if (cta && n > 0) {
      if (firstPending) {
        cta.href = "#" + firstPending;
        $("span", cta).textContent = "Seguir en la parada " + firstPending.slice(1);
      } else {
        cta.href = "#p10";
        $("span", cta).textContent = "Repasar tu plan";
      }
    }
    return n;
  }
  stationBoxes.forEach(function (b) {
    b.addEventListener("change", function () {
      var id = b.getAttribute("data-station");
      state.stations[id] = b.checked; save(state);
      var n = refresh(id);
      announce(b.checked ? "Parada " + id.slice(1) + " recorrida. Llevás " + n + " de " + total + "." : "Parada " + id.slice(1) + " desmarcada.");
    });
  });

  /* ---------- Plan de 30 días ---------- */
  var checks = $$("input[data-check]");
  var checkCount = $("#check-count");
  function refreshChecks() {
    var n = checks.filter(function (b) { return b.checked; }).length;
    if (checkCount) checkCount.textContent = n + " de " + checks.length + " tareas hechas";
  }
  checks.forEach(function (b) {
    var id = b.getAttribute("data-check");
    b.checked = !!state.checks[id];
    b.addEventListener("change", function () { state.checks[id] = b.checked; save(state); refreshChecks(); });
  });
  var reset = $("#reset");
  if (reset) reset.addEventListener("click", function () {
    if (!confirm("¿Borrar las paradas marcadas y la lista del plan?")) return;
    state = { stations: {}, checks: {} }; save(state);
    checks.forEach(function (b) { b.checked = false; });
    refresh(); refreshChecks();
    announce("Avance borrado.");
  });
  refresh(); refreshChecks();

  /* ---------- Copiar plantillas ---------- */
  function fallbackCopy(t) {
    var a = document.createElement("textarea"); a.value = t; a.setAttribute("readonly", "");
    a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select();
    var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(a); return ok;
  }
  $$("button.copy").forEach(function (btn) {
    var label = $("span", btn);
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-copy")); if (!el) return;
      var t = el.textContent, text = label.textContent;
      function done(ok) {
        label.textContent = ok ? "Copiada" : "No se pudo copiar"; btn.classList.toggle("is-copied", ok);
        announce(ok ? "Plantilla copiada al portapapeles." : "No se pudo copiar la plantilla.");
        setTimeout(function () { label.textContent = text; btn.classList.remove("is-copied"); }, 1800);
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(fallbackCopy(t)); });
      else done(fallbackCopy(t));
    });
  });

  /* ---------- Pestañas de los CV de ejemplo ---------- */
  var tabs = $$('[role="tab"]');
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      var j = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
      if (j === null) return;
      j = (j + tabs.length) % tabs.length; select(tabs[j]); tabs[j].focus(); e.preventDefault();
    });
  });

  /* ---------- Tablas apiladas en pantallas chicas ---------- */
  $$(".table-wrap table").forEach(function (table) {
    var heads = $$("thead th", table).map(function (th) { return th.textContent.trim(); });
    if (!heads.length) return;
    table.setAttribute("role", "table");
    $$("tr", table).forEach(function (tr) { tr.setAttribute("role", "row"); });
    $$("thead th", table).forEach(function (th) { th.setAttribute("role", "columnheader"); });
    $$("tbody tr", table).forEach(function (tr) {
      Array.prototype.forEach.call(tr.children, function (cell, i) {
        cell.setAttribute("role", cell.tagName === "TH" ? "rowheader" : "cell");
        if (i > 0 && heads[i]) cell.setAttribute("data-label", heads[i]);
      });
    });
    table.classList.add("is-stacked");
  });

  /* ---------- Riel: parada actual y avance ---------- */
  var stations = $$("section.station");
  var railList = $(".rail-list");
  var railLinks = $$(".rail-list a, .rail-extra a");
  function setCurrent(id) {
    railLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-current", on);
      if (on) a.setAttribute("aria-current", "step");
      else a.removeAttribute("aria-current");
    });
  }
  /* Título de la barra superior: muestra el apartado que se está leyendo */
  var topNow = $("#top-now"), nowTag = $(".now-tag", topNow), nowTitle = $(".now-title", topNow), nowTimer;
  function setNow(section) {
    var isStation = section.classList.contains("station");
    var tag = isStation ? "Parada " + section.id.slice(1) : "";
    var title = isStation ? $("h3", section).textContent : section.getAttribute("data-now");
    if (nowTitle.textContent === title) return;
    function apply() {
      nowTag.textContent = tag;
      nowTitle.textContent = title;
      topNow.classList.toggle("line-1", section.classList.contains("line-1"));
      topNow.classList.toggle("line-2", section.classList.contains("line-2"));
      topNow.classList.remove("is-out");
    }
    clearTimeout(nowTimer);
    if (reduceMotion.matches) return apply();
    topNow.classList.add("is-out");
    nowTimer = setTimeout(apply, 160);
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        setNow(e.target);
        if (e.target.classList.contains("station")) setCurrent(e.target.id);
      });
    }, { rootMargin: "-20% 0px -55% 0px" });
    stations.concat($$("[data-now]")).forEach(function (s) { spy.observe(s); });
    /* Referencias es corta y está al final: no siempre llega a la franja de lectura.
       Se marca cuando se ve casi entera; al salir, vuelve la parada que quedó en pantalla. */
    var refs = $("#referencias");
    if (refs) new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { setNow(refs); setCurrent("referencias"); return; }
        if (!$('.rail-extra a.is-current')) return;
        var y = window.innerHeight * 0.3;
        var back = stations.filter(function (s) { var r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; })[0] || stations[stations.length - 1];
        setNow(back); setCurrent(back.id);
      });
    }, { threshold: 0.75 }).observe(refs);
  }

  /* ---------- Menú de paradas en pantallas chicas ---------- */
  var menuBtn = $("#menu-btn"), rail = $("#rail");
  function setMenu(open) {
    rail.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (menuBtn && rail) {
    menuBtn.addEventListener("click", function () { setMenu(!rail.classList.contains("is-open")); });
    rail.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && rail.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---------- Entrada de bloques al hacer scroll ---------- */
  $$(".line-head, .station-head, .station .key, .station .mg, .activity, .metro-name").forEach(function (el) { el.classList.add("reveal"); });
  $$(".facts, .metro, .howto, .agenda").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) { el.classList.add("reveal"); el.style.setProperty("--i", i); });
  });
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in"); revealer.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Animaciones HyperFrames (iframes con la composición viva) ---------- */
  var figures = $$("figure.mg").map(function (fig) {
    var id = fig.getAttribute("data-mg");
    var frame = $(".mg-frame", fig), iframe = $("iframe", fig), btn = $(".mg-btn", fig), label = btn && $(".mg-label", btn);
    var f = { id: id, fig: fig, ready: false, started: false, visible: false, state: "idle" };
    f.send = function (msg) { msg.mg = id; if (f.ready) iframe.contentWindow.postMessage(msg, "*"); };
    f.set = function (s) {
      f.state = s; fig.setAttribute("data-state", s);
      if (label) label.textContent = s === "playing" ? "Pausar" : s === "ended" ? "Ver de nuevo" : "Reproducir";
    };
    f.auto = function () {
      if (!f.ready || f.started || !f.visible) return;
      f.started = true;
      f.send({ cmd: reduceMotion.matches ? "end" : "play" });
    };
    function fit() { frame.style.setProperty("--s", (frame.clientWidth / 1200).toFixed(4)); }
    fit();
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(frame); else window.addEventListener("resize", fit);
    if (btn) btn.addEventListener("click", function () { f.started = true; f.resume = false; f.send({ cmd: f.state === "playing" ? "pause" : "play" }); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !iframe.src) iframe.src = iframe.getAttribute("data-src") + "&theme=" + currentTheme();
        });
      }, { rootMargin: "400px 0px" }).observe(fig);
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          f.visible = e.isIntersecting;
          if (!f.visible && f.state === "playing") { f.resume = true; f.send({ cmd: "pause" }); }
          else if (f.visible && f.resume) { f.resume = false; f.send({ cmd: "play" }); }
          else if (f.visible) f.auto();
        });
      }, { threshold: 0.55 }).observe(frame);
    } else {
      iframe.src = iframe.getAttribute("data-src") + "&theme=" + currentTheme();
    }
    f.set("idle");
    return f;
  });
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    figures.forEach(function (f) {
      if (d.mg !== f.id) return;
      if (d.state === "ready") { f.ready = true; f.fig.setAttribute("data-ready", ""); f.send({ cmd: "vars", value: themeVars() }); f.auto(); }
      else f.set(d.state);
    });
  });
  darkScheme.addEventListener("change", function () {
    syncThemeBtn();
    syncFigures();
  });
  syncThemeBtn();
})();
