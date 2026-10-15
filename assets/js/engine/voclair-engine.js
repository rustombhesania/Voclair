// file: voclair-engine.js (named so it does not clash with the UI bundle assets/js/voclair.js)
// Voclair browser engine: denoising + dereverberation, entirely on the visitor's device.
// No server, no upload, no dependencies. Works in every modern browser and in Node 18+.
//
// Chain (classical signal processing, ported from voclair_offline.py, 15 October 2026):
//   1. late-reverberation spectral subtraction (Lebart 2001, Habets 2007)   -> removes the reverb tail
//   2. OM-LSA noise suppression with speech-presence noise tracking (Cohen 2003; Gerkmann and Hendriks 2012)
//      -> removes background noise, keeps adapting through the clip (log-MMSE, Ephraim and Malah 1985, via denoiser: "logmmse")
//   3. 80 Hz high-pass (zero phase) and level normalisation                   -> removes rumble, evens loudness
//
// Usage:
//   import { voclairClean } from "./voclair.js";
//   const cleaned = voclairClean(float32Samples, sampleRate, { rt60: 0.8 });   // Float32Array, same length
//
// Options (all optional):
//   rt60          reverberation time of the room in seconds (default 0.8, safe for unknown rooms)
//   dereverb      true/false (default true)
//   denoise       true/false (default true)
//   denoiser      "omlsa" (default) or "logmmse"
//   highpassHz    default 80, 0 switches it off
//   targetRmsDb   output level in dB relative to full scale (default -23)
//   onProgress    function(fraction 0..1), called between stages

// ------------------------------------------------------------------ FFT (radix-2, in place)
function makeFFT(n) {
  const levels = Math.log2(n);
  if (!Number.isInteger(levels)) throw new Error("FFT size must be a power of two");
  const cos = new Float64Array(n / 2), sin = new Float64Array(n / 2);
  for (let i = 0; i < n / 2; i++) { cos[i] = Math.cos(2 * Math.PI * i / n); sin[i] = Math.sin(2 * Math.PI * i / n); }
  const rev = new Uint32Array(n);
  for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < levels; b++) r |= ((i >> b) & 1) << (levels - 1 - b); rev[i] = r; }
  // inverse = false: forward transform; inverse = true: unscaled inverse (caller divides by n)
  return function fft(re, im, inverse) {
    for (let i = 0; i < n; i++) { const j = rev[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    const sgn = inverse ? 1 : -1;
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1, step = n / size;
      for (let start = 0; start < n; start += size) {
        for (let k = 0; k < half; k++) {
          const c = cos[k * step], s = sgn * sin[k * step];
          const a = start + k, b = a + half;
          const tr = re[b] * c - im[b] * s, ti = re[b] * s + im[b] * c;
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        }
      }
    }
  };
}

const nextPow2 = (x) => 1 << Math.ceil(Math.log2(x));

function hann(n) { // periodic Hann
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / n);
  return w;
}

// ------------------------------------------------------------------ exponential integral E1(x), x > 0
function expint1(x) {
  if (x <= 0) return 50;
  if (x < 1) { // power series
    let sum = 0, term = 1;
    for (let k = 1; k < 30; k++) { term *= -x / k; sum += term / k; }
    return -0.5772156649015329 - Math.log(x) - sum;
  }
  // continued fraction (Lentz), converges fast for x >= 1
  let b = x + 1, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 100; i++) {
    const a = -i * i; b += 2; d = 1 / (a * d + b); c = b + a / c; const del = c * d; h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return h * Math.exp(-x);
}

// ------------------------------------------------------------------ 1. late-reverberation spectral subtraction
export function lateReverbSubtraction(x, sr, { rt60 = 0.8, lateStart = 0.05, overSubtraction = 1.0,
                                                 floorDb = -12, smoothing = 0.6 } = {}) {
  const size = nextPow2(0.032 * sr), hop = size / 4, bins = size / 2 + 1;
  const fft = makeFFT(size), win = hann(size).map(Math.sqrt);
  const padded = new Float64Array(x.length + 2 * size + hop);
  padded.set(x, size);
  const frames = Math.floor((padded.length - size) / hop) + 1;
  const delay = Math.max(1, Math.round(lateStart * sr / hop));
  const attenuation = Math.exp(-2 * (3 * Math.log(10) / rt60) * delay * hop / sr);
  const floor = Math.pow(10, floorDb / 10);
  const history = Array.from({ length: delay }, () => new Float64Array(bins)); // smoothed power, ring buffer
  const smoothed = new Float64Array(bins), prevGain = new Float64Array(bins).fill(1);
  const out = new Float64Array(padded.length);
  const re = new Float64Array(size), im = new Float64Array(size);
  const norm = (hop * 2 / size) / size;
  for (let f = 0; f < frames; f++) {
    const o = f * hop;
    for (let i = 0; i < size; i++) { re[i] = padded[o + i] * win[i]; im[i] = 0; }
    fft(re, im, false);
    const old = history[f % delay];
    for (let k = 0; k < bins; k++) {
      const p = re[k] * re[k] + im[k] * im[k];
      const late = f >= delay ? attenuation * old[k] : 0;
      let g = Math.sqrt(Math.min(1, Math.max(floor, 1 - overSubtraction * late / (p + 1e-12))));
      const gs = f === 0 ? g : 0.5 * g + 0.5 * prevGain[k];
      prevGain[k] = g;
      smoothed[k] = smoothing * smoothed[k] + (1 - smoothing) * p;
      re[k] *= gs; im[k] *= gs;
      if (k > 0 && k < size / 2) { re[size - k] = re[k]; im[size - k] = -im[k]; }
    }
    old.set(smoothed); // becomes the "delay frames ago" value
    fft(re, im, true);
    for (let i = 0; i < size; i++) out[o + i] += re[i] * norm * win[i];
  }
  return out.subarray(size, size + x.length);
}

// ------------------------------------------------------------------ 2. log-MMSE noise suppression
export function logMmse(x, sr, { noiseFrames = 6, eta = 0.15 } = {}) {
  let slen = Math.floor(0.02 * sr); if (slen % 2) slen++;
  const len1 = slen / 2, len2 = slen - len1, nfft = nextPow2(2 * slen), fft = makeFFT(nfft);
  const w = hann(slen + 1).subarray(0, slen); // numpy hanning(slen) differs only marginally
  let wsum = 0; for (const v of w) wsum += v;
  const win = w.map((v) => v * len2 / wsum);
  const nFrames = Math.floor(x.length / len2) - Math.floor(slen / len2);
  const out = new Float64Array(x.length);
  const re = new Float64Array(nfft), im = new Float64Array(nfft);
  const noise = new Float64Array(nfft), xkPrev = new Float64Array(nfft);
  for (let j = 0; j < noiseFrames; j++) {
    re.fill(0); im.fill(0);
    for (let i = 0; i < slen && j * slen + i < x.length; i++) re[i] = win[i] * x[j * slen + i];
    fft(re, im, false);
    for (let k = 0; k < nfft; k++) noise[k] += Math.hypot(re[k], im[k]);
  }
  for (let k = 0; k < nfft; k++) noise[k] = Math.max((noise[k] / noiseFrames) ** 2, 1e-20);
  const aa = 0.98, mu = 0.98, ksiMin = Math.pow(10, -2.5);
  let xOld = new Float64Array(len1), first = true;
  const gammak = new Float64Array(nfft), ksi = new Float64Array(nfft), sig2 = new Float64Array(nfft);
  for (let f = 0; f < nFrames; f++) {
    const k0 = f * len2;
    re.fill(0); im.fill(0);
    for (let i = 0; i < slen; i++) re[i] = win[i] * x[k0 + i];
    fft(re, im, false);
    let vad = 0;
    for (let k = 0; k < nfft; k++) {
      sig2[k] = re[k] * re[k] + im[k] * im[k];
      gammak[k] = Math.min(sig2[k] / noise[k], 40);
      ksi[k] = first ? aa + (1 - aa) * Math.max(gammak[k] - 1, 0)
                     : Math.max(ksiMin, aa * xkPrev[k] / noise[k] + (1 - aa) * Math.max(gammak[k] - 1, 0));
      vad += gammak[k] * ksi[k] / (1 + ksi[k]) - Math.log(1 + ksi[k]);
    }
    first = false;
    if (vad / slen < eta) for (let k = 0; k < nfft; k++) noise[k] = mu * noise[k] + (1 - mu) * sig2[k];
    for (let k = 0; k < nfft; k++) {
      const A = ksi[k] / (1 + ksi[k]);
      const vk = Math.max(A * gammak[k], 1e-10);
      const hw = A * Math.exp(0.5 * expint1(vk));
      xkPrev[k] = sig2[k] * hw * hw;
      re[k] *= hw; im[k] *= hw;
    }
    fft(re, im, true);
    for (let i = 0; i < len1; i++) out[k0 + i] = xOld[i] + re[i] / nfft;
    xOld = Float64Array.from({ length: len1 }, (_, i) => re[len1 + i] / nfft);
  }
  return out;
}

// ------------------------------------------------------------------ 2b. OM-LSA noise suppression with speech-presence noise tracking
// Gain: optimally-modified log-spectral amplitude estimator (Cohen and Berdugo 2001; Cohen 2003),
//       G = G_LSA^p * Gmin^(1-p), p = speech presence probability, a priori absence q from Cohen's
//       local / global / frame averages of the a priori SNR.
// Noise: speech-presence-probability tracker (Gerkmann and Hendriks 2012), so the noise estimate keeps
//       adapting through the clip; initialised from a low percentile of the whole clip (offline), so a
//       clip that starts with speech is handled.
export function omlsa(x, sr, { gminDb = -25, xiMinDb = -15, alphaDD = 0.94, noisePercentile = 0.15,
                               xiH1Db = 15, frameMs = 32, qMax = 0.95 } = {}) {
  const size = nextPow2(frameMs / 1000 * sr), hop = size / 4, bins = size / 2 + 1;
  const fft = makeFFT(size), win = hann(size).map(Math.sqrt);
  const padded = new Float64Array(x.length + 2 * size + hop);
  padded.set(x, size);
  const frames = Math.floor((padded.length - size) / hop) + 1;
  const re = new Float64Array(size), im = new Float64Array(size);
  const norm = (hop * 2 / size) / size;

  // Pass 1 (offline noise initialisation): power of every 4th frame, per-bin low percentile.
  const analyse = (f) => { const o = f * hop; for (let i = 0; i < size; i++) { re[i] = padded[o + i] * win[i]; im[i] = 0; } fft(re, im, false); };
  const step = 4, sampled = Math.ceil(frames / step), P = new Float32Array(sampled * bins);
  for (let s = 0; s < sampled; s++) { analyse(s * step); for (let k = 0; k < bins; k++) P[s * bins + k] = re[k] * re[k] + im[k] * im[k]; }
  const noise = new Float64Array(bins), col = new Float32Array(sampled);
  for (let k = 0; k < bins; k++) {
    for (let s = 0; s < sampled; s++) col[s] = P[s * bins + k];
    col.sort();
    // Noise power is roughly exponentially distributed: percentile -> mean via -ln(1 - percentile).
    noise[k] = Math.max(col[Math.floor(noisePercentile * (sampled - 1))] / -Math.log(1 - noisePercentile), 1e-12);
  }
  const Y = new Float64Array(bins);

  // Constants (time constants scaled from Cohen's 16 ms hop to ours).
  const hopScale = (hop / sr) / 0.016;
  const alphaN = Math.pow(0.8, hopScale), betaZeta = Math.pow(0.7, hopScale);
  const xiH1 = Math.pow(10, xiH1Db / 10), xiMin = Math.pow(10, xiMinDb / 10), gmin = Math.pow(10, gminDb / 20);
  const zMin = Math.pow(10, -10 / 10), zMax = Math.pow(10, -5 / 10), zPeakMin = 1, zPeakMax = Math.pow(10, 10 / 10);
  const binHz = sr / size, wLocal = 1, wGlobal = Math.max(1, Math.round(15 * 31.25 / binHz));
  const pBar = new Float64Array(bins).fill(0.5), zeta = new Float64Array(bins), xi = new Float64Array(bins);
  const prevA2 = new Float64Array(bins), gamma = new Float64Array(bins), csum = new Float64Array(bins + 1);
  let zetaPeak = 0, prevZetaFrame = 0, first = true;
  const out = new Float64Array(padded.length);
  const lin = (z, a, b) => z <= a ? 0 : z >= b ? 1 : Math.log(z / a) / Math.log(b / a);

  for (let f = 0; f < frames; f++) {
    analyse(f);
    for (let k = 0; k < bins; k++) Y[k] = re[k] * re[k] + im[k] * im[k];
    // Noise tracking (Gerkmann and Hendriks 2012).
    for (let k = 0; k < bins; k++) {
      const y = Y[k];
      let p1 = 1 / (1 + (1 + xiH1) * Math.exp(-y / noise[k] * xiH1 / (1 + xiH1)));
      pBar[k] = 0.9 * pBar[k] + 0.1 * p1;
      if (pBar[k] > 0.99) p1 = Math.min(p1, 0.99);
      noise[k] = Math.max(alphaN * noise[k] + (1 - alphaN) * ((1 - p1) * y + p1 * noise[k]), 1e-12);
    }
    // A posteriori and a priori SNR (decision-directed).
    for (let k = 0; k < bins; k++) {
      gamma[k] = Math.min(Y[k] / noise[k], 1e3);
      const dd = first ? Math.max(gamma[k] - 1, 0) : alphaDD * prevA2[k] / noise[k] + (1 - alphaDD) * Math.max(gamma[k] - 1, 0);
      xi[k] = Math.max(xiMin, dd);
      zeta[k] = first ? xi[k] : betaZeta * zeta[k] + (1 - betaZeta) * xi[k];
    }
    first = false;
    // A priori speech absence probability q (Cohen 2003): local, global and frame cues.
    csum[0] = 0; for (let k = 0; k < bins; k++) csum[k + 1] = csum[k] + zeta[k];
    const avg = (k, w) => { const a = Math.max(0, k - w), b = Math.min(bins - 1, k + w); return (csum[b + 1] - csum[a]) / (b - a + 1); };
    let zetaFrame = 0; for (let k = 0; k < bins; k++) zetaFrame += zeta[k]; zetaFrame /= bins;
    let pFrame;
    if (zetaFrame > zMin) {
      if (zetaFrame > prevZetaFrame) { zetaPeak = Math.min(Math.max(zetaFrame, zPeakMin), zPeakMax); pFrame = 1; }
      else pFrame = zetaFrame <= zetaPeak * zMin ? 0 : zetaFrame >= zetaPeak * zMax ? 1 : Math.log(zetaFrame / zetaPeak / zMin) / Math.log(zMax / zMin);
    } else pFrame = 0;
    prevZetaFrame = zetaFrame;
    for (let k = 0; k < bins; k++) {
      const q = Math.min(qMax, 1 - lin(avg(k, wLocal), zMin, zMax) * lin(avg(k, wGlobal), zMin, zMax) * pFrame);
      const v = xi[k] / (1 + xi[k]) * gamma[k];
      const gH1 = Math.min(1, xi[k] / (1 + xi[k]) * Math.exp(0.5 * expint1(Math.max(v, 1e-10))));
      const p = 1 / (1 + q / (1 - q) * (1 + xi[k]) * Math.exp(-v));
      const g = Math.pow(gH1, p) * Math.pow(gmin, 1 - p);
      prevA2[k] = gH1 * gH1 * Y[k];
      re[k] *= g; im[k] *= g;
      if (k > 0 && k < size / 2) { re[size - k] = re[k]; im[size - k] = -im[k]; }
    }
    fft(re, im, true);
    const o = f * hop;
    for (let i = 0; i < size; i++) out[o + i] += re[i] * norm * win[i];
  }
  return out.subarray(size, size + x.length);
}

// ------------------------------------------------------------------ 3. finishing
function highpassZeroPhase(x, sr, fc) { // 2nd-order Butterworth biquad, forward and backward
  const w0 = 2 * Math.PI * fc / sr, alpha = Math.sin(w0) / Math.SQRT2, c = Math.cos(w0), a0 = 1 + alpha;
  const b0 = (1 + c) / 2 / a0, b1 = -(1 + c) / a0, b2 = b0, a1 = -2 * c / a0, a2 = (1 - alpha) / a0;
  const pass = (s) => {
    const y = new Float64Array(s.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < s.length; i++) { const v = b0 * s[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = s[i]; y2 = y1; y1 = v; y[i] = v; }
    return y;
  };
  return pass(pass(x).reverse()).reverse();
}

function normalise(x, targetRmsDb) {
  let e = 0, n = 0; const gate = 1e-4;
  for (const v of x) if (Math.abs(v) > gate) { e += v * v; n++; }
  const rms = Math.sqrt(e / Math.max(n, 1)) || 1e-9;
  let g = Math.pow(10, targetRmsDb / 20) / rms, peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v * g));
  if (peak > 0.98) g *= 0.98 / peak;
  return Float32Array.from(x, (v) => v * g);
}

// ------------------------------------------------------------------ public entry point
export function voclairClean(samples, sampleRate, opts = {}) {
  const { rt60 = 0.8, dereverb = true, denoise = true, denoiser = "omlsa", highpassHz = 80, targetRmsDb = -23, onProgress } = opts;
  let peak = 0; for (const v of samples) peak = Math.max(peak, Math.abs(v));
  let x = Float64Array.from(samples, (v) => (v / (peak || 1)) * 0.5);
  onProgress?.(0.05);
  if (dereverb) x = lateReverbSubtraction(x, sampleRate, { rt60 });
  onProgress?.(0.45);
  if (denoise) x = denoiser === "logmmse" ? logMmse(x, sampleRate) : omlsa(x, sampleRate, opts.omlsa);
  onProgress?.(0.85);
  if (highpassHz) x = highpassZeroPhase(x, sampleRate, highpassHz);
  const y = normalise(x, targetRmsDb);
  onProgress?.(1);
  return y;
}

// ------------------------------------------------------------------ helpers for the page
// Decode any browser-supported file (MP3, M4A/AAC, OGG/Opus, WAV, FLAC) to mono Float32Array.
export async function decodeToMono(arrayBuffer, AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext) {
  const ctx = new AudioContextClass();
  try {
    const buf = await ctx.decodeAudioData(arrayBuffer);
    const mono = new Float32Array(buf.length);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < buf.length; i++) mono[i] += ch[i] / buf.numberOfChannels;
    }
    return { samples: mono, sampleRate: buf.sampleRate };
  } finally { ctx.close?.(); }
}

// Encode mono Float32Array as a 16-bit PCM WAV Blob (for download or <audio src>).
export function encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2), v = new DataView(buffer);
  const str = (o, s) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  str(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVE"); str(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, "data");
  v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 32767, true);
  return new Blob([buffer], { type: "audio/wav" });
}
