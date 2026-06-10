// SexyScroll-style smooth scroll: spring-based, critically damped.
// Wheel + keyboard inputs feed a virtual target; a SmoothDamp spring
// (critically damped, Game Programming Gems 4) chases it every frame.
// Tune via SMOOTH_TIME (seconds to settle) and MAX_SPEED (px/s).
class SexyScroll {
  constructor({ smoothTime = 0.5, maxSpeed = 4000 } = {}) {
    this.smoothTime = smoothTime;
    this.maxSpeed = maxSpeed;
    this.current = window.scrollY;
    this.target = window.scrollY;
    this.velocity = 0;
    this.lastTime = null;
    this.listeners = [];

    window.addEventListener("wheel", (e) => this.onWheel(e), { passive: false });
    window.addEventListener("keydown", (e) => this.onKey(e));
    window.addEventListener("resize", () => this.clampTarget());

    requestAnimationFrame((t) => this.frame(t));
  }

  maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  clampTarget() {
    this.target = Math.min(Math.max(this.target, 0), this.maxScroll());
  }

  onWheel(event) {
    if (event.ctrlKey) return; // pinch-zoom stays native
    event.preventDefault();
    const LINE_HEIGHT = 16;
    const multiplier = event.deltaMode === 1 ? LINE_HEIGHT : 1;
    this.target += event.deltaY * multiplier;
    this.clampTarget();
  }

  onKey(event) {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const page = window.innerHeight * 0.88;
    const KEY_STEPS = {
      ArrowDown: 80,
      ArrowUp: -80,
      PageDown: page,
      PageUp: -page,
      " ": event.shiftKey ? -page : page,
    };

    if (event.key === "Home") {
      this.target = 0;
    } else if (event.key === "End") {
      this.target = this.maxScroll();
    } else if (event.key in KEY_STEPS) {
      this.target += KEY_STEPS[event.key];
    } else {
      return;
    }

    event.preventDefault();
    this.clampTarget();
  }

  // Critically damped spring step (SmoothDamp).
  step(dt) {
    const omega = 2 / this.smoothTime;
    const x = omega * dt;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

    let change = this.current - this.target;
    const maxChange = this.maxSpeed * this.smoothTime;
    change = Math.min(Math.max(change, -maxChange), maxChange);
    const clampedTarget = this.current - change;

    const temp = (this.velocity + omega * change) * dt;
    this.velocity = (this.velocity - omega * temp) * exp;
    this.current = clampedTarget + (change + temp) * exp;

    // settle: kill sub-pixel drift
    if (Math.abs(this.target - this.current) < 0.05 && Math.abs(this.velocity) < 0.05) {
      this.current = this.target;
      this.velocity = 0;
    }
  }

  frame(time) {
    if (this.lastTime !== null) {
      const dt = Math.min((time - this.lastTime) / 1000, 1 / 30);
      const wasMoving = this.current !== this.target;

      // adopt native scroll (touch drag, anchor jumps, scrollbar)
      if (Math.abs(window.scrollY - Math.round(this.current)) > 1 && !wasMoving) {
        this.current = this.target = window.scrollY;
        this.velocity = 0;
      }

      if (wasMoving) {
        this.step(dt);
        window.scrollTo(0, this.current);
        this.listeners.forEach((fn) => fn(this));
      }
    }
    this.lastTime = time;
    requestAnimationFrame((t) => this.frame(t));
  }

  on(fn) {
    this.listeners.push(fn);
  }

  scrollTo(targetY) {
    this.target = targetY;
    this.clampTarget();
  }
}
