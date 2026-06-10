const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============ hero entrance (GSAP) ============
if (!prefersReducedMotion) {
  gsap.from("[data-reveal]", {
    y: 28,
    opacity: 0,
    duration: 0.9,
    ease: "expo.out",
    stagger: 0.12,
    delay: 0.15,
  });

  gsap.from("#terminal-window", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "expo.out",
    delay: 0.5,
  });
}

// ============ live clock ============
// Frank lives in Texas — show his local time (US Central)
const clockEl = document.getElementById("hero-clock");

const tickClock = () => {
  const centralTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "America/Chicago",
  });
  clockEl.textContent = `${centralTime} TX`;
};
tickClock();
setInterval(tickClock, 1000);

// ============ statement: auto fill-in, hold, fade back, repeat ============
const statement = document.getElementById("hero-statement");
const words = statement.textContent.trim().split(/\s+/);
statement.replaceChildren(
  ...words.flatMap((word, i) => {
    const span = document.createElement("span");
    span.className = "statement-word";
    span.textContent = word;
    return i < words.length - 1 ? [span, document.createTextNode(" ")] : [span];
  })
);

if (prefersReducedMotion) {
  gsap.set(".statement-word", { opacity: 1 });
} else {
  gsap
    .timeline({ repeat: -1, repeatDelay: 1.2, delay: 1 })
    .to(".statement-word", { opacity: 1, duration: 0.35, ease: "none", stagger: 0.07 })
    .to(".statement-word", { opacity: 0.12, duration: 0.3, ease: "none", stagger: 0.05 }, "+=2.5");
}

// ============ terminal ============
const output = document.getElementById("terminal-output");
const form = document.getElementById("terminal-form");
const input = document.getElementById("terminal-input");
const terminalBody = document.getElementById("terminal-body");

const TYPE_DELAY_MS = 14;

const scrollOutputDown = () => {
  terminalBody.scrollTop = terminalBody.scrollHeight;
};

const appendLine = (text, className) => {
  const line = document.createElement("div");
  line.className = className;
  line.textContent = text;
  output.appendChild(line);
  scrollOutputDown();
  return line;
};

// Typewriter via anime.js timing; falls back to instant for reduced motion.
const typeLines = (lines, className) => {
  if (prefersReducedMotion) {
    lines.forEach((text) => appendLine(text, className));
    return Promise.resolve();
  }

  return lines.reduce(
    (chain, text) =>
      chain.then(
        () =>
          new Promise((resolve) => {
            const line = appendLine("", className);
            const state = { count: 0 };
            anime({
              targets: state,
              count: text.length,
              duration: Math.max(text.length * TYPE_DELAY_MS, 60),
              easing: "linear",
              update: () => {
                line.textContent = text.slice(0, Math.round(state.count));
                scrollOutputDown();
              },
              complete: resolve,
            });
          })
      ),
    Promise.resolve()
  );
};

let isTyping = false;
let isMessageMode = false;

const sendMessage = async (text) => {
  if (!MESSAGE_ENDPOINT) {
    await typeLines(
      ["message box isn't wired up yet — email me instead (type contact)."],
      "out-text"
    );
    return;
  }

  try {
    // Apps Script web apps don't return CORS headers; no-cors fire-and-forget.
    await fetch(MESSAGE_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ message: text }),
    });
    await typeLines(["sent. frank will actually read this. thanks :)"], "out-text");
  } catch {
    await typeLines(["hm, that didn't send. try again in a bit?"], "out-text");
  }
};

const runCommand = async (raw) => {
  const text = raw.trim();
  if (!text || isTyping) return;

  if (isMessageMode) {
    isMessageMode = false;
    input.placeholder = "?";
    appendLine(`> ${text}`, "out-cmd");

    if (text.toLowerCase() === "cancel") {
      isTyping = true;
      await typeLines(["message cancelled."], "out-text");
      appendLine("", "out-text");
      isTyping = false;
      return;
    }

    isTyping = true;
    await sendMessage(text);
    appendLine("", "out-text");
    isTyping = false;
    return;
  }

  const cmd = text.toLowerCase();
  appendLine(`> ${cmd}`, "out-cmd");

  if (cmd === "clear") {
    output.replaceChildren();
    return;
  }

  if (cmd === "message") {
    isTyping = true;
    appendLine("── send frank a message ──", "out-title");
    await typeLines(
      [
        "type anything — feedback, a question, a hello.",
        "it lands directly in frank's inbox.",
        'hit enter to send, or type "cancel" to back out.',
      ],
      "out-text"
    );
    isTyping = false;
    isMessageMode = true;
    input.placeholder = "your message...";
    input.focus();
    return;
  }

  isTyping = true;
  const entry = FRANK_COMMANDS[cmd];

  if (entry) {
    appendLine(`── ${entry.title} ──`, "out-title");
    await typeLines(entry.body, "out-text");
  } else {
    await typeLines(FRANK_FALLBACK(cmd), "out-text");
  }

  appendLine("", "out-text");
  isTyping = false;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(input.value);
  input.value = "";
});

terminalBody.addEventListener("click", () => input.focus());

// suggestion chips below the terminal
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    runCommand(chip.dataset.cmd);
    input.focus();
  });
});

// pressing "?" anywhere focuses the terminal and shows help
document.addEventListener("keydown", (event) => {
  const typingInInput = document.activeElement === input;
  if (event.key === "?" && !typingInInput) {
    event.preventDefault();
    input.focus();
    runCommand("?");
  }
});

// greet on load so the terminal never looks dead
typeLines(['frank.sh booted. type "?" to start.'], "out-text");
