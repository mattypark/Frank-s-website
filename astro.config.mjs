// @ts-check
import { defineConfig } from "astro/config";

// Fully static output — Vercel auto-detects Astro and serves the build.
// No adapter needed since there is no SSR; the contact form posts to a
// Google Apps Script endpoint from the client.
export default defineConfig({
  site: "https://frank-s-website-psi.vercel.app",
  prefetch: true,
});
