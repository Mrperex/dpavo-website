// scripts/scan-incredifulls.mjs
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../../Reverse-Engeneer-Website/scan');
const BASE_URL = 'https://incredifulls.com';
const SEED_PATHS = ['/', '/collections/all', '/pages/find-us-in-stores'];

async function scanPage(page, url, name) {
  console.log(`  Scanning: ${name}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    console.log(`  Skipped (error): ${url}`);
    return null;
  }

  await page.waitForTimeout(2000);

  const config = await page.evaluate(() => {
    return {
      gsapVersion: window.gsap?.version ?? null,
      lenisOptions: window.lenis ? {
        duration: window.lenis.options?.duration,
        easing: window.lenis.options?.easing?.toString(),
        smoothWheel: window.lenis.options?.smoothWheel,
      } : null,
      scrollTriggerDefaults: window.ScrollTrigger?.defaults?.() ?? null,
    };
  });

  const screenshotDir = join(OUTPUT_DIR, 'screenshots', name);
  await mkdir(screenshotDir, { recursive: true });
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);

  for (let y = 0; y <= pageHeight; y += 400) {
    await page.evaluate((s) => window.scrollTo(0, s), y);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: join(screenshotDir, `scroll-${String(y).padStart(5, '0')}.png`),
    });
  }

  return config;
}

async function main() {
  await mkdir(join(OUTPUT_DIR, 'assets'), { recursive: true });
  await mkdir(join(OUTPUT_DIR, 'screenshots'), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordHar: { path: join(OUTPUT_DIR, 'network-log.har') },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const downloaded = new Set();
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/cdn/shop/t/60/assets/') && !downloaded.has(url)) {
      downloaded.add(url);
      try {
        const body = await response.body();
        const filename = url.split('/').pop().split('?')[0];
        await writeFile(join(OUTPUT_DIR, 'assets', filename), body);
        console.log(`  ↓ ${filename}`);
      } catch { /* ignore read errors */ }
    }
  });

  const configs = {};

  for (const path of SEED_PATHS) {
    const name = path === '/' ? 'home' : path.replace(/\//g, '-').slice(1);
    configs[path] = await scanPage(page, BASE_URL + path, name);
  }

  // Discover product pages (up to 3)
  await page.goto(`${BASE_URL}/collections/all`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  const productUrls = await page.evaluate(() =>
    [...new Set(
      [...document.querySelectorAll('a[href*="/products/"]')]
        .map((a) => a.href)
        .filter((h) => !h.includes('?'))
    )].slice(0, 3)
  );

  for (const url of productUrls) {
    const name = 'product-' + url.split('/products/')[1]?.replace(/\//g, '-') ?? 'unknown';
    configs[url] = await scanPage(page, url, name);
  }

  await context.close();
  await browser.close();

  await writeFile(
    join(OUTPUT_DIR, 'animation-config.json'),
    JSON.stringify(configs, null, 2)
  );

  console.log(`\n✓ Scan complete → ${OUTPUT_DIR}`);
  console.log(`  Assets downloaded: ${downloaded.size}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
