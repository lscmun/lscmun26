/* ============================================================
   LSCMUN 2026 — COUNCILS
   The final 9 councils. Every page that lists councils reads
   from here.
   ============================================================ */
window.LSCMUN_COUNCILS = [
  {
    code: "WCC", name: "Wildlife Conservation Cell",
    blurb: "A specialised cell on the front line between human expansion and the species it displaces — conflict, trafficking, and disease crossing from wild populations into ours.",
    agendas: [
      "Examining De-extinction and Genetic Technologies as Tools for Modern Conservation.",
      "Wildlife Without Borders: Addressing Transnational Wildlife Trafficking and Organised Environmental Crime."
    ],
    sdgs: [15, 16, 17]
  },
  {
    code: "WHO", name: "World Health Organization",
    blurb: "The global health authority, meeting after a pandemic that tested every assumption it held — and facing resistance, misinformation and machine diagnosis all at once.",
    agendas: [
      "Ensuring Equitable Access to Life Saving Medicines, Vaccines and Emerging Health Technologies",
      "Examining emerging anti-ageing technologies and longevity research while addressing their accessibility."
    ],
    sdgs: [3, 6, 17]
  },
  {
    /* Replaced UNEP. SDGs pending — Bryl said these will be provided later. */
    code: "IPC", name: "International Press Corps",
    blurb: "Through three wings — Journalism, Caricaturing and Photography — the press team captures the debates, negotiations, personalities and moments that shape the entire MUN, turning the conference into a story that extends beyond the committee rooms.",
    agendas: [
      "Journalism — reporting on significant developments and writing stories around the proceedings.",
      "Caricaturing — using creativity and satire to portray the lighter and more thought-provoking sides of the conference.",
      "Photography — capturing the memorable moments through the lens."
    ],
    sdgs: [],
    note: "SDGs to be announced"
  },
  {
    code: "UNODC", name: "United Nations Office on Drugs and Crime",
    blurb: "Organised crime has moved into laboratories, server rooms and forests. This office follows it there.",
    agendas: [
      "Preventing the Illicit Use and Trafficking of Biological Materials and Technologies",
      "The Rise of Synthetic Drugs"
    ],
    sdgs: [3, 15, 16]
  },
  {
    code: "IAEA", name: "International Atomic Energy Agency",
    blurb: "The atom as medicine and the atom as threat, argued in the same room — with waste that outlives every delegate in it by a hundred thousand years.",
    agendas: [
      "Addressing Inequality in Access to Nuclear Technology and Energy Independence",
      "Addressing the long-term environmental and safety challenges of nuclear waste as countries expand their reliance on nuclear energy."
    ],
    sdgs: [3, 7, 9]
  },
  {
    code: "UNOOSA", name: "United Nations Office for Outer Space Affairs",
    blurb: "The only council whose consequences are already in orbit. Debris, biology beyond Earth, and the ethics of settling somewhere no law yet reaches.",
    agendas: [
      "Regulating Commercial Competition and the Privatisation of Outer Space",
      "Navigating the Rise of Geopolitical Rivalries and the Threat of Conflict in Outer Space"
    ],
    sdgs: [3, 9, 17]
  },
  {
    code: "UNSC", name: "United Nations Security Council",
    blurb: "Fifteen seats, five vetoes, and the authority to bind every member state. The most demanding council at LSCMUN — and the only one chaired by a single chairperson.",
    agendas: [
      "Addressing the rise of simultaneous conflicts and the failure of international mechanisms to maintain peace.",
      "Climate and Resource Scarcity as Emerging Threats to International Peace and Security"
    ],
    sdgs: [3, 16, 17],
    note: "Single chairperson"
  },
  {
    code: "UNCSW", name: "United Nations Commission on the Status of Women",
    blurb: "Where the gap is measured in clinical trials that never enrolled women, and in laboratories that never promoted them.",
    agendas: [
      "Addressing the growing use of artificial intelligence for harassment and exploitation of women, and strengthening international mechanisms for digital protection.",
      "Addressing algorithmic gender bias"
    ],
    sdgs: [3, 5, 10]
  },
  {
    code: "ECOSOC", name: "United Nations Economic and Social Council",
    blurb: "The council that has to pay for everything the others promise — health systems, water, adaptation finance, and the jobs automation is removing.",
    agendas: [
      "Deep-Sea Mining: Economic Development vs. Environmental Consequences",
      "Examining how the rise of digital currencies could affect developing economies, international trade and the traditional financial system."
    ],
    sdgs: [2, 3, 15, 17]
  }
];

/* SDG reference — used for the tags on every council card. */
window.LSCMUN_SDG = {
  2:  "Zero Hunger",
  3:  "Good Health and Well-being",
  5:  "Gender Equality",
  6:  "Clean Water and Sanitation",
  7:  "Affordable and Clean Energy",
  8:  "Decent Work and Economic Growth",
  9:  "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  12: "Responsible Consumption and Production",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice and Strong Institutions",
  17: "Partnerships for the Goals"
};

/* Roles a participant can register for. */
window.LSCMUN_ROLES = [
  { key: "delegate", name: "Delegate",    brief: "Represents a country other than your own and argues from its position, not yours. Assigned to one council for both days." },
  { key: "press",    name: "Press",       brief: "The International Press Corps has three wings — Journalism, Caricaturing and Photography — covering proceedings across all councils." },
  { key: "security", name: "Security",    brief: "Stationed in a council to keep proceedings orderly, and accompanies any delegate who leaves the room. One per council." },
  { key: "runner",   name: "Runner",      brief: "Carries diplomatic notes between delegates and reads them to ensure decorum is maintained. One per council." }
];

/* Two-day itinerary from the action plan. */
window.LSCMUN_SCHEDULE = [
  { day: "Day 1", items: [
    ["7:00 — 8:00",   "Registrations"],
    ["8:00 — 9:30",   "Opening Ceremony"],
    ["9:40 — 9:55",   "In-council breakfast"],
    ["10:00 — 12:40", "Council Session 1"],
    ["12:40 — 13:00", "Lunch batch 1"],
    ["13:00 — 14:00", "Lunch batch 2"],
    ["14:05 — 15:05", "Council Session 2"],
    ["15:05 — 16:25", "Lobbying and merging"],
    ["16:25 — 16:40", "Snack break"],
    ["16:40 — 18:00", "Council Session 3"],
    ["18:00 — 20:00", "Socials"]
  ]},
  { day: "Day 2", items: [
    ["7:30 — 7:45",   "Reporting time"],
    ["7:45 — 9:00",   "Council Session 1"],
    ["9:00 — 9:20",   "In-council breakfast"],
    ["9:20 — 11:30",  "Council Session 2"],
    ["11:30 — 12:00", "Council Session 3"],
    ["11:55 — 13:00", "Lunch 1"],
    ["13:05 — 14:05", "Lunch 2"],
    ["14:05 — 15:15", "Lobbying and merging"],
    ["15:15 — 15:30", "Snack break"],
    ["15:30 — 17:00", "Council Session 4"],
    ["17:00 — 17:15", "Dispersal from councils"],
    ["17:30 — 19:00", "Closing Ceremony"]
  ]}
];
