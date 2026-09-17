# LSCMUN 2026 — conference website

Static site. No build step, no npm, no server. Eight HTML pages plus three
JavaScript files. Any text editor and a browser is the whole toolchain.

**Not deployed yet** — waiting on the design team. See `DEPLOY.md` when you are ready.

---

## Before it goes live

Everything below is a placeholder. Work down the list.

| # | What | Where |
|---|------|-------|
| 1 | **UPI QR image** — square PNG | `assets/img/upi-qr.png` |
| 2 | **Google Sheet endpoint** | `assets/js/config.js` → `sheetEndpoint` (see below) |
| 3 | Fee figures | `assets/js/config.js` → `fees` |
| 4 | Deadline dates per category | `assets/js/config.js` → `fees.roleDeadlines` |
| 5 | Conference dates | `assets/js/config.js` → `dates` |
| 6 | Trim councils from 13 to the final 9–11 | `assets/js/data.js` |
| 7 | Secretariat headshots | `assets/img/team/` + `config.js` → `secretariat` |
| 8 | Gallery photos | `assets/img/gallery/` + `config.js` → `gallery` |

Contact details are already set: **lscmun.26@gmail.com** and **@lscmun.26**.

Until #1 is done the payment box shows a dashed placeholder telling you what to
drop in. Until #2 is done the form shows a notice instead of failing silently.

**Bank details are deliberately not shown.** The registration page displays the QR
code and nothing else, because Finance has not confirmed the account. The `upiId`,
`payeeName` and `bank` fields still exist in `config.js` with `showDetails: false` —
fill them in and say the word when Finance confirms, and the details panel comes back.

---

## Editing content

**You almost never need to touch the HTML.** Two files hold the content:

### `assets/js/config.js`
Dates, fees, payment details, contact details, the Secretariat, the eight OC
teams, awards and sponsor tiers. One value, one place — change it here and it
updates on every page that shows it.

Dates are the clearest example. Right now:

```js
dates: {
  confirmed: false,
  display: "Dates to be announced",
  ...
}
```

When you have the real dates, set `confirmed: true` and fill in `startISO` and
`endISO`. A live countdown appears on the home page automatically.

### Early bird → late pricing switches itself

You do not have to edit anything on the night early bird closes. Set the closing
moment once:

```js
fees: {
  phase: "auto",
  earlyBirdEndsISO: "2026-08-31T23:59:59+05:30",
  ...
}
```

The fee table, its caption and the deadline line on the registration page all
show early-bird rates until that instant passes, then late rates from then on.
Left empty, it stays on early bird and prints "a date to be announced".

`phase` can be forced to `"early"` or `"late"` if you ever need to override the
date — but `"auto"` is what you want.

### `assets/js/data.js`
The 13 councils, their agendas and SDG tags; the five participant roles; and the
two-day itinerary.

To drop a council, delete its whole `{ ... }` block. The councils page, the home
page preview and the three preference dropdowns on the registration form all
update themselves — there is no separate list to keep in sync.

---

## Connecting the Google Sheet

The registration form posts to a Google Apps Script bound to your Sheet.

1. Open your Sheet → **Extensions → Apps Script**
2. Delete whatever is in `Code.gs` and paste in `apps-script/Code.gs`
3. Set `SHEET_ID` at the top. It is the long string in your Sheet's URL:
   `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`
4. Choose `setup` in the function dropdown and press **Run**. Authorise when
   Google asks. This builds all seven tabs (see below).
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** ← required, or submissions are rejected
6. Copy the `/exec` URL it gives you into `sheetEndpoint` in `config.js`

Test it with the `testSubmission` function in the Apps Script editor before you
announce the site — it writes a fake row without touching the website.

### How the registrations are stored

Running `setup` builds seven tabs:

| Tab | What it is |
|---|---|
| **All Registrations** | The master. Every submission lands here, one row each. **This is the only tab anyone should type in.** |
| Delegates, Chairpersons, Press, Security, Runners | One per category — **live views**, not copies. A `QUERY` formula filters the master, so they update the instant it changes. Do not type in these; anything entered gets overwritten. |
| **Summary** | Live counts — registrations and verified payments per category, money collected vs outstanding, and demand per council so Logistics can see which rooms are oversubscribed. |

Nothing is duplicated, so nothing can drift out of sync. Finance marks a payment
verified once, in the master, and it is correct everywhere.

**Per registration you get:** all their details, a category-prefixed reference
(`LSC26-DEL-0007` — the `DEL` tells Finance the category without a lookup), their UTR
number, and a link to their payment screenshot in a Drive folder called *LSCMUN 2026 —
Payment Proofs*. Three columns — *Payment verified*, *Allocated council* and
*Allocated country* — are left blank for Finance and Logistics.

`setup` is safe to re-run at any time. It rebuilds the views and the summary without
touching a single row of registration data. Re-run it after you trim the councils
from 13 down to the final 9–11, and update `COUNCIL_CODES` at the bottom of the script
to match.

If you redeploy after editing the script, use **Manage deployments → edit → New
version**, not a new deployment — a new deployment gives you a new URL and you
would have to update `config.js` again.

---

## Hosting

Anything that serves static files works. All three of these are free:

**GitHub Pages** — push this folder to a repo, then Settings → Pages → deploy
from `main`. Site appears at `username.github.io/reponame`.

**Netlify / Vercel** — drag the folder onto their dashboard. Done.

**College hosting** — upload the folder over FTP. It is plain HTML.

A custom domain (`lscmun.in` or similar) can be pointed at any of them.

### Running it locally

```bash
python -m http.server 5178 --directory lscmun-site
```

Then open `http://localhost:5178`. Opening the HTML files directly with
`file://` will not work — the shared nav, footer and council lists are loaded by
JavaScript and browsers block that on `file://`.

---

## File map

```
lscmun-site/
├── index.html          Home — hero, theme, stats, SDGs, council preview
├── councils.html       All 13 councils, every agenda, SDG tags
├── register.html       Roles, fees, QR payment, registration form
├── secretariat.html    Our Team — faculty, Secretariat, 8 OC teams, council roles
├── schedule.html       Two-day itinerary + what each block means
├── gallery.html        Photo albums
├── resources.html      What is MUN, how MUN works, vocabulary, awards, FAQ
├── sponsors.html       Platinum / Gold / Silver tiers
├── assets/
│   ├── css/site.css    All styling. Brand tokens at the very top.
│   ├── js/config.js    ← conference details, fees, team, gallery. Edit this.
│   ├── js/data.js      ← councils, roles, schedule. Edit this.
│   ├── js/site.js      Shared behaviour. You should not need to edit this.
│   └── img/
│       ├── gallery/    Gallery photos go here
│       └── team/       Secretariat headshots go here
├── apps-script/
│   └── Code.gs         Paste into your Sheet's Apps Script editor
├── README.md           This file
└── DEPLOY.md           Netlify / GitHub Pages + GoDaddy, and how to update
```

---

## Design notes

**Palette** — first sampled from the five logo files, then reconciled with the
design team's colour sheet. Every value in the stylesheet is now one of theirs;
nothing is invented.

| Token | Hex | Role |
|-------|-----|------|
| `--espresso` | `#2E2317` | page ground (dark pages) |
| `--ground-raised` | `#382F2A` | lifted sections and cards |
| `--ground-deep` | `#241C13` | footer, hero vignette, nav panel |
| `--bone` | `#F1EACD` | body text on dark; raised surface on light |
| `--accent` | `#8EAEA9` | **CTAs, eyebrows, current nav item** |
| `--cocoa` / `--olive` / `--moss` / `--sage` | `#583D28` `#565536` `#797857` `#747665` | strata rule, card rules, tags |

The accent is the one non-earth hue on the sheet. Against a palette this warm it
is the only colour that can carry a call to action without shouting, and it
holds 6.4:1 on the ground. On the light register page the accent switches to the
deep olive `#565536`, which needs the opposite polarity to work.

The register page runs `#FAF6E3` ground / `#F1EACD` raised / `#D6CCA8` deep.

**If the palette changes again:** the tokens are the first 30 lines of
`site.css`. Swapping them repaints the whole site — but re-check contrast
afterwards, because several alpha values were tuned to specific pairings.

**The strata rule** — the five-band divider between sections reads the palette as
sediment layers. Consequence is time made visible, which is the theme in one
graphic device. Band colours are mid-tones only so no band disappears into
either the light or the dark background.

**The hero** — deliberately quiet. The emblem is the hero; the theme is stated
once at a civil size and left alone. The letters of "Consequence" rise in
sequence on load, 8px and 34ms apart — enough to feel alive, small enough that
nothing moves out of alignment. Disabled entirely under `prefers-reduced-motion`.

**Type** — Fraunces for display (organic, slightly botanical, matches the
laurel), Instrument Sans for body, JetBrains Mono for council codes, times, fees
and SDG tags. The mono is doing real work: those are codes and data, not
decoration.

**The register page is inverted** to the bone background while every other page
is dark. The site is soil; the act of joining it is light. It also makes a long
form considerably easier to fill in.

**Motion is deliberately minimal** and uses a single token — `riseIn`, an 8px
fade-and-rise — everywhere, so the whole site moves with one rhythm:

- Opening any tab, the page header's lines rise in sequence, ~70ms apart
- The browser cross-fades between pages where it supports view transitions
- Content below the fold fades up as it scrolls in
- The letters of "Consequence" rise in sequence on the home page

All of it is disabled under `prefers-reduced-motion`. Note that if you preview
with reduced motion enabled in your OS, you will correctly see no animation at
all.

**Headcounts are not published.** OC team sizes were removed because they are
not confirmed. To publish one, add `size: "Head + 4 members"` to that team in
`config.js` and it appears on the card; leave it out and nothing is shown.

**Accessibility** — every text pair meets WCAG AA (4.5:1) in both the dark and
light schemes; the faint label colour was measured and adjusted specifically to
clear it. Skip link, visible focus rings, labelled form fields with inline errors
and a focusable error summary, 48px minimum touch targets, keyboard-operable
mobile menu.
