// Custom cursor: dot snaps to the pointer, ring trails behind (GSAP lerp).
// Ring grows over interactive elements, shrinks on press.
// Skipped on touch devices and for reduced-motion users (native cursor stays).
(() => {
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hasFinePointer || reducedMotion) return;

  document.documentElement.classList.add("custom-cursor");

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.append(ring, dot);

  const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "expo.out" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "expo.out" });
  const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

  let isVisible = false;

  window.addEventListener("pointermove", (event) => {
    if (!isVisible) {
      isVisible = true;
      gsap.set([ring, dot], { x: event.clientX, y: event.clientY });
      gsap.to([ring, dot], { opacity: 1, duration: 0.25 });
    }
    ringX(event.clientX);
    ringY(event.clientY);
    dotX(event.clientX);
    dotY(event.clientY);
  });

  document.addEventListener("mouseleave", () => {
    isVisible = false;
    gsap.to([ring, dot], { opacity: 0, duration: 0.25 });
  });

  // grow over anything clickable or typeable
  const INTERACTIVE = "a, button, input, textarea, label, [role='button']";

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest(INTERACTIVE)) {
      gsap.to(ring, { scale: 1.8, duration: 0.3, ease: "expo.out" });
      gsap.to(dot, { scale: 0.5, duration: 0.3, ease: "expo.out" });
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest(INTERACTIVE)) {
      gsap.to([ring, dot], { scale: 1, duration: 0.3, ease: "expo.out" });
    }
  });

  window.addEventListener("pointerdown", () => {
    gsap.to(ring, { scale: 0.75, duration: 0.15, ease: "power2.out" });
  });

  window.addEventListener("pointerup", () => {
    gsap.to(ring, { scale: 1, duration: 0.35, ease: "expo.out" });
  });
})();
