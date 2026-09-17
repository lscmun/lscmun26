/* ============================================================
   LSCMUN 2026 — shared behaviour
   No build step, no dependencies. Reads config.js + data.js.
   ============================================================ */
(function () {
  "use strict";

  var C = window.LSCMUN || {};
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var PAGES = [
    { href: "index.html",       label: "Home" },
    { href: "councils.html",    label: "Councils" },
    { href: "schedule.html",    label: "Schedule" },
    { href: "secretariat.html", label: "Our Team" },
    { href: "resources.html",   label: "Resources" },
    { href: "sponsors.html",    label: "Sponsors" },
    { href: "gallery.html",     label: "Gallery" }
  ];

  /* ---------- nav ---------- */
  function buildNav() {
    var host = document.querySelector("[data-nav]");
    if (!host) return;
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var links = el("ul", { class: "nav__links", id: "navlinks" });
    PAGES.forEach(function (p) {
      var a = el("a", { href: p.href, text: p.label });
      if (p.href === here) a.setAttribute("aria-current", "page");
      links.appendChild(el("li", {}, [a]));
    });
    /* Register also lives as the standalone CTA button, which the
       mobile menu hides — so it needs its own entry inside the
       dropdown list, shown only at mobile widths (see .nav__links-cta
       in site.css). */
    var registerA = el("a", { href: "register.html", text: "Register" });
    if ("register.html" === here) registerA.setAttribute("aria-current", "page");
    links.appendChild(el("li", { class: "nav__links-cta" }, [registerA]));

    var toggle = el("button", {
      class: "nav__toggle", type: "button",
      "aria-expanded": "false", "aria-controls": "navlinks", "aria-label": "Open menu"
    }, [el("span", { html: '<svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M0 1h18M0 7h18M0 13h18" stroke="currentColor" stroke-width="1.6"/></svg>' })]);

    var nav = el("nav", { class: "nav", "aria-label": "Primary" }, [
      el("a", { class: "nav__brand", href: "index.html", "aria-label": C.name + " home" }, [
        el("img", { src: "assets/img/lscmun-mark-cream-sm.png", alt: "", width: "34", height: "34" }),
        el("b", { text: "LSCMUN" })
      ]),
      toggle, links,
      el("a", { class: "btn btn--primary nav__cta", href: "register.html", text: "Register" })
    ]);
    host.replaceWith(nav);

    function isMobile() { return window.matchMedia("(max-width: 940px)").matches; }
    function setOpen(open) {
      links.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    function sync() { if (isMobile()) setOpen(false); else { links.hidden = false; toggle.setAttribute("aria-expanded", "false"); } }
    sync();
    window.addEventListener("resize", sync);
    toggle.addEventListener("click", function () { setOpen(links.hidden); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMobile() && !links.hidden) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (isMobile() && !links.hidden && !nav.contains(e.target)) setOpen(false);
    });
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    var host = document.querySelector("[data-footer]");
    if (!host) return;
    var cols = [
      { h: "Conference", items: PAGES.slice(1, 4) },
      { h: "Participate", items: [{ href: "register.html", label: "Register" }, { href: "resources.html", label: "What is MUN?" }, { href: "sponsors.html", label: "Sponsor us" }] }
    ];
    var grid = el("div", { class: "foot__grid" }, [
      el("div", {}, [
        el("div", { class: "foot__mark" }, [
          el("img", { src: "assets/img/lscmun-mark-cream-sm.png", alt: "", width: "52", height: "52" }),
          el("div", {}, [
            el("b", { text: C.name, style: "font-family:var(--display);font-size:1.125rem;display:block" }),
            el("span", { text: C.theme, style: "font-size:.8125rem;color:var(--ink-faint)" })
          ])
        ]),
        el("p", { class: "prose", text: C.department + ", " + C.institution, style: "font-size:.875rem;margin:0" })
      ])
    ]);
    cols.forEach(function (c) {
      var ul = el("ul");
      c.items.forEach(function (i) { ul.appendChild(el("li", {}, [el("a", { href: i.href, text: i.label })])); });
      grid.appendChild(el("div", {}, [el("h4", { text: c.h }), ul]));
    });
    grid.appendChild(el("div", {}, [
      el("h4", { text: "Contact" }),
      el("ul", {}, [
        el("li", {}, [el("a", { href: "mailto:" + C.email, text: C.email })]),
        el("li", {}, [el("a", { href: C.instagram, target: "_blank", rel: "noopener", text: C.instagramTag || "Instagram" })])
      ])
    ]));

    var tiers = (C.sponsorTiers || []).map(function (t) { return t.tier; }).join(" · ");
    var sponsor = el("div", { class: "foot__sponsor" }, [
      el("b", { text: "Interested in sponsoring?" }),
      el("span", { text: tiers + " partnerships available." }),
      el("span", {}, [
        el("a", { href: "sponsors.html", text: "See what each tier includes" }),
        el("span", { text: "  ·  " }),
        el("a", { href: "mailto:" + C.email, text: C.email })
      ])
    ]);

    var foot = el("footer", { class: "foot" }, [
      el("div", { class: "strata strata--thin" }, [0, 1, 2, 3, 4].map(function () { return el("span"); })),
      el("div", { class: "wrap", style: "padding-top:var(--s5)" }, [
        grid, sponsor,
        el("div", { class: "foot__legal" }, [
          el("span", { text: "© 2026 " + C.name + " · " + C.institution }),
          el("span", { class: "mono", text: C.dates.confirmed ? C.dates.display : C.dates.display })
        ])
      ])
    ]);
    host.replaceWith(foot);
  }

  /* ---------- strata dividers ---------- */
  function buildStrata() {
    document.querySelectorAll("[data-strata]").forEach(function (h) {
      var s = el("div", { class: "strata" + (h.hasAttribute("data-thin") ? " strata--thin" : ""), "aria-hidden": "true" },
        [0, 1, 2, 3, 4].map(function () { return el("span"); }));
      h.replaceWith(s);
    });
  }

  /* ---------- scroll reveal ---------- */
  function reveals() {
    var items = document.querySelectorAll(".reveal, .reveal--pop");
    if (!items.length) return;
    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var d = parseInt(e.target.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { e.target.classList.add("is-in"); }, d);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ---------- hero word ------------------------------------------
     Splits the theme word into letters purely so they can rise in
     sequence. No displacement — every letter lands where the type
     already put it. The word stays one string for screen readers.
     ---------------------------------------------------------------- */
  function heroWord() {
    var host = document.querySelector("[data-word]");
    if (!host) return;
    var phrase = host.getAttribute("data-word") || host.textContent;
    host.textContent = "";
    host.appendChild(el("span", { class: "sr-only", text: phrase }));
    var wrap = el("span", { "aria-hidden": "true" });
    var i = 0;
    /* Split by word first so a phrase can wrap between words but never
       mid-word — letters are inline-block and would otherwise break
       anywhere the line runs out. */
    phrase.split(" ").forEach(function (word, w) {
      if (w) wrap.appendChild(el("span", { class: "ltr sp", text: " ", style: "--d:0ms" }));
      var wordEl = el("span", { class: "wd" });
      word.split("").forEach(function (ch) {
        wordEl.appendChild(el("span", {
          class: "ltr", text: ch, style: "--d:" + (200 + i++ * 34) + "ms"
        }));
      });
      wrap.appendChild(wordEl);
    });
    host.appendChild(wrap);
  }

  /* ---------- countdown ---------- */
  function countdown() {
    var host = document.querySelector("[data-countdown]");
    if (!host) return;
    if (!C.dates.confirmed) {
      host.innerHTML = '<p class="hero__meta" style="margin:0">' + esc(C.dates.display) + "</p>";
      return;
    }
    var target = new Date(C.dates.startISO).getTime();
    function tick() {
      var d = target - Date.now();
      if (d <= 0) { host.innerHTML = '<p class="hero__meta" style="margin:0">The conference is under way.</p>'; return; }
      var days = Math.floor(d / 864e5), hrs = Math.floor(d % 864e5 / 36e5), min = Math.floor(d % 36e5 / 6e4);
      host.innerHTML = '<p class="hero__meta" style="margin:0">' + days + " days · " + hrs + " hours · " + min + " minutes to opening</p>";
      setTimeout(tick, 30000);
    }
    tick();
  }

  /* ---------- councils ---------- */
  function renderCouncils() {
    var host = document.querySelector("[data-councils]");
    if (!host) return;
    var list = window.LSCMUN_COUNCILS || [];
    var limit = parseInt(host.getAttribute("data-limit") || "0", 10);
    var full = host.hasAttribute("data-full");
    if (limit) list = list.slice(0, limit);

    list.forEach(function (c, i) {
      var agendas = el("ul", { class: "council__agendas" });
      (full ? c.agendas : c.agendas.slice(0, 2)).forEach(function (a) {
        agendas.appendChild(el("li", { text: a }));
      });
      if (!full && c.agendas.length > 2) {
        agendas.appendChild(el("li", { text: "+ " + (c.agendas.length - 2) + " more agendas", style: "color:var(--ink-faint)" }));
      }
      var foot = el("div", { class: "council__foot" });
      c.sdgs.forEach(function (n) {
        foot.appendChild(el("span", { class: "sdg", text: "SDG " + n, title: window.LSCMUN_SDG[n] }));
      });
      if (c.note) foot.appendChild(el("span", { class: "council__note", text: c.note }));

      host.appendChild(el("article", { class: "council reveal--pop", "data-delay": String((i % 3) * 55) }, [
        el("div", { class: "council__code", text: c.code }),
        el("h3", { class: "council__name", text: c.name }),
        el("p", { class: "council__blurb", text: c.blurb }),
        agendas, foot
      ]));
    });
  }

  /* ---------- schedule ---------- */
  function renderSchedule() {
    var host = document.querySelector("[data-schedule]");
    if (!host) return;
    (window.LSCMUN_SCHEDULE || []).forEach(function (day) {
      var rows = el("div", { class: "sched" });
      day.items.forEach(function (it) {
        var isBreak = /breakfast|lunch|snack|break|dispersal|reporting/i.test(it[1]);
        rows.appendChild(el("div", { class: "sched__row" + (isBreak ? " sched__row--break" : "") }, [
          el("div", { class: "sched__time", text: it[0] }),
          el("div", { class: "sched__what", text: it[1] })
        ]));
      });
      host.appendChild(el("div", { class: "reveal" }, [
        el("h2", { class: "h-lg u-mb4", text: day.day }), rows
      ]));
    });
  }

  /* ---------- fees ----------------------------------------------
     The phase resolves itself from the clock unless it is forced.
     Nobody has to edit the site the night early bird closes.
     -------------------------------------------------------------- */
  function earlyBirdEnd() {
    var iso = C.fees.earlyBirdEndsISO;
    if (!iso) return null;
    var d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }
  function activePhase() {
    if (C.fees.phase === "early" || C.fees.phase === "late") return C.fees.phase;
    var end = earlyBirdEnd();
    if (!end) return "early";
    return Date.now() > end.getTime() ? "late" : "early";
  }
  function deadlineText() {
    var end = earlyBirdEnd();
    if (!end) return "on a date to be announced";
    return "on " + end.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  /* Each role can carry its own early-bird deadline and flips on it
     independently; roles without one fall back to the global date. */
  function roleEnd(key) {
    var iso = (C.fees.roleDeadlines || {})[key];
    if (iso) { var d = new Date(iso); if (!isNaN(d.getTime())) return d; }
    return earlyBirdEnd();
  }
  function rolePhase(key) {
    if (C.fees.phase === "early" || C.fees.phase === "late") return C.fees.phase;
    var end = roleEnd(key);
    if (!end) return "early";
    return Date.now() > end.getTime() ? "late" : "early";
  }
  function fmtDate(d) {
    return d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
             : "To be announced";
  }

  function renderFees() {
    var host = document.querySelector("[data-fees]");
    if (!host) return;
    var cur = C.fees.currency;
    var rows = [
      ["Delegate", "delegate"], ["Chairperson", "chair"],
      ["Press", "press"], ["Security", "security"], ["Runner", "runner"]
    ];
    var tb = el("tbody");
    rows.forEach(function (r) {
      var key = rolePhase(r[1]);
      var price = C.fees[key][r[1]];
      var end = roleEnd(r[1]);
      tb.appendChild(el("tr", {}, [
        el("td", { text: r[0] }),
        el("td", {}, [
          el("span", { text: C.fees[key].label,
            style: "font-family:var(--mono);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint)" })
        ]),
        el("td", { text: key === "early" ? fmtDate(end) : "Closed " + fmtDate(end) }),
        el("td", { text: cur + price.toLocaleString("en-IN") })
      ]));
    });

    host.appendChild(el("table", { class: "fees" }, [
      el("caption", { text: "Each category closes on its own date. The rate shown is the one in effect right now." }),
      el("thead", {}, [el("tr", {}, [
        el("th", { text: "Role" }), el("th", { text: "Rate" }),
        el("th", { text: "Deadline" }), el("th", { text: "Fee" })
      ])]),
      tb
    ]));
  }

  /* Any [data-deadline] element gets the live early-bird sentence. */
  function renderDeadline() {
    var nodes = document.querySelectorAll("[data-deadline]");
    if (!nodes.length) return;
    var key = activePhase();
    nodes.forEach(function (n) {
      n.textContent = key === "early"
        ? "Early bird closes " + deadlineText() + "."
        : "Early bird closed " + deadlineText() + "; late registration rates now apply.";
    });
  }

  /* ---------- registration form ---------- */
  function form() {
    var f = document.querySelector("[data-form]");
    if (!f) return;
    var status = document.getElementById("formstatus");
    var summary = document.getElementById("errsum");
    var submit = f.querySelector('button[type="submit"]');

    /* populate council + role selects from the data files */
    var councilSel = f.querySelector('[name="council1"], [name="council2"], [name="council3"]') ? f.querySelectorAll('[name^="council"]') : [];
    councilSel.forEach(function (sel) {
      (window.LSCMUN_COUNCILS || []).forEach(function (c) {
        sel.appendChild(el("option", { value: c.code, text: c.code + " — " + c.name }));
      });
    });
    var roleSel = f.querySelector('[name="role"]');
    if (roleSel) (window.LSCMUN_ROLES || []).forEach(function (r) {
      roleSel.appendChild(el("option", { value: r.name, text: r.name }));
    });

    /* Press wing (Journalist / Caricaturist / Photographer) only applies
       to the Press role — hidden and non-required otherwise. */
    var pressWingField = document.getElementById("pressWingField");
    var pressWingSel = document.getElementById("pressWing");
    function syncPressWing() {
      if (!pressWingField || !pressWingSel || !roleSel) return;
      var isPress = roleSel.value === "Press";
      pressWingField.hidden = !isPress;
      pressWingSel.required = isPress;
      if (!isPress) { pressWingSel.value = ""; setErr(pressWingSel, ""); }
    }
    if (roleSel) roleSel.addEventListener("change", syncPressWing);

    function setErr(input, msg) {
      var box = document.getElementById(input.name + "-err");
      if (box) box.textContent = msg || "";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }
    function validate() {
      var bad = [];
      f.querySelectorAll("[required]").forEach(function (i) {
        var v = (i.value || "").trim(), msg = "";
        if (!v) msg = "This field is required.";
        else if (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address.";
        else if (i.type === "tel" && !/^[+\d][\d\s-]{7,}$/.test(v)) msg = "Enter a valid phone number.";
        if (!setErr(i, msg)) bad.push(i);
      });
      /* distinct council preferences */
      var prefs = Array.prototype.map.call(f.querySelectorAll('[name^="council"]'), function (s) { return s.value; }).filter(Boolean);
      if (prefs.length !== new Set(prefs).size) {
        var c2 = f.querySelector('[name="council2"]');
        if (c2) { setErr(c2, "Choose three different councils."); bad.push(c2); }
      }
      return bad;
    }

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = validate();
      if (bad.length) {
        summary.hidden = false;
        summary.querySelector("ul").innerHTML = bad.map(function (i) {
          var lab = f.querySelector('label[for="' + i.id + '"]');
          return '<li><a href="#' + i.id + '">' + esc(lab ? lab.textContent.replace("*", "").trim() : i.name) + "</a></li>";
        }).join("");
        summary.focus();
        return;
      }
      summary.hidden = true;

      if (!C.sheetEndpoint) {
        status.className = "notice";
        status.innerHTML = "<div><strong>The form is not connected yet.</strong> Your IT team needs to deploy the Apps Script in <code>apps-script/Code.gs</code> and paste the resulting URL into <code>sheetEndpoint</code> in <code>assets/js/config.js</code>. Until then, register by emailing " + esc(C.email) + ".</div>";
        status.hidden = false;
        status.focus();
        return;
      }

      submit.setAttribute("aria-disabled", "true");
      submit.textContent = "Submitting…";
      status.hidden = true;

      var fd = new FormData(f);
      var file = f.querySelector('input[type="file"]');
      var send = function (extra) {
        var payload = {};
        fd.forEach(function (v, k) { if (!(v instanceof File)) payload[k] = v; });
        payload.submittedAt = new Date().toISOString();
        if (extra) { payload.proofName = extra.name; payload.proofData = extra.data; }
        fetch(C.sheetEndpoint, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "text/plain;charset=utf-8" } /* keeps it a simple request */
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.ok) {
              f.hidden = true;
              status.className = "notice";
              status.innerHTML = "<div><strong>Registration received.</strong> Your reference is <code>" + esc(res.id || "—") + "</code>. Keep it — the finance team will match it against your payment. You will hear from us by email once your allocation is confirmed.</div>";
              status.hidden = false;
              status.focus();
            } else { throw new Error((res && res.error) || "Unknown error"); }
          })
          .catch(function (err) {
            status.className = "notice";
            status.innerHTML = "<div><strong>That did not go through.</strong> " + esc(err.message) + " Please try again, or email " + esc(C.email) + " with your details.</div>";
            status.hidden = false;
            status.focus();
            submit.removeAttribute("aria-disabled");
            submit.textContent = "Submit registration";
          });
      };

      if (file && file.files && file.files[0]) {
        var blob = file.files[0];
        if (blob.size > 5 * 1024 * 1024) {
          setErr(file, "That file is larger than 5 MB. Please upload a smaller screenshot.");
          submit.removeAttribute("aria-disabled");
          submit.textContent = "Submit registration";
          return;
        }
        var fr = new FileReader();
        fr.onload = function () { send({ name: blob.name, data: fr.result }); };
        fr.onerror = function () { send(null); };
        fr.readAsDataURL(blob);
      } else { send(null); }
    });

    f.addEventListener("blur", function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute("required")) validate();
    }, true);
  }

  /* ---------- chairperson application form ----------------------
     Separate submission from the delegate form above: its own
     validation and its own POST, sent with a fixed role of
     "Chairperson" so the Apps Script sorts it into the Chairpersons
     tab and reference-number series the same way a delegate row
     would sort into Delegates.
     ---------------------------------------------------------------- */
  function chairForm() {
    var f = document.querySelector("[data-chair-form]");
    if (!f) return;
    var status = document.getElementById("chairFormStatus");
    var summary = document.getElementById("chairErrsum");
    var submit = f.querySelector('button[type="submit"]');

    var committeeSel = f.querySelectorAll('[name="chairCommittee1"], [name="chairCommittee2"]');
    committeeSel.forEach(function (sel) {
      (window.LSCMUN_COUNCILS || []).forEach(function (c) {
        sel.appendChild(el("option", { value: c.code, text: c.code + " — " + c.name }));
      });
    });

    function setErr(input, msg) {
      var box = document.getElementById(input.name + "-err") || document.getElementById(input.id + "-err");
      if (box) box.textContent = msg || "";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }
    function validate() {
      var bad = [];
      f.querySelectorAll("[required]").forEach(function (i) {
        var v = (i.value || "").trim(), msg = "";
        if (!v) msg = "This field is required.";
        else if (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address.";
        else if (i.type === "tel" && !/^[+\d][\d\s-]{7,}$/.test(v)) msg = "Enter a valid phone number.";
        if (!setErr(i, msg)) bad.push(i);
      });
      var expBox = document.getElementById("chairExp-err");
      var anyExp = Array.prototype.some.call(
        f.querySelectorAll('input[name^="chairExp"]'), function (c) { return c.checked; }
      );
      if (expBox) expBox.textContent = anyExp ? "" : "Choose at least one.";
      if (!anyExp) bad.push(f.querySelector('input[name="chairExpDelegating"]'));
      return bad;
    }

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = validate();
      if (bad.length) {
        summary.hidden = false;
        summary.querySelector("ul").innerHTML = bad.map(function (i) {
          var lab = f.querySelector('label[for="' + i.id + '"]') || document.getElementById("chairExpLabel");
          return '<li><a href="#' + (i.id || "chairExpLabel") + '">' +
            esc(lab ? lab.textContent.replace("*", "").trim() : i.name) + "</a></li>";
        }).join("");
        summary.focus();
        return;
      }
      summary.hidden = true;

      if (!C.sheetEndpoint) {
        status.className = "notice";
        status.innerHTML = "<div><strong>The form is not connected yet.</strong> Your IT team needs to deploy the Apps Script in <code>apps-script/Code.gs</code> and paste the resulting URL into <code>sheetEndpoint</code> in <code>assets/js/config.js</code>. Until then, apply by emailing " + esc(C.email) + ".</div>";
        status.hidden = false;
        status.focus();
        return;
      }

      submit.setAttribute("aria-disabled", "true");
      submit.textContent = "Submitting…";
      status.hidden = true;

      var fd = new FormData(f);
      var payload = {};
      fd.forEach(function (v, k) { payload[k] = v; });
      payload.role = "Chairperson";
      payload.submittedAt = new Date().toISOString();

      fetch(C.sheetEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok) {
            f.hidden = true;
            status.className = "notice";
            status.innerHTML = "<div><strong>Chair application received.</strong> Your reference is <code>" + esc(res.id || "—") + "</code>. Chair selections are announced after applications close — if you are not selected, you will be considered as a delegate instead.</div>";
            status.hidden = false;
            status.focus();
          } else { throw new Error((res && res.error) || "Unknown error"); }
        })
        .catch(function (err) {
          status.className = "notice";
          status.innerHTML = "<div><strong>That did not go through.</strong> " + esc(err.message) + " Please try again, or email " + esc(C.email) + " with your details.</div>";
          status.hidden = false;
          status.focus();
          submit.removeAttribute("aria-disabled");
          submit.textContent = "Submit chair application";
        });
    });

    f.addEventListener("blur", function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute("required")) validate();
    }, true);
  }

  /* ---------- fill [data-cfg] text from config ---------- */
  function fillConfig() {
    document.querySelectorAll("[data-cfg]").forEach(function (n) {
      var path = n.getAttribute("data-cfg").split(".");
      var v = C;
      path.forEach(function (p) { v = v && v[p]; });
      if (v !== undefined && v !== null) n.textContent = v;
    });
  }

  /* ---------- secretariat ---------- */
  function renderPeople() {
    var host = document.querySelector("[data-people]");
    if (!host) return;
    (C.secretariat || []).forEach(function (p, i) {
      var initials = p.name.replace(/^Dr\.?\s+/i, "").split(/\s+/)
        .map(function (w) { return w[0]; }).slice(0, 2).join("");
      /* A headshot if one is supplied, initials if not. */
      var portrait = p.photo
        ? el("div", { class: "person__ph" }, [el("img", { src: p.photo, alt: p.name, loading: "lazy" })])
        : el("div", { class: "person__ph", "aria-hidden": "true", text: initials });
      host.appendChild(el("div", { class: "card person reveal--pop", "data-delay": String(i * 70) }, [
        portrait,
        el("div", { class: "person__role", text: p.role }),
        el("div", { class: "person__name", text: p.name }),
        el("div", { class: "person__meta", text: p.meta })
      ]));
    });
  }

  /* ---------- organising committee ---------- */
  function renderOC() {
    var host = document.querySelector("[data-oc]");
    if (!host) return;
    (C.oc || []).forEach(function (t, i) {
      host.appendChild(el("div", { class: "card reveal", "data-delay": String((i % 2) * 70) }, [
        /* size is optional — team headcounts are not confirmed */
        t.size ? el("div", { class: "council__code", text: t.size }) : null,
        el("h3", { text: t.team }),
        el("p", { text: t.brief })
      ]));
    });
  }

  /* ---------- awards ---------- */
  function renderAwards() {
    var host = document.querySelector("[data-awards]");
    if (!host) return;
    var blurbs = {
      "Best Delegate": "The delegate who combined the strongest research, the sharpest diplomacy and the most influence over the final resolution.",
      "Best Speaker": "For the delegate whose speeches carried the room — clarity, command of the material, and persuasion under pressure.",
      "Most Likely to End Up in the UN": "For the delegate who treated the committee like the first rung of an actual diplomatic career.",
      "Verbal Mention": "Two per council, for delegates who stood out without taking the top two spots."
    };
    (C.awards || []).forEach(function (a, i) {
      host.appendChild(el("div", { class: "card reveal", "data-delay": String((i % 3) * 70) }, [
        el("h3", { text: a }),
        el("p", { text: blurbs[a] || "" })
      ]));
    });
  }

  /* ---------- sponsor tiers ---------- */
  function renderTiers() {
    var host = document.querySelector("[data-tiers]");
    if (!host) return;
    (C.sponsorTiers || []).forEach(function (t, i) {
      var ul = el("ul");
      t.benefits.forEach(function (b) { ul.appendChild(el("li", { text: b })); });
      host.appendChild(el("div", {
        class: "tier reveal" + (t.tier === "Platinum" ? " tier--platinum" : ""),
        "data-delay": String(i * 70)
      }, [
        el("div", { class: "council__code", text: "Tier 0" + (i + 1) }),
        el("h3", { text: t.tier }),
        el("div", { class: "tier__price", text: t.price }),
        ul
      ]));
    });
  }

  /* ---------- gallery -------------------------------------------
     Builds from C.gallery. Clicking a photo opens it full size in a
     dialog that closes on Escape, on the backdrop, or on the button,
     and returns focus to the thumbnail it came from.
     ---------------------------------------------------------------- */
  function renderGallery() {
    var host = document.querySelector("[data-gallery]");
    if (!host) return;
    var shots = C.gallery || [];

    if (!shots.length) {
      host.appendChild(el("div", { class: "notice", style: "max-width:var(--measure)" }, [
        el("span", { html: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M9 5v5M9 12.5v.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' }),
        el("div", { html: "<strong>No photographs yet.</strong> The Media &amp; PR team adds them by dropping files into <code>assets/img/gallery/</code> and listing them in <code>assets/js/config.js</code>. Instructions are in that file." })
      ]));
      return;
    }

    var grid = el("div", { class: "gallery" });
    var tile = 0;

    shots.forEach(function (a) {
      var photos = a.photos || [];
      if (!photos.length) return;

      if (photos.length > 3) {
        /* An album: one tile showing the cover and the count. */
        var btn = el("button", {
          class: "gallery__item gallery__item--album reveal--pop", type: "button",
          "data-delay": String((tile++ % 3) * 55),
          "aria-label": "Open album: " + a.album + ", " + photos.length + " photos"
        }, [
          el("span", { class: "gallery__stack" }, [
            el("img", { src: photos[0], alt: "", loading: "lazy", decoding: "async" }),
            el("span", { class: "gallery__count", text: photos.length + " photos" })
          ]),
          el("span", { class: "gallery__cap", text: a.album })
        ]);
        btn.addEventListener("click", function () { open(photos, 0, a.album, btn); });
        grid.appendChild(btn);
      } else {
        /* Three or fewer: show them individually. */
        photos.forEach(function (src, i) {
          var b = el("button", {
            class: "gallery__item reveal--pop", type: "button",
            "data-delay": String((tile++ % 3) * 55),
            "aria-label": "Enlarge photo " + (i + 1) + " from " + a.album
          }, [
            el("img", { src: src, alt: "", loading: "lazy", decoding: "async" }),
            el("span", { class: "gallery__cap", text: a.album })
          ]);
          b.addEventListener("click", function () { open(photos, i, a.album, b); });
          grid.appendChild(b);
        });
      }
    });
    host.appendChild(grid);

    /* ---- viewer: one photo at a time, with prev/next ---- */
    var dlg, list = [], idx = 0, label = "", lastFocus, imgEl, counterEl;

    function build() {
      dlg = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Photo viewer" });
      imgEl = el("img", { src: "", alt: "" });
      counterEl = el("figcaption");
      var prev = el("button", { class: "lightbox__nav lightbox__nav--prev", type: "button", "aria-label": "Previous photo", html: "&#8249;" });
      var next = el("button", { class: "lightbox__nav lightbox__nav--next", type: "button", "aria-label": "Next photo", html: "&#8250;" });
      var close = el("button", { class: "lightbox__x", type: "button", "aria-label": "Close", text: "×" });
      prev.addEventListener("click", function () { step(-1); });
      next.addEventListener("click", function () { step(1); });
      close.addEventListener("click", hide);
      dlg.addEventListener("click", function (e) { if (e.target === dlg) hide(); });
      document.addEventListener("keydown", function (e) {
        if (!dlg.classList.contains("is-open")) return;
        if (e.key === "Escape") hide();
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
      });
      dlg.appendChild(el("figure", {}, [imgEl, counterEl]));
      dlg.appendChild(prev); dlg.appendChild(next); dlg.appendChild(close);
      document.body.appendChild(dlg);
      dlg._close = close;
    }
    function paint() {
      imgEl.src = list[idx];
      imgEl.alt = label + ", photo " + (idx + 1) + " of " + list.length;
      counterEl.textContent = list.length > 1
        ? label + " · " + (idx + 1) + " / " + list.length
        : label;
      dlg.querySelectorAll(".lightbox__nav").forEach(function (n) {
        n.hidden = list.length < 2;
      });
    }
    function step(d) { idx = (idx + d + list.length) % list.length; paint(); }
    function open(photos, start, name, source) {
      if (!dlg) build();
      list = photos; idx = start; label = name; lastFocus = source;
      paint();
      dlg.classList.add("is-open");
      document.body.style.overflow = "hidden";
      dlg._close.focus();
    }
    function hide() {
      dlg.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
  }

  /* ---------- contact links ---------- */
  function contactLinks() {
    document.querySelectorAll("[data-email]").forEach(function (a) {
      a.href = "mailto:" + C.email;
    });
    document.querySelectorAll("[data-instagram]").forEach(function (a) {
      a.href = C.instagram; a.target = "_blank"; a.rel = "noopener";
    });
  }

  /* ---------- boot ---------- */
  function init() {
    buildNav(); buildFooter(); buildStrata(); fillConfig(); contactLinks();
    heroWord(); countdown(); renderCouncils(); renderSchedule();
    renderFees(); renderDeadline(); renderPeople(); renderOC(); renderAwards();
    renderTiers(); renderGallery();
    form(); chairForm(); reveals();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
