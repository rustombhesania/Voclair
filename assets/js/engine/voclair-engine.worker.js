// file: voclair-engine.worker.js
// Runs voclairClean off the main thread so the page never freezes.
// Message in:  { id, samples: Float32Array, sampleRate, options }
// Messages out: { id, progress: 0..1 }  then  { id, cleaned: Float32Array }  or  { id, error }
import { voclairClean } from "./voclair-engine.js";

self.onmessage = (event) => {
  const { id, samples, sampleRate, options = {} } = event.data;
  try {
    const cleaned = voclairClean(samples, sampleRate, {
      ...options,
      onProgress: (p) => self.postMessage({ id, progress: p }),
    });
    self.postMessage({ id, cleaned }, [cleaned.buffer]);
  } catch (error) {
    self.postMessage({ id, error: String(error && error.message || error) });
  }
};
