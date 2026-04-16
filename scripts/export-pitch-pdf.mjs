/**
 * Exports docs/pitch-dpavo.md → docs/pitch-dpavo.pdf
 * Uses Playwright headless Chromium to render styled HTML → PDF
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MD_PATH = resolve(ROOT, "docs/pitch-dpavo.md");
const PDF_PATH = resolve(ROOT, "docs/pitch-dpavo.pdf");

const md = readFileSync(MD_PATH, "utf-8");

// Simple markdown → HTML converter (handles the constructs we use)
function mdToHtml(text) {
  return text
    // Fenced code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // H1
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // H2
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    // H3
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // HR
    .replace(/^---$/gm, "<hr>")
    // Checkbox list items (✓)
    .replace(/^✓ (.+)$/gm, "<li class='check'>✓ $1</li>")
    // Bullet list items
    .replace(/^[-•] (.+)$/gm, "<li>$1</li>")
    // Numbered list
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    // Action tags (inline `[ACCIÓN: ...]`)
    .replace(/\[ACCIÓN: (.+?)\]/g, "<div class='action'>⚡ $1</div>")
    // Empty lines → paragraph breaks
    .split(/\n{2,}/)
    .map(block => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<")) return block;
      return `<p>${block.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");
}

const body = mdToHtml(md);

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #1a1a1a;
    background: #fff;
    padding: 0;
  }

  /* ── Cover strip ── */
  .cover {
    background: linear-gradient(135deg, #BD1F17 0%, #8B0000 60%, #232323 100%);
    color: white;
    padding: 48px 56px 40px;
    margin-bottom: 0;
  }
  .cover-label {
    font-size: 9pt;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-bottom: 10px;
  }
  .cover h1 {
    font-family: 'Playfair Display', serif;
    font-size: 28pt;
    font-weight: 700;
    color: #fff;
    border: none;
    padding: 0;
    margin: 0 0 8px;
    line-height: 1.15;
  }
  .cover-sub {
    font-size: 10.5pt;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.04em;
  }
  .gold-bar {
    height: 4px;
    background: linear-gradient(90deg, #ECBA23, #f5d06a, #ECBA23);
  }

  /* ── Content area ── */
  .content {
    padding: 36px 56px 48px;
  }

  h1 { display: none; } /* covered by .cover */

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 15pt;
    font-weight: 700;
    color: #BD1F17;
    margin: 32px 0 10px;
    padding-bottom: 6px;
    border-bottom: 2px solid #ECBA23;
    page-break-after: avoid;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 600;
    color: #232323;
    margin: 18px 0 6px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    page-break-after: avoid;
  }

  p {
    margin-bottom: 10px;
    color: #222;
  }

  strong { color: #111; }

  em { color: #555; font-style: italic; }

  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 24px 0;
  }

  blockquote {
    border-left: 3px solid #ECBA23;
    background: #fffbf0;
    padding: 10px 16px;
    margin: 8px 0 12px;
    font-size: 10pt;
    color: #444;
    border-radius: 0 4px 4px 0;
  }

  ul {
    margin: 6px 0 12px 0;
    padding-left: 0;
    list-style: none;
  }

  li {
    padding: 3px 0 3px 18px;
    position: relative;
    color: #333;
  }

  li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: #BD1F17;
    font-weight: 700;
  }

  li.check::before {
    content: "";
  }

  li.check {
    padding-left: 0;
    color: #1a5c1a;
    font-weight: 500;
  }

  code {
    background: #f4f4f4;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9pt;
    color: #BD1F17;
    font-family: monospace;
  }

  .action {
    background: #f0f4ff;
    border: 1px solid #c0cfe8;
    border-left: 4px solid #4a7adc;
    border-radius: 4px;
    padding: 8px 14px;
    margin: 10px 0;
    font-size: 9.5pt;
    color: #2c4a8a;
    font-weight: 500;
  }

  /* Nota para presentadora */
  .note-box {
    background: #fff8e1;
    border: 1px solid #ECBA23;
    border-radius: 6px;
    padding: 12px 18px;
    margin: 0 0 28px;
    font-size: 9.5pt;
    color: #5c4a00;
  }

  /* Footer */
  .footer {
    margin-top: 40px;
    padding-top: 14px;
    border-top: 1px solid #e0e0e0;
    font-size: 8.5pt;
    color: #999;
    text-align: center;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h2 { page-break-before: auto; }
    .cover { page-break-after: avoid; }
  }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-label">Propuesta Comercial · Presencia Digital</div>
  <h1>El Pitch — D'Pavo Urban Pizzería</h1>
  <div class="cover-sub">Guión de Presentación · Sitio Web Profesional · Verón, Punta Cana</div>
</div>
<div class="gold-bar"></div>

<div class="content">

<div class="note-box">
  <strong>Nota para la presentadora:</strong> Las secciones entre corchetes <code>[ACCIÓN]</code> indican qué hacer en ese momento. Las líneas en <em>cursiva</em> son opcionales. Respira — eres la experta en la sala.
</div>

${body.replace(/<h1>El Pitch.*?<\/h1>/i, "").replace(/<h3>Guión.*?<\/h3>/i, "")}

<div class="footer">
  Propuesta preparada para D'Pavo Urban Pizzería · Verón, Punta Cana · Abril 2026
</div>

</div>
</body>
</html>`;

// Write HTML for inspection
writeFileSync(resolve(ROOT, "docs/pitch-dpavo.html"), html);

// Launch Chromium and print to PDF
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.setContent(html, { waitUntil: "networkidle" });

// Wait for Google Fonts to load
await page.waitForTimeout(1500);

await page.pdf({
  path: PDF_PATH,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});

await browser.close();

console.log(`✅ PDF generado: ${PDF_PATH}`);
