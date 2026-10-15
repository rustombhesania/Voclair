/* Voclair consent banner (GDPR / §25 TDDDG).
   The site uses no cookies, analytics or third-party content. The only thing it can keep in the
   browser is the visitor's theme and language choice; that is remembered only after "Accept".
   "Accept" and "Reject" carry equal weight, nothing is pre-ticked, the page is never blocked,
   and "Cookie settings" in the footer reopens the banner to change the choice at any time.
   The decision itself is stored (strictly necessary, so the question is not asked on every visit). */
(function () {
  "use strict";
  var KEY = "voclair-consent", PREFS = ["voclair-theme", "voclair-lang"];
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var bar = null;
  function close() { if (bar) { bar.remove(); bar = null; } }
  function decide(v) {
    put(v);
    if (v === "accepted") {
      /* keep the choices made so far on this visit */
      try {
        localStorage.setItem("voclair-theme", document.documentElement.getAttribute("data-theme") || "light");
        if (window.VoclairI18n) localStorage.setItem("voclair-lang", window.VoclairI18n.get());
      } catch (e) {}
    } else {
      PREFS.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
    }
    var back = bar && bar.__opener; close();
    if (back && back.focus) back.focus();
  }
  function open(opener) {
    if (bar) { bar.querySelector("button").focus(); return; }
    bar = document.createElement("section");
    bar.className = "vc-consent";
    bar.setAttribute("aria-labelledby", "vc-consent-title");
    bar.__opener = opener || null;
    bar.innerHTML =
      '<h2 class="vc-consent-title" id="vc-consent-title">Cookies and privacy</h2>' +
      '<p>Voclair uses no tracking, analytics or advertising cookies. With your consent, this browser remembers your theme and language choice.</p>' +
      '<p class="vc-consent-more">Details in the <a class="vc-link" href="privacy.html">privacy policy</a>. You can change your choice at any time under “Cookie settings” at the bottom of the page.</p>' +
      '<div class="vc-consent-actions">' +
        '<button class="vc-btn vc-btn-secondary" type="button" data-consent="rejected">Reject</button>' +
        '<button class="vc-btn vc-btn-secondary" type="button" data-consent="accepted">Accept</button>' +
      '</div>';
    bar.addEventListener("click", function (e) { var b = e.target.closest("[data-consent]"); if (b) decide(b.getAttribute("data-consent")); });
    bar.addEventListener("keydown", function (e) { if (e.key === "Escape") { var back = bar.__opener; close(); if (back) back.focus(); } });
    document.body.appendChild(bar);
    if (opener) bar.querySelector("button").focus();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-consent-open]");
    if (t) { e.preventDefault(); open(t); }
  });

  /* First visit: show once the preloader has gone, so it is not hidden behind it. */
  function maybeShow() {
    if (get()) return;
    if (document.documentElement.classList.contains("is-loading")) { setTimeout(maybeShow, 300); return; }
    open(null);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", maybeShow); else maybeShow();

  window.VoclairConsent = { open: open, get: get };
})();
