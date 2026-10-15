/* Voclair language switch: English (source) and German.
   The page is written in English; this file swaps visible text and labels to German.
   It also catches text the scripts add later (demo messages, form states) through a MutationObserver,
   so new English strings only need a line in DE below. Choice: saved > browser language > English. */
(function () {
  "use strict";
  var KEY = "voclair-lang";

  var DE = {
    /* Top bar, menu, footer */
    "Skip to content": "Zum Inhalt springen",
    "How it works": "So funktioniert es",
    "Coming next": "Demnächst",
    "Get a quote": "Angebot anfragen",
    "Appearance": "Darstellung",
    "Language": "Sprache",
    "Product": "Produkt",
    "Contact": "Kontakt",
    "Request a quote": "Angebot anfragen",
    "Privacy policy": "Datenschutz",
    "Cookie settings": "Cookie-Einstellungen",
    "Cookies and privacy": "Cookies und Datenschutz",
    "Voclair uses no tracking, analytics or advertising cookies. With your consent, this browser remembers your theme and language choice.":
      "Voclair verwendet keine Tracking-, Analyse- oder Werbe-Cookies. Mit Ihrer Einwilligung merkt sich dieser Browser Ihre Auswahl für Darstellung und Sprache.",
    "Details in the": "Details in der",
    ". You can change your choice at any time under “Cookie settings” at the bottom of the page.": ". Ihre Auswahl können Sie jederzeit unter „Cookie-Einstellungen“ unten auf der Seite ändern.",
    "Reject": "Ablehnen",
    "Accept": "Akzeptieren",

    /* Hero */
    "Your voice. Your words. Always.": "Ihre Stimme. Ihre Worte. Immer.",
    "Voclair removes echo, reverb and noise from your microphone as you speak. It runs locally on your device, and nothing is stored by us.":
      "Voclair entfernt Echo, Hall und Störgeräusche aus Ihrem Mikrofon, während Sie sprechen. Es läuft lokal auf Ihrem Gerät, und wir speichern nichts.",
    "Before": "Vorher",
    "After": "Nachher",
    "Flip the switch while it plays. Drag the wave to jump around.": "Während der Wiedergabe umschalten. An der Welle ziehen, um zu springen.",
    "The haze around the voice is echo, reverb and noise.": "Der Schleier um die Stimme ist Echo, Hall und Rauschen.",
    "Recorded live at Cyber Valley.": "Live im Cyber Valley aufgenommen.",
    "The haze around the voice is echo, reverb and noise. Recorded live at Cyber Valley.": "Der Schleier um die Stimme ist Echo, Hall und Rauschen. Live im Cyber Valley aufgenommen.",
    "Hear the difference": "Den Unterschied hören",
    "Try the demo": "Demo testen",
    "Made for lecture halls, conference venues and live events.": "Für Hörsäle, Konferenzräume und Live-Veranstaltungen.",

    /* Problem */
    "The room gets between the speaker and the audience.": "Der Raum stellt sich zwischen Redner und Publikum.",
    "Noise": "Störgeräusche",
    "Reverb": "Hall",
    "In lecture halls and big meeting rooms, the voice bounces off the walls and comes back.": "In Hörsälen und großen Besprechungsräumen prallt die Stimme von den Wänden ab und kommt zurück.",
    "At events and busy venues, chatter, air conditioning and crowd noise bury the voice.": "Bei Veranstaltungen und an belebten Orten übertönen Gespräche, Klimaanlage und Publikum die Stimme.",
    "In large, hard rooms, every word rings on and blurs into the next.": "In großen, schallharten Räumen klingt jedes Wort nach und verschwimmt mit dem nächsten.",
    "Today the fix is better microphones, acoustic treatment of the room, or hours of expert adjustment. Voclair cleans the voice as it is spoken.":
      "Bisher helfen nur bessere Mikrofone, eine akustische Behandlung des Raums oder stundenlange Feinarbeit von Fachleuten. Voclair reinigt die Stimme, während sie gesprochen wird.",

    /* How it works */
    "It sits between the microphone and the speakers.": "Voclair sitzt zwischen Mikrofon und Lautsprechern.",
    "Speak.": "Sprechen.",
    "The speaker uses the microphone you already have.": "Gesprochen wird in das vorhandene Mikrofon.",
    "Clean.": "Reinigen.",
    "Voclair software cleans the voice as it passes through.": "Die Voclair-Software reinigt die Stimme auf ihrem Weg.",
    "Hear.": "Hören.",
    "The clear voice goes to the speakers, the livestream or the recording.": "Die klare Stimme geht an die Lautsprecher, den Livestream oder die Aufnahme.",
    "Works with your setup": "Passt zu Ihrer Technik",
    "No new microphones or speakers.": "Keine neuen Mikrofone oder Lautsprecher.",
    "Echo, reverb and noise in one step": "Echo, Hall und Störgeräusche in einem Schritt",
    "One tool, not a chain of fixes.": "Ein Werkzeug statt einer Kette von Notlösungen.",
    "Private by design": "Datenschutz von Anfang an",
    "It runs on your own computer, and nothing is stored.": "Es läuft auf Ihrem eigenen Computer, und nichts wird gespeichert.",
    "It runs locally on your device, and nothing is stored by us.": "Es läuft lokal auf Ihrem Gerät, und wir speichern nichts.",

    /* Demo */
    "Hear it with your own audio.": "Hören Sie es mit Ihrer eigenen Aufnahme.",
    "Upload or record someone speaking and hear the difference.": "Laden Sie eine Sprachaufnahme hoch oder nehmen Sie eine auf, und hören Sie den Unterschied.",
    "Up to 5 MB or 3 minutes; nothing is stored.": "Bis 5 MB oder 3 Minuten; nichts wird gespeichert.",
    "Upload a file": "Datei hochladen",
    "Drop a recording here, or choose one from your device. MP3, WAV, M4A, OGG or FLAC, up to 5 MB.":
      "Aufnahme hierher ziehen oder vom Gerät auswählen. MP3, WAV, M4A, OGG oder FLAC, bis 5 MB.",
    "Choose a file": "Datei auswählen",
    "or drag it here": "oder hierher ziehen",
    "Record 10 seconds": "10 Sekunden aufnehmen",
    "Works best in a room with echo or background noise.": "Am besten in einem Raum mit Hall oder Hintergrundgeräuschen.",
    "Recording": "Aufnahme läuft",
    "Start recording": "Aufnahme starten",
    "Stop recording": "Aufnahme beenden",
    "Reading the recording…": "Aufnahme wird gelesen …",
    "Cleaning on your device…": "Wird auf Ihrem Gerät gereinigt …",
    "Cleaned. Listen below.": "Gereinigt. Unten anhören.",
    "Your recording, before and after.": "Ihre Aufnahme, vorher und nachher.",
    "Preview build: the cleaning model is not connected yet, so After plays the original recording.":
      "Vorschauversion: Das Reinigungsmodell ist noch nicht angebunden, daher spielt „Nachher“ die Originalaufnahme ab.",
    "Download the clean version": "Gereinigte Fassung herunterladen",
    "Show details": "Details anzeigen",
    "Before: spectrogram (time left to right, pitch bottom to top)": "Vorher: Spektrogramm (Zeit von links nach rechts, Tonhöhe von unten nach oben)",
    "After: spectrogram": "Nachher: Spektrogramm",
    "Preview: clearer audio, clearer transcripts (coming next)": "Vorschau: klarerer Ton, klarere Transkripte (demnächst)",
    "Transcribing both versions…": "Beide Fassungen werden transkribiert …",
    "Summarising…": "Wird zusammengefasst …",
    "To use Voclair in a venue, describe it in the quote form and Voclair will reply with a price.":
      "Für den Einsatz von Voclair an einem Veranstaltungsort beschreiben Sie diesen im Anfrageformular; Voclair antwortet mit einem Preis.",
    "That file type is not supported. Try MP3, WAV, M4A, OGG or FLAC.": "Dieses Dateiformat wird nicht unterstützt. Versuchen Sie MP3, WAV, M4A, OGG oder FLAC.",
    "That file is over 5 MB. Try a shorter clip.": "Die Datei ist größer als 5 MB. Versuchen Sie einen kürzeren Ausschnitt.",
    "That recording is longer than 3 minutes. Try a shorter clip.": "Die Aufnahme ist länger als 3 Minuten. Versuchen Sie einen kürzeren Ausschnitt.",
    "No speech was found in this recording.": "In dieser Aufnahme wurde keine Sprache gefunden.",
    "The recording could not be cleaned. Try again, or try another file.": "Die Aufnahme konnte nicht gereinigt werden. Versuchen Sie es erneut oder mit einer anderen Datei.",
    "This browser cannot record here. Upload a file instead.": "Dieser Browser kann hier nicht aufnehmen. Laden Sie stattdessen eine Datei hoch.",
    "Microphone access was not granted. Upload a file instead.": "Der Mikrofonzugriff wurde nicht erlaubt. Laden Sie stattdessen eine Datei hoch.",
    "The transcript preview is not connected in this build.": "Die Transkript-Vorschau ist in dieser Version nicht angebunden.",
    "The transcripts could not be made. Close and reopen this panel to try again.": "Die Transkripte konnten nicht erstellt werden. Schließen und öffnen Sie diesen Bereich erneut.",
    "From the original": "Aus dem Original",
    "From the clean version": "Aus der gereinigten Fassung",
    "How they differ": "Unterschiede",
    "Struck through: only in the original. Highlighted: only in the clean version.": "Durchgestrichen: nur im Original. Hervorgehoben: nur in der gereinigten Fassung.",
    "Summary of the clean version": "Zusammenfassung der gereinigten Fassung",
    "No words were recognised.": "Es wurden keine Wörter erkannt.",

    /* Coming next */
    "Live captions and summaries": "Live-Untertitel und Zusammenfassungen",
    "Captions on screen as people speak, plus a summary afterwards.": "Untertitel auf dem Bildschirm, während gesprochen wird, und danach eine Zusammenfassung.",
    "Better transcripts": "Bessere Transkripte",
    "Empower your AI": "Stärken Sie Ihre KI",
    "The Full Package": "Das Komplettpaket",
    "Voice AI that just works.": "Sprach-KI, die einfach funktioniert.",
    "Clearer audio for speech recognition and voice assistants.": "Klarerer Ton für Spracherkennung und Sprachassistenten.",
    "Developer access": "Zugang für Entwickler",
    "Connect Voclair to your own software.": "Voclair mit der eigenen Software verbinden.",
    "For early access, choose the product in the form below.": "Für frühen Zugang wählen Sie das Produkt im Formular unten.",
    "Get early access": "Frühen Zugang anfragen",

    /* Team */
    "The team behind Voclair": "Das Team hinter Voclair",
    "Voclair began at a talk where the room swallowed the speaker's voice. Its founders set out to fix that.":
      "Voclair entstand bei einem Vortrag, bei dem der Raum die Stimme des Redners verschluckte. Die Gründer haben sich vorgenommen, das zu ändern.",
    "Speech enhancement and test-time adaptation research, University of Stuttgart": "Forschung zu Sprachverbesserung und Test-Time Adaptation, Universität Stuttgart",
    "Speech recognition (ASR) models built from scratch": "Eigene Spracherkennungsmodelle (ASR), von Grund auf entwickelt",
    "Live mixing on digital desks": "Live-Mischung an digitalen Pulten",
    "UI/UX, branding and strategy": "UI/UX, Markenauftritt und Strategie",
    "Natural language processing": "Verarbeitung natürlicher Sprache",
    "Automatic speech recognition": "Automatische Spracherkennung",
    "Local, private AI deployment": "Lokaler, datenschutzfreundlicher KI-Einsatz",

    /* FAQ */
    "Questions and answers": "Fragen und Antworten",
    "Is my audio stored?": "Wird meine Aufnahme gespeichert?",
    "No. Voclair runs on your own device, and nothing is kept.": "Nein. Voclair läuft auf Ihrem eigenen Gerät, und nichts wird aufbewahrt.",
    "Do I need new equipment?": "Brauche ich neue Technik?",
    "No. Voclair is software. It works with the microphones and speakers you already have.": "Nein. Voclair ist Software. Es funktioniert mit den vorhandenen Mikrofonen und Lautsprechern.",
    "Is live mode ready?": "Ist der Live-Modus fertig?",
    "Live mode is in testing. The result can be heard on a recording today.": "Der Live-Modus wird gerade getestet. Das Ergebnis lässt sich schon heute an einer Aufnahme hören.",
    "How much does it cost?": "Was kostet es?",
    "Pricing depends on the venue and how Voclair is used. Request a quote, and Voclair will reply by email.":
      "Der Preis hängt vom Veranstaltungsort und vom Einsatz ab. Fragen Sie ein Angebot an; Voclair antwortet per E-Mail.",

    /* Quote form */
    "Two questions and an email address. Voclair replies by email and never shares the address.":
      "Zwei Fragen und eine E-Mail-Adresse. Voclair antwortet per E-Mail und gibt die Adresse nie weiter.",
    "Email": "E-Mail",
    "Enter an email address like name@venue.com.": "Geben Sie eine E-Mail-Adresse wie name@beispiel.de ein.",
    "Voclair uses this address only to reply and never shares it.": "Voclair nutzt diese Adresse nur für die Antwort und gibt sie nie weiter.",
    "What do you need?": "Was benötigen Sie?",
    "Live sound for talks or events": "Live-Ton für Vorträge oder Veranstaltungen",
    "Early access to upcoming products": "Frühen Zugang zu kommenden Produkten",
    "Email me when it is available": "Per E-Mail benachrichtigen, sobald verfügbar",
    "Not sure": "Noch unsicher",
    "Anything else?": "Sonst noch etwas?",
    "The message could not be sent. Check the connection and try again.": "Die Nachricht konnte nicht gesendet werden. Prüfen Sie die Verbindung und versuchen Sie es erneut.",
    "Send": "Senden",
    "Sending…": "Wird gesendet …",
    "Read the": "Lesen Sie die",
    "privacy policy": "Datenschutzerklärung",
    "Thank you.": "Vielen Dank.",
    "Voclair will reply to": "Voclair antwortet an",
    "While you wait, hear what Voclair does.": "Hören Sie inzwischen, was Voclair kann.",

    /* Labels read by screen readers, and placeholders */
    "Voclair, back to top": "Voclair, zurück nach oben",
    "Main": "Hauptmenü",
    "Main, mobile": "Hauptmenü, mobil",
    "Switch theme": "Darstellung wechseln",
    "Switch to dark mode": "Zum dunklen Modus wechseln",
    "Switch to light mode": "Zum hellen Modus wechseln",
    "Open menu": "Menü öffnen",
    "Close menu": "Menü schließen",
    "Play": "Abspielen",
    "Pause": "Pausieren",
    "Playback position": "Wiedergabeposition",
    "name@venue.com": "name@beispiel.de",
    "e.g. the venue, room size, or how often you run events": "z. B. Veranstaltungsort, Raumgröße oder wie oft Veranstaltungen stattfinden"
  };

  var ATTRS = ["aria-label", "placeholder", "alt", "title"];
  var lang = "en";
  try { lang = localStorage.getItem(KEY) || ""; } catch (e) {}
  if (lang !== "en" && lang !== "de") lang = /^de\b/i.test(navigator.language || "") ? "de" : "en";

  function t(s) { return lang === "de" && DE[s] ? DE[s] : s; }
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  var reverse = {}; Object.keys(DE).forEach(function (k) { reverse[DE[k]] = k; });

  /* Each text node remembers its English source, so switching back is exact. */
  function doText(n) {
    var p = n.parentElement;
    if (!p || p.closest("script, style, .vc-lang")) return;
    var raw = n.nodeValue, key = norm(raw);
    if (!key || !/[A-Za-z]/.test(key)) return;
    if (n.__en && (key === n.__en || key === DE[n.__en])) key = n.__en;      /* our own earlier write */
    else if (reverse[key]) key = reverse[key];
    else if (!DE[key]) { n.__en = null; return; }
    n.__en = key;
    var want = t(key);
    if (key !== want || norm(raw) !== key) {
      var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
      var next = lead + want + trail;
      if (raw !== next) n.nodeValue = next;
    }
  }
  function doAttrs(el) {
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a); if (!v) return;
      var key = reverse[v] || v; if (!DE[key]) return;
      var want = t(key); if (v !== want) el.setAttribute(a, want);
    });
  }
  function apply(root) {
    root = root || document.body;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doAttrs(root);
    root.querySelectorAll("[aria-label],[placeholder],[alt],[title]").forEach(doAttrs);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) doText(n);
  }

  function paintToggles() {
    document.querySelectorAll(".vc-lang").forEach(function (b) {
      b.setAttribute("aria-label", lang === "de" ? "Sprache: Deutsch. Switch to English" : "Language: English. Auf Deutsch umschalten");
      b.querySelectorAll("[data-l]").forEach(function (s) { s.toggleAttribute("data-on", s.getAttribute("data-l") === lang); });
    });
  }
  function set(next) {
    lang = next;
    try { if (localStorage.getItem("voclair-consent") === "accepted") localStorage.setItem(KEY, lang); } catch (e) {}   /* only with consent */
    document.documentElement.lang = lang === "de" ? "de" : "en-GB";
    apply(document.body); paintToggles();
  }

  /* Text the scripts add or change later */
  var mo = new MutationObserver(function (list) {
    list.forEach(function (m) {
      if (m.type === "childList") m.addedNodes.forEach(apply);
      else if (m.type === "characterData") doText(m.target);
      else if (m.type === "attributes") doAttrs(m.target);
    });
  });

  function init() {
    document.documentElement.lang = lang === "de" ? "de" : "en-GB";
    apply(document.body); paintToggles();
    document.addEventListener("click", function (e) {
      if (e.target.closest(".vc-lang")) set(lang === "de" ? "en" : "de");
    });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.VoclairI18n = { t: t, set: set, get: function () { return lang; }, apply: apply };
})();
