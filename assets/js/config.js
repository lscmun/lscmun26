/* ============================================================
   LSCMUN 2026 — SINGLE SOURCE OF TRUTH
   Edit this file only. Every page reads from it.
   ============================================================ */
window.LSCMUN = {

  /* ---- Conference identity ---- */
  name:        "LSCMUN 2026",
  longName:    "Life Sciences Model United Nations 2026",
  theme:       "Age of Consequences",
  department:  "Department of Life Sciences",
  institution: "Christ University, Bangalore",
  email:        "lscmun.26@gmail.com",
  instagram:    "https://instagram.com/lscmun.26",
  instagramTag: "@lscmun.26",

  /* ---- Dates ----------------------------------------------
     Not yet confirmed. When you have them, set `confirmed: true`
     and fill `startISO` / `endISO`. The countdown, the schedule
     page and every "when" on the site switch on automatically.
     --------------------------------------------------------- */
  dates: {
    confirmed: true,
    startISO:  "2026-11-28T09:00:00+05:30",
    endISO:    "2026-11-29T18:00:00+05:30",
    display:   "28th and 29th November 2026"
  },

  venue: {
    name: "Christ University",
    city: "Bangalore, Karnataka",
    note: "Exact campus and block to be announced"
  },

  /* ---- Scale (from the action plan) ---- */
  stats: {
    delegates:  "200–300",
    councils:   9,
    days:       2,
    perCouncil: "20–30"
  },

  /* ---- Registration ---------------------------------------
     PRICING SWITCHES ITSELF. Set `earlyBirdEndsISO` to the
     moment early bird closes and leave phase on "auto" — the
     site shows early-bird rates until that instant passes and
     late rates from then on, with no edit needed on the day.

     Leave earlyBirdEndsISO empty and it stays on early bird and
     prints "to be announced" as the deadline.

     phase: "auto"  — switch on the date below (recommended)
            "early" — force early-bird rates, ignore the date
            "late"  — force late rates, ignore the date

     NOTE: early-bird figures below are the LOWER end of the
     ranges in your action plan. Confirm before going live.
     --------------------------------------------------------- */
  fees: {
    phase: "auto",
    earlyBirdEndsISO: "",    // e.g. "2026-08-31T23:59:59+05:30"

    /* Per-category deadlines. Fill any of these to give that role its
       OWN early-bird cut-off; leave it empty and the role falls back to
       earlyBirdEndsISO above. Each role flips to its late price on its
       own date, independently of the others. */
    roleDeadlines: {
      delegate: "",
      chair:    "",
      press:    "",
      security: "",
      runner:   ""
    },

    currency: "₹",
    early: {
      label: "Early Bird",
      delegate: 850,
      chair:    700,
      security: 500,
      runner:   500,
      press:    499
    },
    late: {
      label: "Late Registration",
      delegate: 980,
      chair:    700,
      security: 500,
      runner:   500,
      press:    799
    }
  },

  /* ---- Payment -----------------------------------------------
     QR CODE ONLY, for now. The site deliberately shows no UPI ID
     and no bank details, because Finance has not confirmed the
     account yet — publishing an unconfirmed account number is how
     money goes to the wrong place.

     The fields below are kept but NOT displayed. When Finance
     confirms the account, fill them in and tell me to switch the
     details panel back on.
     ------------------------------------------------------------- */
  payment: {
    qrImage: "assets/img/upi-qr.png",   // drop your QR here (square PNG)

    // Not shown on the site until Finance confirms:
    showDetails: false,
    upiId:     "",
    payeeName: "",
    bank: { accountName: "", accountNumber: "", ifsc: "", bankName: "" }
  },

  /* ---- Google Sheet endpoint ------------------------------
     Paste the /exec URL from apps-script/Code.gs here after
     you deploy it. Until then the form shows a clear notice
     instead of silently failing.
     --------------------------------------------------------- */
  sheetEndpoint: "https://script.google.com/macros/s/AKfycbyRFHUqJWeVFP_ecKzaPkXtgGzNwb1vUdUzRfTYXtLRoNj5AbVxDzX4WYjoYbWdgrW1ZQ/exec",

  /* ---- Secretariat ---- */
  secretariat: [
    /* photo: drop a square image in assets/img/team/ and point to it,
       e.g. photo: "assets/img/team/chetan.jpg". Without one the card
       falls back to the person's initials. */
    { role: "Faculty In-charge",         name: "Dr. Chetan Kumar",      meta: "Department of Life Sciences", photo: "" },
    { role: "Faculty",                   name: "Dr. Vasantha V L",      meta: "",                            photo: "" },
    { role: "Secretary General",         name: "Bryl Lizen Dias",       meta: "3BscBtF",                     photo: "" },
    { role: "Deputy Secretary General",  name: "Shawn George Varghese", meta: "3BscBtF",                     photo: "" }
  ],

  /* ---- Organising Committee ---------------------------------
     Team sizes are NOT published — they are not confirmed yet.
     To show one, add `size: "Head + 4 members"` to that team and
     it appears on the card. Leave it out and nothing is shown.
     ------------------------------------------------------------ */
  oc: [
    { team: "Finance",                brief: "Final budget, auditing application funds, sponsor acquisition, and tracking every online and cash payment against the register." },
    { team: "Logistics",              brief: "Stationery quotations, placards, certificates, notepads, ID cards and mallets; council allocation and the master inventory." },
    { team: "Hospitality",            brief: "Catering across dietary needs and allergens, breakfast and snacks, the chief guest, and both ceremonies." },
    { team: "Media & PR",             brief: "The LSCMUN Instagram, application and allocation updates, background guide releases, and coverage across both days." },
    { team: "Research & Development", brief: "Rules of Procedure, chair and delegate training, council finalisation, and background guides. The academic backbone." },
    { team: "Design",                 brief: "The LSCMUN identity, council logos, placards, ID cards, certificates and the site's visual assets." },
    { team: "IT",                     brief: "This website and its upkeep — allocations, background guides, itinerary — plus forms, Wi-Fi and technical support in council." },
    { team: "Security & Runner",      brief: "Training every council's security and runner, discipline across both days, and guiding participants at the entrance." }
  ],

  /* ---- Gallery ----------------------------------------------
     Photos are grouped into albums. Each album needs a name and a
     list of image paths — no per-photo labels needed.

     ADDING PHOTOS:
     1. Put the files in  assets/img/gallery/
     2. Add an album below with the paths
     3. Save. The page builds itself.

     HOW IT DISPLAYS:
     - An album with MORE THAN 3 photos shows as one album tile
       (cover image + photo count) that opens into a viewer.
     - An album with 3 or fewer shows those photos individually,
       so a couple of stray shots do not need a whole album.

     Keep files under ~400 KB each. Resize to about 1600px on the
     long edge first, or the page crawls on conference Wi-Fi.

     gallery: [
       { album: "Opening Ceremony", photos: [
           "assets/img/gallery/opening-01.jpg",
           "assets/img/gallery/opening-02.jpg",
           "assets/img/gallery/opening-03.jpg",
           "assets/img/gallery/opening-04.jpg"
       ]},
       { album: "UNSC", photos: [
           "assets/img/gallery/unsc-01.jpg"
       ]}
     ]
     ------------------------------------------------------------ */
  gallery: [
    // No photos yet — the page shows a placeholder until the first
    // album is added here.
  ],

  awards: ["Best Delegate", "Best Speaker", "Most Likely to End Up in the UN", "Verbal Mention"],

  sponsorTiers: [
    { tier: "Platinum", price: "[PRICE TBD]", benefits: ["Title sponsor", "Logo on all publicity material", "Banner during the conference", "Mention at the opening and closing ceremony"] },
    { tier: "Gold",     price: "[PRICE TBD]", benefits: ["Logo on certificates", "Social media promotions", "Banner at the venue"] },
    { tier: "Silver",   price: "[PRICE TBD]", benefits: ["Social media mention"] }
  ]
};
