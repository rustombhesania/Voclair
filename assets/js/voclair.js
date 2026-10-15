/* Voclair bundle — vanilla JS, no dependencies. window.Voclair */
(function () {
  "use strict";
  var ICONS = {"echo": "<line x1=\"6.93\" y1=\"5.27\" x2=\"3.07\" y2=\"18.73\"/><line x1=\"12.60\" y1=\"8.15\" x2=\"10.40\" y2=\"15.85\"/><line x1=\"17.05\" y1=\"10.08\" x2=\"15.95\" y2=\"13.92\"/><path d=\"M21 4v16\"/>", "reverb": "<line x1=\"7.21\" y1=\"4.31\" x2=\"2.79\" y2=\"19.69\"/><line x1=\"10.52\" y1=\"6.71\" x2=\"7.48\" y2=\"17.29\"/><line x1=\"13.60\" y1=\"8.15\" x2=\"11.40\" y2=\"15.85\"/><line x1=\"16.76\" y1=\"9.36\" x2=\"15.24\" y2=\"14.64\"/><line x1=\"19.91\" y1=\"10.56\" x2=\"19.09\" y2=\"13.44\"/>", "noise": "<line x1=\"13.65\" y1=\"6.23\" x2=\"10.35\" y2=\"17.77\"/><line x1=\"4\" y1=\"5\" x2=\"4\" y2=\"5\"/><line x1=\"7\" y1=\"18\" x2=\"7\" y2=\"18\"/><line x1=\"4\" y1=\"12\" x2=\"4\" y2=\"12\"/><line x1=\"19.5\" y1=\"4.5\" x2=\"19.5\" y2=\"4.5\"/><line x1=\"20\" y1=\"13\" x2=\"20\" y2=\"13\"/><line x1=\"17\" y1=\"19.5\" x2=\"17\" y2=\"19.5\"/><line x1=\"8\" y1=\"8.5\" x2=\"8\" y2=\"8.5\"/><line x1=\"16.5\" y1=\"8\" x2=\"16.5\" y2=\"8\"/><line x1=\"20\" y1=\"18.5\" x2=\"20\" y2=\"18.5\"/><line x1=\"3.5\" y1=\"19.5\" x2=\"3.5\" y2=\"19.5\"/>", "play": "<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\" />", "pause": "<rect x=\"14\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\" /><rect x=\"5\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\" />", "square": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" />", "upload": "<path d=\"M12 3v12\" /><path d=\"m17 8-5-5-5 5\" /><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" />", "mic": "<path d=\"M12 19v3\" /><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\" /><rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\" />", "download": "<path d=\"M12 15V3\" /><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><path d=\"m7 10 5 5 5-5\" />", "chevron-down": "<path d=\"m6 9 6 6 6-6\" />", "menu": "<path d=\"M4 5h16\" /><path d=\"M4 12h16\" /><path d=\"M4 19h16\" />", "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />", "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />", "moon": "<path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\" />", "check": "<path d=\"M20 6 9 17l-5-5\" />", "circle-alert": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" /><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />", "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />", "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />", "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />", "arrow-up-right": "<path d=\"M7 7h10v10\" /><path d=\"M7 17 17 7\" />", "volume-2": "<path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\" /><path d=\"M16 9a5 5 0 0 1 0 6\" /><path d=\"M19.364 18.364a9 9 0 0 0 0-12.728\" />", "plug": "<path d=\"M12 22v-5\" /><path d=\"M15 8V2\" /><path d=\"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z\" /><path d=\"M9 8V2\" />", "layers": "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\" /><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\" /><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\" />", "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />", "timer": "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\" /><line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\" /><circle cx=\"12\" cy=\"14\" r=\"8\" />", "mail": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" /><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />"};
  var reduced = function () { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; };
  var css = function (el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); };
  var redrawers = [];
  function icon(name, cls) {
    return '<svg class="vc-icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[name] || "") + "</svg>";
  }
  function fitCanvas(canvas, ctx) {
    var r = canvas.getBoundingClientRect(), ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, r.width * ratio); canvas.height = Math.max(1, r.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { w: r.width, h: r.height };
  }
  function hash(n) { var s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); }

  /* ---------- Theme: follows the system; a manual choice is remembered ---------- */
  var KEY = "voclair-theme";
  function consented() { try { return localStorage.getItem("voclair-consent") === "accepted"; } catch (e) { return false; } }
  var theme = {
    get: function () { return document.documentElement.getAttribute("data-theme") || "light"; },
    set: function (mode, remember) {
      document.documentElement.setAttribute("data-theme", mode);
      if (remember && consented()) { try { localStorage.setItem(KEY, mode); } catch (e) {} }   /* only with consent (see consent.js) */
      document.querySelectorAll(".vc-theme:not(.vc-menu-btn)").forEach(function (b) {
        b.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
      });
      redrawers.forEach(function (f) { f(); });
    },
    toggle: function () { theme.set(theme.get() === "dark" ? "light" : "dark", true); },
    init: function () {
      var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
      var preset = document.documentElement.getAttribute("data-theme");   /* a host page may already have chosen */
      var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
      theme.set(saved || preset || (mq && mq.matches ? "dark" : "light"), false);
      if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
        var s = null; try { s = localStorage.getItem(KEY); } catch (x) {}
        if (!s) theme.set(e.matches ? "dark" : "light", false);
      });
    }
  };

  /* ---------- Peaks: real audio → 0..1 envelope for drawWave ---------- */
  function computePeaks(buffer, columns) {
    columns = columns || 600;
    var data = buffer.getChannelData(0), extra = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
    var per = Math.max(1, Math.floor(data.length / columns)), out = new Array(columns), max = 0;
    for (var c = 0; c < columns; c++) {
      var sum = 0, from = c * per, to = Math.min(data.length, from + per);
      for (var i = from; i < to; i += 4) { var v = extra ? (data[i] + extra[i]) / 2 : data[i]; sum += v * v; }
      var rms = Math.sqrt(sum / Math.max(1, (to - from) / 4)); out[c] = rms; if (rms > max) max = rms;
    }
    for (var k = 0; k < columns; k++) out[k] = max ? Math.min(1, out[k] / max) : 0;
    return out;
  }

  /* ---------- Waveform: haze (before) vs clean (after) ---------- */
  function drawWave(canvas, opts) {
    var ctx = canvas.getContext("2d"), size = fitCanvas(canvas, ctx), w = size.w, h = size.h;
    var state = opts.state || "after", progress = opts.progress == null ? 1 : opts.progress, seed = opts.seed || 1, peaks = opts.peaks;
    var haze = css(canvas, "--wave-haze"), clean = css(canvas, "--wave-clean"), deep = css(canvas, "--wave-clean-deep"), ink = css(canvas, "--ink");
    ctx.clearRect(0, 0, w, h);
    var mid = h / 2, step = 3;
    for (var x = 1; x < w; x += step) {
      var n = x / w, amp, color, alpha;
      if (peaks && peaks.length) {                                   /* real audio */
        amp = Math.max(0.75, peaks[Math.min(peaks.length - 1, Math.floor(n * peaks.length))] * h * 0.44);
        if (state === "before") { color = haze; alpha = 1; } else { color = (Math.round(x / step) % 3 === 0) ? deep : clean; alpha = 1; }
      } else {                                                       /* illustrative speech */
        var words = Math.max(0, Math.sin(n * 9.5 + seed) * 0.8 + Math.sin(n * 23 + seed * 2) * 0.35);
        var syll = 0.3 + 0.7 * Math.abs(Math.sin(n * 61 + seed));
        var speech = Math.min(1, words * syll * (0.75 + hash(x + seed) * 0.25));
        if (state === "before") {
          var tail = Math.max(0, Math.sin(n * 9.5 + seed - 0.35)) * 0.45;           /* reverb smear after each word */
          var floor = 0.16 + hash(x * 1.7 + seed) * 0.2;                              /* constant noise */
          amp = Math.min(1, Math.max(speech * 0.8, tail) + floor) * h * 0.44;
          color = haze; alpha = 0.55 + hash(x * 3.1) * 0.45;
        } else {
          amp = Math.max(1, speech * h * 0.44);
          color = (Math.round(x / step) % 3 === 0) ? deep : clean; alpha = 1;
        }
      }
      ctx.globalAlpha = (x / w <= progress ? 1 : 0.4) * alpha;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x, mid - amp); ctx.lineTo(x, mid + amp); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (progress > 0 && progress < 1) {
      var px = Math.round(w * progress); ctx.fillStyle = ink; ctx.fillRect(px, 0, 1.5, h);
      if (opts.handle) { ctx.beginPath(); ctx.arc(px + 0.75, mid, 6, 0, Math.PI * 2); ctx.fill(); }   /* grab handle */
    }
  }

  /* ---------- Player: one clip, Before | After at the same moment ---------- */
  var players = [];
  function mountPlayer(root) {
    if (root.__vc) return root.__vc;
    var duration = parseFloat(root.getAttribute("data-duration") || "12");
    var a = null, b = null, peaks = null;
    var btn = root.querySelector(".vc-play"), canvas = root.querySelector(".vc-player-wave canvas"), time = root.querySelector(".vc-time");
    var radios = root.querySelectorAll('.vc-ab input'), mark = root.querySelector(".vc-mark");
    var state = (root.querySelector('.vc-ab input:checked') || {}).value || "before";
    var playing = false, t0 = 0, pos = 0, raf = 0, dragging = false, wave = root.querySelector(".vc-player-wave");
    var fmt = function (s) { s = Math.max(0, s); return Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0"); };
    function real() { return !!(a && b && !a.error && !b.error); }
    function clock() { return pos + (playing ? (performance.now() - t0) / 1000 : 0); }
    function current() { return real() ? a.currentTime : clock(); }
    function total() { return (real() && isFinite(a.duration) && a.duration > 0) ? a.duration : duration; }
    function render() {
      var tt = total(), t = current() % tt, p = t / tt;
      if (time) time.textContent = fmt(t) + " / " + fmt(tt);
      if (canvas) drawWave(canvas, { state: state, progress: playing || t > 0 || dragging ? p : 1, seed: 1.3, peaks: peaks ? peaks[state] : null, handle: true });
      if (wave) { wave.setAttribute("aria-valuemax", String(Math.round(tt))); wave.setAttribute("aria-valuenow", String(Math.round(t))); wave.setAttribute("aria-valuetext", fmt(t) + " of " + fmt(tt)); }
    }
    function loop() { render(); if (playing) raf = requestAnimationFrame(loop); }
    function setMuted() { if (a) a.muted = state !== "before"; if (b) b.muted = state !== "after"; }
    function make(src) {
      var el = new Audio(); el.loop = false; el.preload = "auto"; el.src = src;   /* plays once, then stops (looping sounded like a beat) */
      el.addEventListener("loadedmetadata", render);
      return el;
    }
    var api = {
      /* point the player at a clip pair; null, null = silent demo clock */
      setSources: function (beforeSrc, afterSrc) {
        api.pause(); if (a) a.pause(); if (b) b.pause();
        a = beforeSrc ? make(beforeSrc) : null; b = afterSrc ? make(afterSrc) : null;
        if (a && b) {
          /* Only correct real drift; frequent small seeks made After stutter in some browsers. */
          a.addEventListener("timeupdate", function () { if (!b.seeking && Math.abs(a.currentTime - b.currentTime) > 0.25) b.currentTime = a.currentTime; });
          /* At the end: stop and rewind, ready to play again. */
          a.addEventListener("ended", function () { api.pause(); pos = 0; a.currentTime = 0; b.currentTime = 0; b.pause(); render(); });
        }
        pos = 0; render();
      },
      /* {before: number[], after: number[]} from Voclair.computePeaks */
      setPeaks: function (p) { peaks = p; render(); },
      play: function () {
        players.forEach(function (p) { if (p !== api) p.pause(); });  /* only one player at a time */
        playing = true; t0 = performance.now(); root.setAttribute("data-playing", ""); if (mark) mark.setAttribute("data-playing", "");
        btn.setAttribute("aria-label", "Pause"); setMuted();
        if (real()) {
          b.currentTime = a.currentTime;
          Promise.all([a.play(), b.play()]).catch(function () { pos = a ? a.currentTime : 0; a = b = null; t0 = performance.now(); });  /* missing files: fall back to the clock */
        }
        loop();
      },
      pause: function () {
        if (!playing) return; pos = current(); playing = false; cancelAnimationFrame(raf);
        root.removeAttribute("data-playing"); if (mark) mark.removeAttribute("data-playing");
        btn.setAttribute("aria-label", "Play"); if (a) a.pause(); if (b) b.pause(); render();
      },
      flip: function (to) {
        state = to; setMuted();
        if (real() && Math.abs(a.currentTime - b.currentTime) > 0.05) b.currentTime = a.currentTime;  /* same moment, voice keeps going */
        root.setAttribute("data-state", to); render();
      },
      /* jump to a moment (seconds); keeps playing if it was playing */
      seek: function (sec) {
        var tt = total(); sec = Math.max(0, Math.min(tt - 0.01, sec));
        if (real()) { a.currentTime = sec; b.currentTime = sec; }
        pos = sec; t0 = performance.now(); render();
      },
      render: render
    };
    /* Scrub: click or drag anywhere on the waveform; arrow keys step through it */
    if (wave) {
      wave.setAttribute("role", "slider"); wave.setAttribute("tabindex", "0");
      wave.setAttribute("aria-label", "Playback position"); wave.setAttribute("aria-valuemin", "0");
      var toTime = function (e) { var r = wave.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * total(); };
      wave.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        dragging = true; wave.setAttribute("data-dragging", "");
        try { wave.setPointerCapture(e.pointerId); } catch (err) {}
        api.seek(toTime(e)); e.preventDefault();
      });
      wave.addEventListener("pointermove", function (e) { if (dragging) api.seek(toTime(e)); });
      var endDrag = function () { if (!dragging) return; dragging = false; wave.removeAttribute("data-dragging"); render(); };
      wave.addEventListener("pointerup", endDrag); wave.addEventListener("pointercancel", endDrag);
      wave.addEventListener("keydown", function (e) {
        var t = current() % total(), step = e.shiftKey ? 5 : 1, to = null;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") to = t + step;
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") to = t - step;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = total();
        else if (e.key === " " || e.key === "Enter") { e.preventDefault(); playing ? api.pause() : api.play(); return; }
        if (to !== null) { e.preventDefault(); api.seek(to); }
      });
    }
    btn.addEventListener("click", function () { playing ? api.pause() : api.play(); });
    radios.forEach(function (r) { r.addEventListener("change", function () { if (r.checked) api.flip(r.value); }); });
    root.setAttribute("data-state", state);
    var bs = root.getAttribute("data-before"), as = root.getAttribute("data-after");
    if (bs && as) api.setSources(bs, as);
    players.push(api); redrawers.push(render); root.__vc = api;
    if (canvas && window.ResizeObserver) new ResizeObserver(render).observe(canvas);
    render();
    return api;
  }

  /* ---------- Wave loader: fills over ~5.1s, holds at 97% until ready ---------- */
  function mountLoader(root, opts) {
    opts = opts || {};
    var canvas = root.querySelector("canvas"), pct = root.querySelector(".vc-loader-pct"), ctx = canvas.getContext("2d");
    var FILL = opts.fillMs || 5120, HOLD = 0.97, size = fitCanvas(canvas, ctx), shown = 0, start = -1, last = -1;
    var isReady = opts.isReady || function () { return document.readyState === "complete"; };
    function draw(progress, phase) {
      var w = size.w, h = size.h, c = h / 2, amp = h * 0.32, fill = w * progress;
      var y = function (x) { return c + Math.sin(x * 0.055 + phase) * amp * Math.sin((x / w) * Math.PI); };
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = css(canvas, "--line"); ctx.lineWidth = 1.5; ctx.beginPath();
      for (var x = 0; x <= w; x += 2) x === 0 ? ctx.moveTo(x, y(x)) : ctx.lineTo(x, y(x));
      ctx.stroke();
      if (fill > 0) {
        var bright = css(canvas, "--wave-clean");
        ctx.strokeStyle = bright; ctx.lineWidth = 2; ctx.beginPath();
        for (var x2 = 0; x2 <= fill; x2 += 2) x2 === 0 ? ctx.moveTo(x2, y(x2)) : ctx.lineTo(x2, y(x2));
        ctx.stroke(); ctx.fillStyle = bright; ctx.beginPath(); ctx.arc(fill, y(fill), 2.5, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (reduced()) { draw(1, 0); if (pct) pct.textContent = "100%"; if (opts.onDone) opts.onDone(); return; }
    function tick(t) {
      if (start < 0) start = t;
      var target = Math.min(1, (t - start) / FILL), ready = isReady(), cap = ready ? 1 : HOLD;
      shown = Math.min(cap, Math.max(shown, Math.min(target, cap)));
      if (ready && target >= 1) shown = 1;
      draw(shown, t * 0.002);
      var whole = Math.floor(shown * 100); if (pct && whole !== last) { last = whole; pct.textContent = whole + "%"; }
      if (shown >= 1 && opts.onDone) { opts.onDone(); return; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Preloader background: the noisy waveform ---------- */
  function mountPreloaderWave(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext("2d"), size = fitCanvas(canvas, ctx);
    if (window.ResizeObserver) new ResizeObserver(function () { size = fitCanvas(canvas, ctx); }).observe(canvas);
    function draw(time) {
      var w = size.w, h = size.h; ctx.clearRect(0, 0, w, h);
      var t = reduced() || opts.still ? 1 : time * 0.0011, center = h / 2, spacing = w < 600 ? 2.6 : 3;
      var bright = css(canvas, "--wave-clean"), dark = css(canvas, "--wave-clean-deep");
      var vp = opts.print || window.VOCLAIR_VOICE_PRINT;
      if (vp && vp.u && vp.u.length) {                                /* the Voclair voice print, traced from the brand PNG */
        var N = vp.u.length, pad = w * 0.04, span = w - pad * 2;
        for (var px = pad; px < w - pad; px += spacing) {
          var f = (px - pad) / span * (N - 1), i0 = Math.floor(f), i1 = Math.min(N - 1, i0 + 1), k = f - i0;
          var up = vp.u[i0] * (1 - k) + vp.u[i1] * k, dn = vp.d[i0] * (1 - k) + vp.d[i1] * k;
          var shim = Math.abs(Math.sin(px * 12.9898 + Math.sin(t + px * 0.03) * 4.2));
          var breathe = 0.72 + 0.28 * Math.sin((px / w) * 18 - t * 2.4);          /* ripple travelling along the wave */
          var pulse = 0.8 + 0.2 * Math.abs(Math.sin(t * 2.2));                   /* whole wave swells like syllables */
          var s = h * 0.45 * breathe * pulse;
          ctx.globalAlpha = 0.45 + shim * 0.5; ctx.strokeStyle = px % 9 < 3 ? dark : bright; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(px, center - Math.max(0.5, up * s)); ctx.lineTo(px, center + Math.max(0.5, dn * s)); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (!reduced() && !opts.still && canvas.isConnected) requestAnimationFrame(draw);
        return;
      }
      for (var x = 0; x < w; x += spacing) {
        var n = x / w, env = Math.pow(Math.sin(n * Math.PI), 2.2), lobes = 0.26 + 0.74 * Math.abs(Math.sin(n * 13.4 + t * 0.6));
        var noise = Math.abs(Math.sin(x * 12.9898 + Math.sin(t + x * 0.03) * 4.2)), ripple = Math.sin(n * 32 - t * 1.6) * 0.16 + 0.84;
        var amp = h * 0.43 * env * lobes * (0.22 + noise * 0.78) * ripple + 0.5;
        ctx.globalAlpha = 0.3 + noise * 0.55; ctx.strokeStyle = x % 9 < 3 ? dark : bright; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, center - amp); ctx.lineTo(x, center + amp); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (!reduced() && !opts.still && canvas.isConnected) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- Top bar: scrolled shadow, mobile menu, current section ---------- */
  function mountTopbar(root) {
    var menuBtn = root.querySelector(".vc-menu-btn"), menu = root.querySelector(".vc-menu");

    /* Smart sticky: hide on scroll down, reveal on scroll up. Opt out with data-autohide="off". */
    var autohide = root.getAttribute("data-autohide") !== "off";
    var lastY = window.scrollY, travel = 0, ticking = false, TOLERANCE = 8;
    function show() { root.removeAttribute("data-hidden"); }
    function mustStay() {
      return (menu && !menu.hidden) ||                                   /* mobile menu open */
             root.contains(document.activeElement) ||                    /* keyboard focus is in the bar */
             document.documentElement.classList.contains("is-loading");  /* preloader still up */
    }
    function update() {
      ticking = false;
      var y = Math.max(0, window.scrollY), dy = y - lastY;
      lastY = y;
      y > 4 ? root.setAttribute("data-scrolled", "") : root.removeAttribute("data-scrolled");
      if (!autohide) return;
      if (y <= root.offsetHeight * 2 || mustStay()) { travel = 0; show(); return; }  /* near the top: always visible */
      if ((dy > 0) !== (travel > 0)) travel = 0;                          /* direction changed: start counting again */
      travel += dy;
      if (travel > TOLERANCE) root.setAttribute("data-hidden", "");
      else if (travel < -TOLERANCE) show();
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    /* Focus must never sit under the bar: if Tab lands on something it covers, the bar steps aside. */
    document.addEventListener("focusin", function (e) {
      if (!autohide || root.contains(e.target) || (menu && !menu.hidden) || window.scrollY <= root.offsetHeight * 2) return;
      var r = e.target.getBoundingClientRect();
      if (r.top < root.getBoundingClientRect().bottom && r.bottom > 0) { root.setAttribute("data-hidden", ""); travel = 0; }
    });
    update();
    if (menuBtn && menu) {
      var close = function () { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); menuBtn.innerHTML = icon("menu"); menuBtn.setAttribute("aria-label", "Open menu"); };
      menuBtn.addEventListener("click", function () {
        var open = menu.hidden; menu.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.innerHTML = icon(open ? "x" : "menu"); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        if (open) { var f = menu.querySelector("a"); if (f) f.focus(); }
      });
      menu.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { close(); menuBtn.focus(); } });
    }
    var links = root.querySelectorAll('.vc-nav a[href^="#"]');
    if (window.IntersectionObserver && links.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) { l.getAttribute("href") === "#" + en.target.id ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current"); });
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      links.forEach(function (l) { var s = document.querySelector(l.getAttribute("href")); if (s) io.observe(s); });
    }
    root.querySelectorAll(".vc-theme:not(.vc-menu-btn)").forEach(function (b) { b.addEventListener("click", theme.toggle); });   /* the menu button shares the look, not the job */
  }

  /* ---------- Auto-init: [data-vc] hooks and [data-icon] placeholders ---------- */
  function init(scope) {
    scope = scope || document;
    scope.querySelectorAll("[data-icon]").forEach(function (el) { el.outerHTML = icon(el.getAttribute("data-icon"), el.getAttribute("class")); });
    scope.querySelectorAll('[data-vc="player"]').forEach(mountPlayer);
    scope.querySelectorAll('[data-vc="topbar"]').forEach(mountTopbar);
    scope.querySelectorAll('[data-vc="wave"]').forEach(function (c) {
      var f = function () { drawWave(c, { state: c.getAttribute("data-state") || "after", seed: parseFloat(c.getAttribute("data-seed") || "1") }); };
      redrawers.push(f); f(); if (window.ResizeObserver) new ResizeObserver(f).observe(c);
    });
    scope.querySelectorAll('[data-vc="loader"]').forEach(function (el) { mountLoader(el); });
    scope.querySelectorAll('[data-vc="theme"]').forEach(function (b) { if (!b.closest('[data-vc="topbar"]')) b.addEventListener("click", theme.toggle); });
    if (window.MutationObserver && !init.watching) {
      init.watching = true;
      new MutationObserver(function () { redrawers.forEach(function (f) { f(); }); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
  }

  window.Voclair = { icons: ICONS, icon: icon, theme: theme, drawWave: drawWave, computePeaks: computePeaks, mountPlayer: mountPlayer, mountLoader: mountLoader, mountPreloaderWave: mountPreloaderWave, mountTopbar: mountTopbar, init: init };
})();
