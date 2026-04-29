#!/usr/bin/env node
/**
 * Image optimization script for D'Pavo Pizza
 *
 * Converts all PNG/JPG in /public/media/ to optimized WebP.
 * - Pizza/food PNGs: max 1200px (transparent), quality 85
 * - JPEG backgrounds: max 1920px, quality 82
 * - Hero/OG: keeps aspect ratio
 *
 * Originals are moved to /public/media/_originals/ for safety.
 *
 * Usage: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, mkdir, rename, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = path.resolve(__dirname, '../public/media');
const BACKUP_DIR = path.join(MEDIA_DIR, '_originals');

const SKIP_FILES = new Set([
  // Already optimized
  'og-image.jpg',
  'catering-hero.jpg',
  'icon.png',
  // Logos (SVG-like, stay)
  'logo-pavo-pizza.png',
]);

const SKIP_EXTENSIONS = new Set(['.svg', '.mp4', '.mp3', '.webp', '.avif', '.ico']);

function bytesToKb(b) { return (b / 1024).toFixed(1); }

async function main() {
  if (!existsSync(BACKUP_DIR)) {
    await mkdir(BACKUP_DIR, { recursive: true });
  }

  const files = await readdir(MEDIA_DIR);
  const candidates = files.filter((f) => {
    if (SKIP_FILES.has(f)) return false;
    const ext = path.extname(f).toLowerCase();
    if (SKIP_EXTENSIONS.has(ext)) return false;
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  });

  console.log(`\n🖼️  D'Pavo Image Optimizer`);
  console.log(`Found ${candidates.length} candidates in ${MEDIA_DIR}\n`);

  let totalSaved = 0;
  let processed = 0;
  let skipped = 0;

  for (const file of candidates) {
    const src = path.join(MEDIA_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const safeName = baseName.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const out = path.join(MEDIA_DIR, `${safeName}.webp`);

    // If a webp with same safe name already exists and is fresh, skip
    if (existsSync(out)) {
      const [srcStat, outStat] = await Promise.all([stat(src), stat(out)]);
      if (outStat.mtime > srcStat.mtime) {
        console.log(`⏭️   ${file} → already optimized as ${path.basename(out)}`);
        skipped++;
        continue;
      }
    }

    const srcSize = (await stat(src)).size;
    const isPng = ext === '.png';

    // PNG with alpha = food image (kept transparent), JPG = background
    const maxWidth = isPng ? 1200 : 1920;
    const quality = isPng ? 85 : 82;

    try {
      const pipeline = sharp(src).rotate().resize({
        width: maxWidth,
        withoutEnlargement: true,
        fit: 'inside',
      });

      await pipeline
        .webp({ quality, alphaQuality: quality, smartSubsample: true, effort: 5 })
        .toFile(out);

      const outSize = (await stat(out)).size;
      const saved = srcSize - outSize;
      totalSaved += saved;
      processed++;

      // Move original to backup
      const backupPath = path.join(BACKUP_DIR, file);
      if (!existsSync(backupPath)) {
        await rename(src, backupPath);
      }

      console.log(
        `✅  ${file.padEnd(38)} ${bytesToKb(srcSize).padStart(8)}KB → ${bytesToKb(outSize).padStart(8)}KB ` +
        `(saved ${bytesToKb(saved).padStart(8)}KB, -${Math.round((saved / srcSize) * 100)}%) → ${path.basename(out)}`
      );
    } catch (err) {
      console.error(`❌  ${file} — ${err.message}`);
    }
  }

  console.log(`\n📊  Summary:`);
  console.log(`    Processed: ${processed}`);
  console.log(`    Skipped:   ${skipped}`);
  console.log(`    Total saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  console.log(`    Originals: ${BACKUP_DIR}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
