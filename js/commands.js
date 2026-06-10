// Command registry — one keyword in, one piece of Frank's life out.
// Placeholder copy for now; swap in Frank's real story per key.
const FRANK_COMMANDS = {
  "?": {
    title: "available commands",
    body: [
      "crazy    — the whole life story, start to now",
      "startup  — what I'm building right now",
      "contact  — how to reach me",
      "clear    — wipe the screen",
      "",
      "type any word above and hit enter.",
    ],
  },
  crazy: {
    title: "the whole story",
    body: [
      "[placeholder — Frank's full life story goes here]",
      "",
      "Born → grew up → the detours, the wins, the weird parts.",
      "From day one to today, the long version.",
    ],
  },
  startup: {
    title: "what I'm building",
    body: [
      "[placeholder — Frank's current startup goes here]",
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
