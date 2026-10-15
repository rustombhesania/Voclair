/* Voclair site settings. Fill these in before launch; null hides the related line or uses a preview stand-in. */
window.VOCLAIR_CONFIG = {
  /* Hero clip: the same 10–15 s from the Cyber Valley sample, original and cleaned (real-time version), equal length. */
  heroBefore: "assets/audio/hero-before.mp3",
  heroAfter: "assets/audio/hero-after.mp3",

  /* "Use a sample" in the demo: an original recording to clean. */
  sample: "assets/audio/hero-before.mp3",

  /* Demo processing. null = clean in the visitor's browser with assets/js/engine/ (nothing is uploaded).
     Only set a URL if cleaning moves to a server: it must accept the audio as the POST body and return the cleaned audio. */
  cleanEndpoint: null,

  /* Room reverberation time in seconds passed to the engine: 0.4 small room, 0.8 medium (default), 1.5 large hall. */
  rt60: 0.8,

  /* Transcript preview. Each takes the audio as the POST body and returns JSON:
     transcribe → { "text": "…" }, summarise (POST { "text": "…" }) → { "summary": "…" }. null = not connected. */
  transcribeEndpoint: null,
  summariseEndpoint: null,

  /* Quote form: POST JSON { email, need, early[], notify, more }. null = preview (shows success, sends nothing). */
  quoteEndpoint: "https://formspree.io/f/xrperpwa",

  /* Copy placeholders from the spec. */
  replyDays: null,         /* e.g. 2 → "Voclair replies within 2 working days" */
  typicalSeconds: null,    /* e.g. 8 → "Usually takes about 8 seconds." */
  contactEmail: null,      /* e.g. "hello@voclair.example" → shown in the footer */
  linkedin: null,          /* company LinkedIn URL → shown in the footer */

  /* Preloader: shown on every visit; fills over this many ms, holds at 97% until the page has loaded. */
  preloaderMs: 5120
};
