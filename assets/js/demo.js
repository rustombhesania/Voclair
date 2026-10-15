/* Voclair demo: upload, record or use the sample; clean; compare Before | After.
   Loaded only when the visitor scrolls near #demo (see site.js). */
(function () {
  "use strict";
  var C = window.VOCLAIR_CONFIG || {};
  var V = window.Voclair;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var MAX_BYTES = 5 * 1024 * 1024, MAX_SECONDS = 180, REC_SECONDS = 10;
  var FORMATS = "MP3, WAV, M4A, OGG or FLAC";

  var app = $("#demo-app"), fileInput = $("#demo-file"), drop = $("#demo-drop");
  var recBtn = $("#demo-record"), sampleBtn = $("#demo-sample");
  var recPanel = $("#demo-recording"), countEl = $("#demo-count"), levelEl = $("#demo-level");
  var recLabel = $("#demo-record .demo-action-label"), doneEl = $("#demo-done");
  var cards = [drop, recBtn, sampleBtn].filter(Boolean), activeCard = null;
  var progress = $("#demo-progress"), stageText = $("#demo-stage-text"), typical = $("#demo-typical");
  var errBox = $("#demo-error"), errText = $("#demo-error-text");
  var results = $("#demo-results"), stub = $("#demo-stub"), download = $("#demo-download");
  var details = $("#demo-details"), transcript = $("#demo-transcript"), tBody = $("#transcript-body"), tStatus = $("#transcript-status");
  if (!fileInput) return;   /* upload is "coming soon": nothing to wire up yet */
  var player = V.mountPlayer($("#demo-player"));
  var current = null, ctx = null, urls = [];

  function audioCtx() { var AC = window.AudioContext || window.webkitAudioContext; return ctx || (ctx = new AC()); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function stage(name) { app.setAttribute("data-stage", name); }

  /* The card that started the work shows its own progress; the others step back. */
  function activate(card) {
    cards.forEach(function (c) { c.removeAttribute("data-active"); });
    activeCard = card; card.setAttribute("data-active", "");
    hideDone(); $(".demo-opt-live", card).appendChild(progress);
  }
  function release() {
    cards.forEach(function (c) { c.removeAttribute("data-active"); });
    activeCard = null; progress.hidden = true; app.appendChild(progress);
  }
  function hideDone() { clearTimeout(hideDone.t); doneEl.hidden = true; app.appendChild(doneEl); }
  function flashDone(card) {
    release(); $(".demo-opt-live", card).appendChild(doneEl); doneEl.hidden = false;
    hideDone.t = setTimeout(hideDone, 5000);
  }

  /* =====================================================================
     VOCLAIR CLEANING HOOK
     cleanAudio(blob, decodedAudioBuffer) resolves to { blob: <cleaned audio Blob>, stub: false }.
     Order: cleanEndpoint (server) if set, else window.VoclairEngine (in the browser), else preview stub.
     ===================================================================== */
  function cleanAudio(blob, decoded) {
    /* 1. A server endpoint, if one is configured (sends the audio off the device). */
    if (C.cleanEndpoint) {
      return fetch(C.cleanEndpoint, { method: "POST", headers: { "Content-Type": blob.type || "application/octet-stream" }, body: blob })
        .then(function (r) { if (!r.ok) throw new Error("clean-failed"); return r.blob(); })
        .then(function (b) { return { blob: b, stub: false }; });
    }
    /* 2. Default: the in-browser engine (assets/js/engine/), nothing is uploaded. */
    var E = window.VoclairEngine;
    if (decoded && E && E.supported()) {
      return E.clean(decoded, {
        rt60: C.rt60 || 0.8,
        onProgress: function (p) { stageText.textContent = "Cleaning on your device… " + Math.round(p * 100) + "%"; }
      }).then(function (b) { return { blob: b, stub: false }; });
    }
    /* 3. Fallback preview: plays the original and shows the "Preview build" notice. */
    return wait(1200).then(function () { return { blob: blob, stub: true }; });
  }
  function transcribe(blob) {
    if (!C.transcribeEndpoint) return Promise.resolve(null);
    return fetch(C.transcribeEndpoint, { method: "POST", headers: { "Content-Type": blob.type || "application/octet-stream" }, body: blob })
      .then(function (r) { if (!r.ok) throw new Error("transcribe-failed"); return r.json(); })
      .then(function (j) { return j.text || ""; });
  }
  function summarise(text) {
    if (!C.summariseEndpoint) return Promise.resolve(null);
    return fetch(C.summariseEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: text }) })
      .then(function (r) { if (!r.ok) throw new Error("summarise-failed"); return r.json(); })
      .then(function (j) { return j.summary || ""; });
  }

  /* ---------- Messages ---------- */
  function showError(msg) {
    errText.textContent = msg; errBox.hidden = false;
    progress.hidden = true; if (recBtn) { recPanel.hidden = true; stopMeter(); recLabel.textContent = "Start recording"; recBtn.removeAttribute("aria-label"); } stage(current ? "done" : "idle");
    if (current) results.hidden = false;
    release();
  }
  function clearError() { errBox.hidden = true; }
  function setStage(text) {
    stageText.textContent = text; progress.hidden = false;
    if (C.typicalSeconds) { typical.textContent = "Usually takes about " + C.typicalSeconds + " seconds."; typical.hidden = false; }
  }

  /* ---------- Checks ---------- */
  function looksLikeAudio(file) {
    if (file.type && /^audio\//.test(file.type)) return true;
    if (file.type === "video/webm" || file.type === "video/mp4") return true;   /* browser recordings */
    return /\.(mp3|wav|m4a|aac|ogg|oga|opus|flac|webm)$/i.test(file.name || "");
  }
  function hasSpeech(buf) {
    var d = buf.getChannelData(0), frame = Math.floor(buf.sampleRate * 0.03), loud = 0, frames = 0;
    for (var i = 0; i + frame < d.length; i += frame) {
      var s = 0; for (var j = i; j < i + frame; j += 2) s += d[j] * d[j];
      var db = 10 * Math.log10(s / (frame / 2) + 1e-12);
      frames++; if (db > -45) loud++;
    }
    return frames > 0 && loud / frames > 0.05;
  }

  /* ---------- Main flow ---------- */
  function run(file, card) {
    card = card || drop;
    clearError();
    if (!looksLikeAudio(file)) return showError("That file type is not supported. Try " + FORMATS + ".");
    if (file.size > MAX_BYTES) return showError("That file is over 5 MB. Try a shorter clip.");
    activate(card); stage("working"); results.hidden = true; player.pause();
    setStage("Reading the recording…");
    var before, cleaned;
    file.arrayBuffer().then(function (ab) {
      return audioCtx().decodeAudioData(ab).catch(function () { throw { user: "That file type is not supported. Try " + FORMATS + "." }; });
    }).then(function (buf) {
      if (buf.duration > MAX_SECONDS) throw { user: "That recording is longer than 3 minutes. Try a shorter clip." };
      if (!hasSpeech(buf)) throw { user: "No speech was found in this recording." };
      before = buf;
      setStage("Cleaning on your device…");
      return cleanAudio(file, buf);
    }).then(function (res) {
      cleaned = res;
      return res.blob === file ? before : res.blob.arrayBuffer().then(function (ab) { return audioCtx().decodeAudioData(ab); });
    }).then(function (after) {
      urls.forEach(function (u) { URL.revokeObjectURL(u); });
      var uBefore = URL.createObjectURL(file), uAfter = URL.createObjectURL(cleaned.blob);
      urls = [uBefore, uAfter];
      current = { file: file, before: before, after: after, clean: cleaned.blob, spectro: false, transcript: false };
      $("#demo-player").setAttribute("data-duration", String(Math.round(before.duration)));
      player.setSources(uBefore, uAfter);
      player.setPeaks({ before: V.computePeaks(before, 800), after: V.computePeaks(after, 800) });
      stub.hidden = !cleaned.stub;
      var ext = (cleaned.blob.type.split("/")[1] || "wav").replace("mpeg", "mp3").replace("x-wav", "wav").split(";")[0];
      download.href = uAfter; download.setAttribute("download", "voclair-clean." + ext);
      details.open = false; transcript.open = false; resetTranscript();
      results.hidden = false; stage("done"); flashDone(card);
      results.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      $(".vc-play", results).focus({ preventScroll: true });
    }).catch(function (e) {
      showError(e && e.user ? e.user : "The recording could not be cleaned. Try again, or try another file.");
    });
  }

  /* ---------- Upload ---------- */
  fileInput.addEventListener("change", function () { if (fileInput.files[0]) run(fileInput.files[0]); fileInput.value = ""; });
  var depth = 0;
  drop.addEventListener("dragenter", function (e) { e.preventDefault(); depth++; drop.setAttribute("data-drag", ""); });
  drop.addEventListener("dragover", function (e) { e.preventDefault(); });
  drop.addEventListener("dragleave", function () { if (--depth <= 0) { depth = 0; drop.removeAttribute("data-drag"); } });
  drop.addEventListener("drop", function (e) { e.preventDefault(); depth = 0; drop.removeAttribute("data-drag"); var f = e.dataTransfer.files[0]; if (f) run(f, drop); });
  /* A file dropped next to the zone should not open in the browser tab. */
  app.addEventListener("dragover", function (e) { e.preventDefault(); });
  app.addEventListener("drop", function (e) { e.preventDefault(); if (!drop.contains(e.target) && e.dataTransfer.files[0]) run(e.dataTransfer.files[0], drop); });

  /* ---------- Record 10 seconds (asks for the microphone only on click) ---------- */
  var rec = null, timer = 0;
  var meter = 0;
  function stopMeter() { cancelAnimationFrame(meter); if (levelEl) levelEl.style.setProperty("--lvl", 0); }
  function startMeter(stream) {
    try {
      var shown = 0, an = audioCtx().createAnalyser(), src = audioCtx().createMediaStreamSource(stream), buf = new Float32Array(1024);
      an.fftSize = 1024; src.connect(an);
      (function tick() {
        an.getFloatTimeDomainData(buf); var sum = 0; for (var i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        var db = 10 * Math.log10(sum / buf.length + 1e-12);                 /* about -60 dB (quiet) to 0 dB */
        var lvl = Math.max(0, Math.min(1, (db + 60) / 60));
        shown = Math.max(lvl, shown * 0.92);                                /* fast rise, gentle fall */
        levelEl.style.setProperty("--lvl", shown.toFixed(3));
        meter = requestAnimationFrame(tick);
      })();
    } catch (e) {}
  }
  if (recBtn) recBtn.addEventListener("click", function () {
    if (rec && rec.state === "recording") { rec.stop(); return; }           /* second click stops early */
    clearError();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      return showError("This browser cannot record here. Upload a file or use the sample instead.");
    }
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (stream) {
      var chunks = [], left = REC_SECONDS;
      rec = new MediaRecorder(stream);
      rec.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        clearInterval(timer); stream.getTracks().forEach(function (t) { t.stop(); });
        stopMeter(); recPanel.hidden = true; recLabel.textContent = "Start recording"; recBtn.removeAttribute("aria-label");
        var type = rec.mimeType || "audio/webm";
        run(new File([new Blob(chunks, { type: type })], "recording." + (type.indexOf("mp4") > -1 ? "m4a" : "webm"), { type: type }), recBtn);
      };
      activate(recBtn); stage("recording"); recPanel.hidden = false; results.hidden = true; player.pause();
      recLabel.textContent = "Stop recording"; recBtn.setAttribute("aria-label", "Stop recording");
      if (audioCtx().state === "suspended") audioCtx().resume();
      startMeter(stream);
      countEl.textContent = "0:10"; rec.start();
      timer = setInterval(function () {
        left -= 1; countEl.textContent = "0:" + String(Math.max(0, left)).padStart(2, "0");
        if (left <= 0 && rec.state === "recording") rec.stop();
      }, 1000);
    }).catch(function () {
      showError("Microphone access was not granted. Upload a file or use the sample instead.");
    });
  });

  /* ---------- Use a sample ---------- */
  if (sampleBtn) sampleBtn.addEventListener("click", function () {
    clearError(); activate(sampleBtn); stage("working"); setStage("Reading the recording…");
    fetch(C.sample).then(function (r) {
      if (!r.ok) throw new Error("missing");
      return r.blob();
    }).then(function (b) {
      run(new File([b], "voclair-sample." + (b.type.indexOf("wav") > -1 ? "wav" : "mp3"), { type: b.type || "audio/mpeg" }), sampleBtn);
    }).catch(function () { showError("The sample is not available yet. Upload a file instead."); });
  });

  /* ---------- Show details: spectrograms, drawn on first open ---------- */
  details.addEventListener("toggle", function () { if (details.open && current) drawSpectros(); });
  new MutationObserver(function () { if (details.open && current) drawSpectros(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function rgb(canvas, cssVar) {
    var probe = document.createElement("canvas").getContext("2d");
    probe.fillStyle = getComputedStyle(canvas).getPropertyValue(cssVar).trim(); probe.fillRect(0, 0, 1, 1);
    return probe.getImageData(0, 0, 1, 1).data;
  }
  function fft(re, im) {
    var n = re.length, i, j = 0, k, len, ang, wr, wi, ur, ui, tr, ti;
    for (i = 1; i < n; i++) { var bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { tr = re[i]; re[i] = re[j]; re[j] = tr; tr = im[i]; im[i] = im[j]; im[j] = tr; } }
    for (len = 2; len <= n; len <<= 1) {
      ang = -2 * Math.PI / len; wr = Math.cos(ang); wi = Math.sin(ang);
      for (i = 0; i < n; i += len) {
        ur = 1; ui = 0;
        for (k = 0; k < len / 2; k++) {
          var a = i + k, b = a + len / 2;
          tr = re[b] * ur - im[b] * ui; ti = re[b] * ui + im[b] * ur;
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
          var nur = ur * wr - ui * wi; ui = ur * wi + ui * wr; ur = nur;
        }
      }
    }
  }
  function spectro(canvas, buf) {
    var r = canvas.getBoundingClientRect(), W = Math.max(1, Math.floor(r.width)), H = Math.max(1, Math.floor(r.height));
    canvas.width = W; canvas.height = H;
    var g = canvas.getContext("2d"), img = g.createImageData(W, H), N = 1024, half = N / 2;
    var d = buf.getChannelData(0), win = new Float32Array(N);
    for (var i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1));
    var bg = rgb(canvas, "--surface-sunken"), fg = rgb(canvas, "--ink");
    var maxBin = Math.min(half, Math.floor(8000 / (buf.sampleRate / N)));          /* speech lives below 8 kHz */
    var cols = [], peak = -Infinity;
    for (var x = 0; x < W; x++) {
      var start = Math.floor((d.length - N) * x / Math.max(1, W - 1)), re = new Float32Array(N), im = new Float32Array(N);
      for (var t = 0; t < N; t++) re[t] = (d[start + t] || 0) * win[t];
      fft(re, im);
      var col = new Float32Array(H);
      for (var y = 0; y < H; y++) {
        var bin = Math.min(maxBin - 1, Math.floor(Math.pow(1 - y / H, 2) * maxBin));   /* more room for low pitches */
        var db = 20 * Math.log10(Math.hypot(re[bin], im[bin]) + 1e-9);
        col[y] = db; if (db > peak) peak = db;
      }
      cols.push(col);
    }
    for (var cx = 0; cx < W; cx++) for (var cy = 0; cy < H; cy++) {
      var v = Math.max(0, Math.min(1, (cols[cx][cy] - (peak - 70)) / 70)), o = (cy * W + cx) * 4;
      v = v * v;
      img.data[o] = bg[0] + (fg[0] - bg[0]) * v; img.data[o + 1] = bg[1] + (fg[1] - bg[1]) * v; img.data[o + 2] = bg[2] + (fg[2] - bg[2]) * v; img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }
  function drawSpectros() {
    requestAnimationFrame(function () { spectro($("#spectro-before"), current.before); spectro($("#spectro-after"), current.after); });
  }

  /* ---------- Transcript preview: runs only when opened ---------- */
  function resetTranscript() {
    tBody.innerHTML = '<p class="vc-status" data-live id="transcript-status" hidden>Transcribing both versions…</p>';
    tStatus = $("#transcript-status");
  }
  transcript.addEventListener("toggle", function () {
    if (!transcript.open || !current || current.transcript) return;
    current.transcript = true;
    if (!C.transcribeEndpoint) {
      tBody.innerHTML = '<p class="vc-note">' + V.icon("info") + '<span>The transcript preview is not connected in this build.</span></p>';
      return;
    }
    tStatus.hidden = false; tStatus.textContent = "Transcribing both versions…";
    Promise.all([transcribe(current.file), transcribe(current.clean)]).then(function (t) {
      tStatus.textContent = "Summarising…";
      return summarise(t[1]).then(function (s) { renderTranscript(t[0], t[1], s); });
    }).catch(function () {
      current.transcript = false;
      tStatus.hidden = true;
      tBody.insertAdjacentHTML("beforeend", '<p class="vc-error">' + V.icon("circle-alert") + '<span>The transcripts could not be made. Close and reopen this panel to try again.</span></p>');
    });
  });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function diff(a, b) {                       /* word-level differences, original → clean */
    a = a.split(/\s+/).filter(Boolean).slice(0, 1500); b = b.split(/\s+/).filter(Boolean).slice(0, 1500);
    var m = a.length, n = b.length, L = [];
    for (var i = 0; i <= m; i++) { L[i] = new Uint16Array(n + 1); }
    for (i = m - 1; i >= 0; i--) for (var j = n - 1; j >= 0; j--) L[i][j] = a[i].toLowerCase() === b[j].toLowerCase() ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var out = [], x = 0, y = 0;
    while (x < m && y < n) {
      if (a[x].toLowerCase() === b[y].toLowerCase()) { out.push(esc(b[y])); x++; y++; }
      else if (L[x + 1][y] >= L[x][y + 1]) { out.push("<del>" + esc(a[x]) + "</del>"); x++; }
      else { out.push("<ins>" + esc(b[y]) + "</ins>"); y++; }
    }
    while (x < m) out.push("<del>" + esc(a[x++]) + "</del>");
    while (y < n) out.push("<ins>" + esc(b[y++]) + "</ins>");
    return out.join(" ");
  }
  function renderTranscript(orig, clean, summary) {
    tBody.innerHTML =
      '<div class="transcript-cols">' +
        '<div><h4>From the original</h4><p>' + esc(orig || "No words were recognised.") + '</p></div>' +
        '<div><h4>From the clean version</h4><p>' + esc(clean || "No words were recognised.") + '</p></div>' +
      '</div>' +
      '<div><h4>How they differ</h4><p>' + diff(orig || "", clean || "") + '</p><p class="vc-caption">Struck through: only in the original. Highlighted: only in the clean version.</p></div>' +
      (summary ? '<div><h4>Summary of the clean version</h4><p>' + esc(summary) + '</p></div>' : "");
  }
})();
