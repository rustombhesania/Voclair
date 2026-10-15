# Voclair site: how the cleaning engine plugs in

Static site, no build step, no server. Cleaning runs in the visitor's browser.

## Rules for front-end changes

1. Do not edit `assets/js/engine/`. It is the algorithm; treat it as a black box.
2. The front end talks to the engine only through `window.VoclairEngine`:
   - `VoclairEngine.supported()` returns true when the browser can run it.
   - `VoclairEngine.clean(audioBuffer, { rt60, onProgress })` returns a Promise of a WAV `Blob`.
   - `audioBuffer` is a decoded Web Audio `AudioBuffer`; `onProgress` gets 0 to 1.
3. Load order in any page that cleans audio: `config.js`, then `assets/js/engine/voclair-engine-adapter.js`, then your own scripts.
4. The one call site is `cleanAudio()` in `assets/js/demo.js`. Upload and the 10 s microphone recording both go through it; new features (sample button, batch) should too. Recording needs https or localhost.
5. Never send user audio with `fetch`. The page promises "nothing is uploaded". Check the Network tab after changes.

## Files

| File | Role |
|---|---|
| `assets/js/engine/voclair-engine.js` | Algorithm: late-reverb subtraction, OM-LSA denoise with noise tracking (log-MMSE kept as an option), high-pass, normalise |
| `assets/js/engine/voclair-engine.worker.js` | Runs it off the main thread |
| `assets/js/engine/voclair-engine-adapter.js` | `window.VoclairEngine`, the only public API |
| `assets/js/config.js` | `rt60` (room size), `cleanEndpoint` (leave `null`), sample paths |
| `assets/js/demo.js` | Demo UI; `cleanAudio()` is the hook |

## Test locally

1. `python3 -m http.server 8000` in this folder (workers do not run from `file://`).
2. Open `http://localhost:8000/#demo`, upload an MP3. Expect "Cleaned. Listen below." in under a second for 5 s of audio.

## Deploy (Vercel)

1. Push this folder to a GitHub repo (personal account; Hobby cannot link organisation repos).
2. Vercel: New Project, import the repo, Framework preset "Other", no build command, output directory `.` (root).
3. Every push redeploys.

## Testing switches (add to the page address)

`?denoiser=logmmse` (old denoiser), `?dereverb=0`, `?denoise=0`, `?rt60=0.4`. Visitors never see these.
