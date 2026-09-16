# Deploying LSCMUN 2026

You have a domain from GoDaddy and a folder of files. This gets one onto the other.

**Read this first:** there is nothing to "build". This site is plain HTML, CSS and
JavaScript. Whatever host you use, you are uploading the `lscmun-site` folder as-is.
No `npm install`, no build command, no server.

---

## Which host?

**Use Netlify.** Both options below work, but for a student team that will be editing
this during a live conference, Netlify wins on the things that matter:

|  | Netlify | GitHub Pages |
|---|---|---|
| Deploy without knowing Git | **Yes** — drag the folder onto the page | No |
| Time to first deploy | ~2 minutes | ~10 minutes |
| Undo a bad change | **One click**, instantly | Push a revert commit |
| Preview before going live | Yes | No |
| HTTPS on your domain | Automatic | Automatic |
| Cost for this site | Free | Free |

The one-click rollback is the real argument. At 7am on conference day, when someone
edits a price wrong, you want a button that says "restore previous version" — not a
Git lesson.

---

# Option A — Netlify (recommended)

## A1. Put the site online (5 minutes)

1. Go to **netlify.com** and sign up. The free tier is all you need.
2. On the dashboard, find the box that says **"Deploy manually"** / **"Drag and drop
   your site folder here"**.
3. Drag the entire **`lscmun-site`** folder onto it.
   - Drag the folder that *contains* `index.html`. Not its parent, not the files
     individually. If you get a "page not found" after deploying, this is why.
4. Wait ~20 seconds. Netlify gives you a live URL like
   `random-name-123456.netlify.app`. **Your site is now on the internet.**
5. Click **Site configuration → Change site name** and set something sensible like
   `lscmun`. Your URL becomes `lscmun.netlify.app`.

Test it properly at this point — every page, the registration form, on a phone —
before you attach the real domain.

## A2. Connect your GoDaddy domain

In Netlify: **Domain management → Add a domain** → type your domain (e.g.
`lscmun.in`) → **Verify** → **Add domain**.

Netlify then shows you one of two paths. **Take the second one.**

### The easy path: let Netlify run your DNS

Netlify will show you **four nameservers**, something like:

```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

Copy them exactly as Netlify shows them — **do not use the ones printed above**,
yours will differ.

Then in **GoDaddy**:

1. Log in → **My Products** → find your domain → **DNS** (or **Manage DNS**)
2. Scroll to **Nameservers** → **Change** → **I'll use my own nameservers**
3. Paste in Netlify's four nameservers, one per row
4. **Save**. GoDaddy will warn you this changes where your DNS is managed. That is
   exactly what you want. Confirm.

### If you would rather keep DNS at GoDaddy

Skip the nameserver change. In GoDaddy's **DNS → Records**, add what Netlify's
domain panel tells you to — typically an **A record** for `@` pointing at Netlify's
load balancer IP, and a **CNAME** for `www` pointing at `your-site.netlify.app`.

**Use the exact values Netlify shows you in its own domain panel.** IP addresses
change over time and anything written in a document like this one goes stale. The
panel is the source of truth.

Delete GoDaddy's default "parked page" records first, or they will fight yours.

## A3. Turn on HTTPS

Back in Netlify: **Domain management → HTTPS → Verify DNS configuration**, then
**Provision certificate**. It is free and automatic.

DNS changes take **anywhere from 10 minutes to 48 hours** to spread. Usually under an
hour. If the domain shows an error at first, wait before changing anything — most
"it's broken" moments here are just DNS still propagating.

Once it works, enable **Force HTTPS** so `http://` visitors get redirected.

---

# Option B — GitHub Pages

Use this if your IT team already lives in GitHub.

## B1. Create the repository

1. Sign in at **github.com** → **New repository**
2. Name it `lscmun-website`, set it **Public**, click **Create**
3. On the empty repo page click **uploading an existing file**
4. Drag in **the contents of `lscmun-site`** — `index.html`, the other pages, and the
   `assets` and `apps-script` folders.
   - Upload the *contents*, not the folder itself. `index.html` must sit at the top
     level of the repo, or the site will 404.
5. Write "Initial site" in the commit box → **Commit changes**

## B2. Switch Pages on

**Settings → Pages** → under *Build and deployment*, Source = **Deploy from a
branch**, Branch = **main**, folder = **/ (root)** → **Save**.

Wait a minute or two. Your site appears at
`https://<username>.github.io/lscmun-website/`.

## B3. Connect the GoDaddy domain

**Settings → Pages → Custom domain** → enter `lscmun.in` → **Save**. This creates a
file called `CNAME` in your repo. Leave it alone.

Then in **GoDaddy → DNS → Records**:

- Four **A records** for host `@`, pointing at GitHub Pages' four IP addresses
- One **CNAME** record, host `www`, pointing at `<username>.github.io`

**Get the four IPs from GitHub's own "Managing a custom domain" documentation**
rather than from any copy of them floating around — they have changed before.

Back in **Settings → Pages**, tick **Enforce HTTPS** once it becomes available (it
can take a few hours to appear).

---

# Updating the site afterwards

You will be doing this constantly — allocations, background guides, the itinerary,
gallery photos. Here is the loop.

## What file do I edit?

**You will almost never touch the HTML.** Nearly everything lives in two files:

| I want to change… | Edit this |
|---|---|
| Prices, deadlines, dates | `assets/js/config.js` → `fees`, `dates` |
| UPI details, bank account | `assets/js/config.js` → `payment` |
| Email, Instagram | `assets/js/config.js` → top of file |
| Secretariat names, headshots | `assets/js/config.js` → `secretariat` |
| OC teams | `assets/js/config.js` → `oc` |
| Sponsor tiers | `assets/js/config.js` → `sponsorTiers` |
| **Gallery photos** | `assets/js/config.js` → `gallery` |
| Councils, agendas, SDG tags | `assets/js/data.js` → `LSCMUN_COUNCILS` |
| The two-day itinerary | `assets/js/data.js` → `LSCMUN_SCHEDULE` |
| Page wording | the relevant `.html` file |
| Colours, fonts, spacing | `assets/css/site.css` (tokens at the top) |

Deleting a council from `data.js` removes it from the councils page, the home page
preview **and** all three dropdowns on the registration form. There is no second list
to keep in sync.

## Adding gallery photos

Photos are grouped into **albums**. Individual photos need no labels.

1. Put the image files in `assets/img/gallery/`
2. Open `assets/js/config.js`, find `gallery: [`, and add an album:

```js
gallery: [
  { album: "Opening Ceremony", photos: [
      "assets/img/gallery/opening-01.jpg",
      "assets/img/gallery/opening-02.jpg",
      "assets/img/gallery/opening-03.jpg",
      "assets/img/gallery/opening-04.jpg",
      "assets/img/gallery/opening-05.jpg"
  ]},
  { album: "UNSC", photos: [
      "assets/img/gallery/unsc-01.jpg",
      "assets/img/gallery/unsc-02.jpg"
  ]}
],
```

3. Redeploy.

**How it displays.** An album with **more than 3 photos** becomes a single album tile
— cover image, the album name, and a "5 photos" badge — which opens into a viewer you
page through with the arrows or the left/right keys. An album with **3 or fewer**
shows those photos individually in the grid, so a couple of stray shots do not need a
whole album of their own.

**Resize before uploading.** Straight-off-a-phone images are 5–8 MB each; thirty of
those makes the page unusable on conference Wi-Fi. Aim for about 1600px on the long
edge and under 400 KB. Any free bulk image resizer will do it.

Name the files in a way that sorts correctly — `opening-01`, `opening-02`, not
`opening-1`, `opening-10` — since they appear in the order you list them.

## Pushing the change live

### If you deployed by dragging (Netlify)

**Netlify → Deploys → Drag and drop your site folder here** — drop the whole
`lscmun-site` folder again. New version live in about 20 seconds. The old one stays in
the deploy list.

### If you connected Git (either host)

```bash
git add .
git commit -m "Update delegate fees and add gallery photos"
git push
```

Live in about a minute. This is worth setting up if more than one person edits.

## When it goes wrong

**"I updated it but I still see the old version."** Almost always browser cache. Hard
refresh with **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac). Check on your phone
on mobile data — if it is correct there, it was cache, and it will sort itself out for
everyone else within a few hours.

**"The whole site broke after my edit."** You almost certainly removed a comma or a
`}` in `config.js` or `data.js`. One bad character stops the entire file loading, so
the nav, footer and councils all vanish at once. Open the page, press **F12**, click
**Console** — the red error names the file and the line number.

**On Netlify:** *Deploys* → find the last version that worked → **Publish deploy**.
The site is restored instantly while you fix the file properly. Use this. It is the
reason to be on Netlify.

## Before every deploy

- Open `index.html` through a local server, not by double-clicking it —
  `python -m http.server 5178 --directory lscmun-site`, then visit
  `http://localhost:5178`. Opening the file directly will not work, because the shared
  nav, footer and council lists are loaded by JavaScript and browsers block that on
  `file://` URLs.
- Click through every page
- Check it on a phone
- Submit the registration form once to confirm it still reaches the Sheet

---

## Still to do before launch

From `README.md`, unchanged by deployment:

1. **UPI ID and bank details** — `config.js` → `payment`
2. **UPI QR image** — save as `assets/img/upi-qr.png`
3. **Google Sheet endpoint** — deploy `apps-script/Code.gs`, paste the `/exec` URL
   into `config.js` → `sheetEndpoint`
4. **Prices and per-category deadlines** — `config.js` → `fees`
5. **Conference dates** — `config.js` → `dates`

The registration form will show a clear "not connected yet" notice until #3 is done,
rather than silently losing submissions. But do not announce the site before it is
connected.
