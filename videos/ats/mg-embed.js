/* Puente para incrustar la composición en el sitio (iframe con ?embed=1).
   En render o en Studio no hace nada: la línea de tiempo queda en pausa. */
(function () {
  window.__timelines = window.__timelines || {};
  var q = new URLSearchParams(location.search);
  var theme = q.get("theme");
  if (theme) document.documentElement.setAttribute("data-theme", theme);

  window.__mgBridge = function (id, tl) {
    if (window.parent === window || !q.has("embed")) return;
    function post(state) {
      window.parent.postMessage({ mg: id, state: state }, "*");
    }
    tl.eventCallback("onComplete", function () {
      post("ended");
    });
    window.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.mg !== id) return;
      if (d.cmd === "play") {
        if (tl.progress() >= 1) tl.restart();
        else tl.play();
        post("playing");
      } else if (d.cmd === "pause") {
        tl.pause();
        post("paused");
      } else if (d.cmd === "end") {
        tl.pause().progress(1);
        post("ended");
      } else if (d.cmd === "vars") {
        Object.keys(d.value || {}).forEach(function (k) {
          if (/^--[a-z0-9-]+$/.test(k)) document.documentElement.style.setProperty(k, d.value[k]);
        });
      } else if (d.cmd === "theme") {
        document.documentElement.setAttribute("data-theme", d.value);
      }
    });
    post("ready");
  };
})();
