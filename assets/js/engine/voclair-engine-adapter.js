/* Voclair engine adapter: the ONE thing the front end talks to for cleaning.
   Classic script, sets window.VoclairEngine. Front-end code never imports the engine directly.

   API
     VoclairEngine.supported()                      -> true if this browser can run it
     VoclairEngine.clean(audioBuffer, options)      -> Promise<Blob> (16-bit mono WAV)
       audioBuffer : a decoded Web Audio AudioBuffer (from decodeAudioData)
       options     : { rt60: 0.8, dereverb: true, denoise: true, onProgress: function (0..1) {} }

   Everything runs in a Web Worker on the visitor's device. No network request carries audio.
   To swap the algorithm later (new DSP, WebAssembly, or a server), change only this folder. */
(function () {
  "use strict";
  var base = document.currentScript ? document.currentScript.src : document.baseURI;
  var ENGINE = new URL("voclair-engine.js", base).href;
  var WORKER = new URL("voclair-engine.worker.js", base).href;
  var worker = null, jobId = 0, encoder = null;

  function supported() { return !!(window.Worker && window.Blob && window.URL && window.Promise); }

  function toMono(buf) {
    var n = buf.length, ch = buf.numberOfChannels, mono = new Float32Array(n);
    for (var c = 0; c < ch; c++) { var d = buf.getChannelData(c); for (var i = 0; i < n; i++) mono[i] += d[i] / ch; }
    return mono;
  }

  function clean(buf, options) {
    options = options || {};
    var onProgress = options.onProgress, opts = {};
    for (var k in options) if (k !== "onProgress") opts[k] = options[k];
    var mono = toMono(buf), rate = buf.sampleRate, id = ++jobId;
    if (!worker) worker = new Worker(WORKER, { type: "module" });
    var cleaned = new Promise(function (resolve, reject) {
      worker.onmessage = function (e) {
        var m = e.data; if (m.id !== id) return;
        if (m.progress !== undefined) { if (onProgress) onProgress(m.progress); return; }
        if (m.error) reject(new Error(m.error)); else resolve(m.cleaned);
      };
      worker.onerror = function (e) { worker.terminate(); worker = null; reject(e.error || new Error("worker-failed")); };
      worker.postMessage({ id: id, samples: mono, sampleRate: rate, options: opts }, [mono.buffer]);
    });
    encoder = encoder || import(ENGINE);
    return Promise.all([cleaned, encoder]).then(function (r) { return r[1].encodeWav(r[0], rate); });
  }

  window.VoclairEngine = { supported: supported, clean: clean };
})();
