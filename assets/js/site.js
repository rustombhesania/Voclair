/* Voclair landing page: preloader, hero audio, quote form, deep-link preselection, lazy demo. */
(function () {
  "use strict";
  var C = window.VOCLAIR_CONFIG || {};
  var V = window.Voclair;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  V.theme.init();
  V.init(document);

  /* ---------- Preloader: every visit, holds at 97% until the page has loaded ---------- */
  var pre = $("#preloader");
  var shell = [$(".vc-topbar"), $("main"), $(".vc-footer"), $(".skip-link")].filter(Boolean);
  function finishPreloader() {
    if (!pre || pre.__done) return;
    pre.__done = true;
    pre.setAttribute("data-done", "");
    document.documentElement.classList.remove("is-loading");
    shell.forEach(function (el) { el.inert = false; });
    setTimeout(function () { if (pre) pre.remove(); }, 750);
  }
  if (pre) {
    shell.forEach(function (el) { el.inert = true; });
    V.mountPreloaderWave($(".vc-preloader-wave canvas", pre));
    V.mountLoader($(".vc-loader", pre), {
      fillMs: C.preloaderMs || 5120,
      isReady: function () { return document.readyState === "complete"; },
      onDone: function () { setTimeout(finishPreloader, 250); }
    });
    /* Escape or a click skips it. */
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") finishPreloader(); });
    pre.addEventListener("click", finishPreloader);
  }

  /* ---------- Hero clip: use the real files when they exist ---------- */
  var hero = $("#hero-player");
  if (hero && C.heroBefore && C.heroAfter && window.fetch) {
    Promise.all([fetch(C.heroBefore, { method: "HEAD" }), fetch(C.heroAfter, { method: "HEAD" })]).then(function (r) {
      if (!r[0].ok || !r[1].ok) return;                      /* not added yet: the silent demo clock stays */
      var api = V.mountPlayer(hero);
      api.setSources(C.heroBefore, C.heroAfter);
      peaksFor([C.heroBefore, C.heroAfter]).then(function (p) { if (p) api.setPeaks({ before: p[0], after: p[1] }); });
    }).catch(function () {});
  }
  function peaksFor(urls) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return Promise.resolve(null);
    var ctx = new AC();
    return Promise.all(urls.map(function (u) {
      return fetch(u).then(function (r) { return r.arrayBuffer(); }).then(function (b) { return ctx.decodeAudioData(b); });
    })).then(function (bufs) { return bufs.map(function (b) { return V.computePeaks(b, 800); }); })
      .catch(function () { return null; })
      .finally(function () { if (ctx.close) ctx.close(); });
  }

  /* "Hear the difference": bring the hero clip into view and play it */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("#hero-listen, [data-listen]");
    if (!t || !hero) return;
    e.preventDefault();
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    hero.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    var api = hero.__vc || V.mountPlayer(hero);
    api.play();
    var play = $(".vc-play", hero); if (play) play.focus({ preventScroll: true });
  });

  /* ---------- Config-driven copy ---------- */
  if (C.replyDays) {
    $("#quote-sub").textContent = "Two questions and an email address. Voclair replies within " + C.replyDays + " working day" + (C.replyDays === 1 ? "" : "s") + " and never shares the address.";
  }
  var contact = $("#footer-contact");
  if (contact && C.contactEmail) {
    var li = document.createElement("li"), a = document.createElement("a");
    a.href = "mailto:" + C.contactEmail; a.textContent = C.contactEmail; li.appendChild(a); contact.insertBefore(li, contact.firstChild);
  }
  if (contact && C.linkedin) {
    var li2 = document.createElement("li"), a2 = document.createElement("a");
    a2.href = C.linkedin; a2.textContent = "LinkedIn"; a2.rel = "noopener"; li2.appendChild(a2); contact.appendChild(li2);
  }

  /* ---------- Quote form ---------- */
  var form = $("#quote-form");
  var email = $("#q-email"), emailErr = $("#q-email-err"), early = $("#q-early"), sendErr = $("#q-send-err"), send = $("#q-send");
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showEarly() {
    var on = $("#q-need-early").checked;
    early.hidden = !on;
  }
  $$('input[name="need"]').forEach(function (r) { r.addEventListener("change", showEarly); });

  function checkEmail() {
    var ok = EMAIL.test(email.value.trim());
    email.setAttribute("aria-invalid", ok ? "false" : "true");
    emailErr.hidden = ok;
    email.setAttribute("aria-describedby", ok ? "q-email-note" : "q-email-err q-email-note");
    return ok;
  }
  email.addEventListener("blur", function () { if (email.value.trim()) checkEmail(); });
  email.addEventListener("input", function () { if (email.getAttribute("aria-invalid") === "true") checkEmail(); });

  /* Buttons elsewhere preselect the form: data-need="live" | "early" */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-need]");
    if (!t) return;
    var need = t.getAttribute("data-need");
    if (need) { var r = $("#q-need-" + need); if (r) { r.checked = true; showEarly(); } }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    sendErr.hidden = true;
    if (!checkEmail()) { email.focus(); return; }
    var data = {
      email: email.value.trim(),
      need: (($('input[name="need"]:checked') || {}).value) || "unsure",
      early: $$('input[name="early"]:checked').map(function (c) { return c.value; }),
      notify: $("#q-notify").checked,
      more: $("#q-more").value.trim()
    };
    if ($("#q-website").value) { success(data.email); return; }  /* honeypot: a bot filled the hidden field */
    send.setAttribute("aria-disabled", "true"); send.textContent = "Sending…";
    var req = C.quoteEndpoint
      ? fetch(C.quoteEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); })
      : new Promise(function (res) { console.warn("Voclair: quoteEndpoint is not set; the form was not sent anywhere."); setTimeout(res, 600); });
    req.then(function () { success(data.email); }).catch(function () {
      sendErr.hidden = false; send.removeAttribute("aria-disabled"); send.textContent = "Send";
    });
  });
  send.addEventListener("click", function (e) { if (send.getAttribute("aria-disabled") === "true") e.preventDefault(); });

  function success(addr) {
    var slot = $("#quote-slot");
    var days = C.replyDays ? " within " + C.replyDays + " working day" + (C.replyDays === 1 ? "" : "s") : "";
    slot.innerHTML =
      '<div class="vc-success" role="status">' +
        '<span class="vc-success-icon">' + V.icon("check") + '</span>' +
        '<h3 class="subheading" id="quote-thanks" tabindex="-1">Thank you.</h3>' +
        '<p>Voclair will reply to <strong></strong>' + days + '.</p>' +
        '<p class="body-sm">While you wait, hear what Voclair does.</p>' +
        '<a class="vc-btn vc-btn-primary" href="#top" data-listen>Hear the difference</a>' +
      '</div>';
    $("strong", slot).textContent = addr;
    $("#quote-thanks").focus();
  }

  /* ---------- Demo: load its code only when the visitor gets near it ---------- */
  var demoLoaded = false;
  function loadDemo() {
    if (demoLoaded) return; demoLoaded = true;
    var s = document.createElement("script"); s.src = "assets/js/demo.js"; s.defer = true; document.body.appendChild(s);
  }
  var demo = $("#demo");
  if (location.hash === "#demo") loadDemo();
  if (demo && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { loadDemo(); io.disconnect(); } }, { rootMargin: "600px 0px" });
    io.observe(demo);
  } else { loadDemo(); }
})();
