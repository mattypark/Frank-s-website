// Command registry — one keyword in, one piece of Frank's life out.
// Placeholder copy for now; swap in Frank's real story per key.
const FRANK_COMMANDS = {
  "?": {
    title: "available commands",
    body: [
      "story    — the whole life story, start to now",
      "building — what I'm building right now",
      "message  — send me a message, goes straight to me",
      "contact  — how to reach me",
      "clear    — wipe the screen",
      "",
      "type any word above and hit enter.",
    ],
  },
  story: {
    title: "the whole story",
    body: [
      "[placeholder — Frank's full life story goes here]",
      "",
      "Born → grew up → the detours, the wins, the weird parts.",
      "From day one to today, the long version.",
    ],
  },
  building: {
    title: "what I'm building",
    body: [
      "[placeholder — Frank's current projects go here]",
      "",
      "The problem, the product, and why now.",
    ],
  },
  contact: {
    title: "reach me",
    body: [
      "email    — frank@example.com",
      "twitter  — @frank",
      "linkedin — /in/frank",
    ],
  },
};

const FRANK_FALLBACK = (cmd) => [
  `command not found: ${cmd}`,
  'type "?" to see what I answer.',
];

// Google Apps Script web app URL — messages land in Frank's Google Sheet.
// Deploy the script in GOOGLE_SHEET_SETUP.md, paste the /exec URL here.
const MESSAGE_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyj0usHWcAgpDDNeTLz6VmKFZsNZtqswhMphH0SYa7qH1_DYzfN_gSKme9rPLHv3z1h/exec";
