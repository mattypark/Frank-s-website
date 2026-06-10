// ============ smooth scroll (Lenis + GSAP ScrollTrigger) ============
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lenis = new Lenis({ smoothWheel: !prefersReducedMotion });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

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
}

// ============ live clock ============
const clockEl = document.getElementById("hero-clock");

const tickClock = () => {
  clockEl.textContent = new Date().toLocaleTimeString("en-US", { hour12: false });
};
tickClock();
setInterval(tickClock, 1000);

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

const runCommand = async (raw) => {
  const cmd = raw.trim().toLowerCase();
  if (!cmd || isTyping) return;

  appendLine(`> ${cmd}`, "out-cmd");

  if (cmd === "clear") {
    output.replaceChildren();
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

// ============ scroll-to-terminal helpers ============
const scrollToTerminal = () => {
  lenis.scrollTo("#terminal", { duration: prefersReducedMotion ? 0 : 1.2 });
  setTimeout(() => input.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 1200);
};

document.getElementById("scroll-cue").addEventListener("click", scrollToTerminal);

document.getElementById("hint-key").addEventListener("click", () => {
  scrollToTerminal();
  setTimeout(() => runCommand("?"), prefersReducedMotion ? 50 : 1300);
});

// pressing "?" anywhere on the hero jumps into the terminal
document.addEventListener("keydown", (event) => {
  const typingInInput = document.activeElement === input;
  if (event.key === "?" && !typingInInput) {
    event.preventDefault();
    scrollToTerminal();
    setTimeout(() => runCommand("?"), prefersReducedMotion ? 50 : 1300);
  }
});

// terminal window slides up as you reach page 2
if (!prefersReducedMotion) {
  gsap.from("#terminal-window", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "expo.out",
    scrollTrigger: {
      trigger: "#terminal",
      start: "top 70%",
    },
  });
}

// greet on load so the terminal never looks dead
typeLines(['frank.sh booted. type "?" to start.'], "out-text");
