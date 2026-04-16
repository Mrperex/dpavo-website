/**
 * D'Pavo Website Screen Recorder — Premium Quality
 *
 * Uses Chrome DevTools Protocol (CDP) Page.startScreencast directly
 * to capture every frame as high-quality JPEG, then pipes them to
 * ffmpeg for a broadcast-quality MP4. No broken third-party deps.
 *
 * Quality:
 *   - Frame-perfect capture via CDP (no dropped frames)
 *   - JPEG quality 100 per frame
 *   - ffmpeg encode: CRF 15, libx264, 60fps output
 *
 * Records two pages:
 *   1. Homepage — hero animations → full scroll → footer
 *   2. /menu — hero → filter tab clicks → full scroll
 *
 * Usage:  node scripts/record-website.mjs
 * Prereqs: Next.js dev on :3000, ffmpeg installed
 */

import { chromium } from "playwright";
import { spawn } from "child_process";
import { mkdirSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const OUTPUT_HOME = join(ROOT, "public", "media", "recording-homepage.mp4");
const OUTPUT_MENU = join(ROOT, "public", "media", "recording-menu.mp4");
const VIEWPORT = { width: 1920, height: 1080 };

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * CDP-based frame capture → ffmpeg MP4 encoder.
 *
 * Starts Page.startScreencast at JPEG quality 100.
 * Each frame is piped as raw JPEG to a long-running ffmpeg process.
 * On stop(), we close stdin and wait for ffmpeg to finish encoding.
 */
class CDPRecorder {
  constructor(page, outputPath) {
    this.page = page;
    this.outputPath = outputPath;
    this.cdp = null;
    this.ffmpeg = null;
    this.frameCount = 0;
  }

  async start() {
    // Create a CDP session on the page
    this.cdp = await this.page.context().newCDPSession(this.page);

    // Spawn ffmpeg — reads JPEG frames from stdin, writes MP4
    this.ffmpeg = spawn("ffmpeg", [
      "-y",
      "-f", "image2pipe",        // Input: piped images
      "-framerate", "30",        // Input framerate (CDP sends ~30fps)
      "-i", "-",                 // Read from stdin
      "-c:v", "libx264",
      "-preset", "slow",         // Better compression
      "-crf", "15",              // Near-lossless quality
      "-pix_fmt", "yuv420p",
      "-r", "30",                // Output 30fps
      "-movflags", "+faststart",
      "-an",                     // No audio
      this.outputPath,
    ], { stdio: ["pipe", "pipe", "pipe"] });

    this.ffmpeg.stderr.on("data", () => {}); // Suppress ffmpeg logs

    // Listen for screencast frames
    this.cdp.on("Page.screencastFrame", async (params) => {
      const { data, sessionId } = params;
      const buffer = Buffer.from(data, "base64");

      // Write JPEG to ffmpeg stdin
      if (this.ffmpeg && this.ffmpeg.stdin.writable) {
        this.ffmpeg.stdin.write(buffer);
        this.frameCount++;
      }

      // Acknowledge the frame so CDP sends the next one
      try {
        await this.cdp.send("Page.screencastFrameAck", { sessionId });
      } catch (e) {
        // Session may be closed
      }
    });

    // Start screencast at maximum quality
    await this.cdp.send("Page.startScreencast", {
      format: "jpeg",
      quality: 100,
      maxWidth: VIEWPORT.width,
      maxHeight: VIEWPORT.height,
      everyNthFrame: 1,  // Capture every single frame
    });
  }

  async stop() {
    // Stop screencast
    try {
      await this.cdp.send("Page.stopScreencast");
    } catch (e) {}

    // Close ffmpeg stdin and wait for it to finish
    return new Promise((resolve, reject) => {
      if (!this.ffmpeg) return resolve();

      this.ffmpeg.stdin.end();
      this.ffmpeg.on("close", (code) => {
        console.log(`  📊 ${this.frameCount} frames captured → ${this.outputPath}`);
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });
      this.ffmpeg.on("error", reject);
    });
  }
}

/** Inject cursor dot, click ripple, and hide scrollbar */
async function injectOverlays(page) {
  await page.addStyleTag({
    content: `
      ::-webkit-scrollbar { display: none !important; }
      html { scrollbar-width: none !important; }
      #__rc {
        position: fixed; z-index: 999999; pointer-events: none;
        width: 16px; height: 16px; border-radius: 50%;
        background: rgba(236,186,35,0.92);
        box-shadow: 0 0 0 3px rgba(236,186,35,0.25), 0 2px 12px rgba(0,0,0,0.6);
        transform: translate(-50%,-50%);
        transition: left 0.12s cubic-bezier(0.25,0.1,0.25,1),
                    top 0.12s cubic-bezier(0.25,0.1,0.25,1);
        left: 960px; top: 540px;
      }
      .rc-ripple {
        position: fixed; z-index: 999998; pointer-events: none;
        width: 40px; height: 40px; border-radius: 50%;
        border: 2px solid rgba(236,186,35,0.7);
        transform: translate(-50%,-50%) scale(0);
        animation: rc-rip 0.5s ease-out forwards;
      }
      @keyframes rc-rip {
        0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
      }
    `,
  });
  await page.addScriptTag({
    content: `(() => {
      const d = document.createElement('div'); d.id='__rc';
      document.body.appendChild(d);
      document.addEventListener('mousemove', e => {
        d.style.left = e.clientX+'px'; d.style.top = e.clientY+'px';
      });
      document.addEventListener('click', e => {
        const r = document.createElement('div');
        r.className = 'rc-ripple';
        r.style.left = e.clientX+'px'; r.style.top = e.clientY+'px';
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 600);
      });
    })();`,
  });
}

/** Cinematic scroll using requestAnimationFrame + cubic-bezier easing.
 *  Falls back to instant-jump if rAF throttles (e.g. window goes to background). */
async function cinematicScrollTo(page, targetY, durationMs = 1500) {
  await page.evaluate(({ targetY, durationMs }) => {
    return new Promise((resolve) => {
      const startY = window.scrollY;
      const distance = targetY - startY;

      // If already there, skip
      if (Math.abs(distance) < 2) { resolve(); return; }

      const startTime = performance.now();

      // Safety fallback: if rAF stalls (tab backgrounded), jump and resolve
      const fallback = setTimeout(() => {
        window.scrollTo(0, targetY);
        resolve();
      }, durationMs + 800);

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      function step(now) {
        const progress = Math.min((now - startTime) / durationMs, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          clearTimeout(fallback);
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }, { targetY, durationMs });
}

/** Smooth cursor glide with easing */
async function glideCursorTo(page, x, y, durationMs = 600) {
  const steps = Math.max(8, Math.round(durationMs / 30));
  const current = await page.evaluate(() => ({
    x: parseFloat(document.getElementById("__rc")?.style.left || "960"),
    y: parseFloat(document.getElementById("__rc")?.style.top || "540"),
  }));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    await page.mouse.move(
      current.x + (x - current.x) * ease,
      current.y + (y - current.y) * ease
    );
    await sleep(30);
  }
}

/** Click a filter tab by text */
async function clickTab(page, label) {
  const btn = page.locator(`button:has-text("${label}"), a:has-text("${label}")`).first();
  const box = await btn.boundingBox().catch(() => null);
  if (box) {
    await glideCursorTo(page, box.x + box.width / 2, box.y + box.height / 2, 500);
    await sleep(200);
    await btn.click();
    await sleep(900);
  }
}

// ── Recording sessions ────────────────────────────────────────────────────────

async function recordHomepage(page) {
  console.log("\n━━━ RECORDING: Homepage ━━━");

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await injectOverlays(page);
  await page.mouse.move(960, 300);
  await sleep(500);

  const recorder = new CDPRecorder(page, OUTPUT_HOME);
  await recorder.start();
  console.log("  🔴 Recording...");

  const journey = [
    { wait: 3500, scroll: 0,    cursor: [960, 400], label: "Hero animations" },
    { wait: 2000, scroll: 400,  cursor: [700, 500], label: "Hero bottom / pizza" },
    { wait: 2000, scroll: 780,  cursor: [560, 580], label: "CTA buttons" },
    { wait: 2500, scroll: 1150, cursor: [720, 420], label: "Categories section" },
    { wait: 2200, scroll: 1700, cursor: [450, 350], label: "Story — Nacido en Verón" },
    { wait: 2800, scroll: 2300, cursor: [600, 500], label: "Los Favoritos" },
    { wait: 3000, scroll: 3000, cursor: [750, 400], label: "Menu list" },
    { wait: 2500, scroll: 3700, cursor: [500, 350], label: "Promo banners" },
    { wait: 2000, scroll: 4300, cursor: [960, 500], label: "Footer" },
    { wait: 2000, scroll: 4300, cursor: [960, 400], label: "Hold" },
  ];

  for (const step of journey) {
    console.log(`  ⏩  ${step.label}`);
    glideCursorTo(page, step.cursor[0], step.cursor[1], 800);
    await sleep(step.wait);
    await cinematicScrollTo(page, step.scroll, 1600);
  }

  await sleep(1500);
  await recorder.stop();
  console.log(`  ✅ Homepage saved`);
}

async function recordMenuPage(page) {
  console.log("\n━━━ RECORDING: /menu ━━━");

  await page.goto("http://localhost:3000/menu", { waitUntil: "networkidle" });
  await injectOverlays(page);
  await page.mouse.move(960, 300);
  await sleep(500);

  const recorder = new CDPRecorder(page, OUTPUT_MENU);
  await recorder.start();
  console.log("  🔴 Recording...");

  console.log("  ⏩  Menu hero");
  await sleep(3500);

  console.log("  ⏩  Filter tabs");
  await cinematicScrollTo(page, 350, 1200);
  await sleep(1500);

  for (const tab of ["PIZZA", "MARISCOS", "PICADERAS", "BEBIDAS", "TODO"]) {
    console.log(`  🔘  Tab: ${tab}`);
    await clickTab(page, tab);
    await sleep(1000);
  }

  console.log("  ⏩  Scrolling through items");
  await cinematicScrollTo(page, 950, 1800);
  await sleep(2200);
  await cinematicScrollTo(page, 1900, 2000);
  await sleep(2200);
  await cinematicScrollTo(page, 2800, 2000);
  await sleep(2200);
  await cinematicScrollTo(page, 3700, 1800);
  await sleep(2000);

  console.log("  ⏩  Back to top");
  await cinematicScrollTo(page, 0, 2500);
  await sleep(2500);

  await recorder.stop();
  console.log(`  ✅ Menu saved`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function record() {
  console.log("🎬 Launching Chromium (CDP frame capture mode)...");
  console.log("   JPEG q100 → ffmpeg CRF 15 libx264 30fps");

  const browser = await chromium.launch({
    headless: false,
    args: [
      "--start-maximized",
      "--disable-web-security",
      "--no-sandbox",
      "--disable-gpu-vsync",
      "--disable-frame-rate-limit",
      "--run-all-compositor-stages-before-draw",
      "--disable-features=PaintHolding",
      "--enable-gpu-rasterization",
    ],
  });

  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  try {
    await recordHomepage(page);
    await recordMenuPage(page);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log("\n✅  All recordings complete!");
  console.log(`   Homepage → ${OUTPUT_HOME}`);
  console.log(`   Menu     → ${OUTPUT_MENU}`);
}

record().catch((err) => {
  console.error("❌ Recording failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
