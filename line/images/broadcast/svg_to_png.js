const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCRIPT_DIR = __dirname;
const OUTPUT_DIR = path.join(SCRIPT_DIR, 'png');

const SVG_FILES = [
  'line_header_report.svg',
  'line_header_event.svg',
  'line_header_experience.svg',
  'line_header_notice.svg',
  'line_header_cancel.svg',
  'line_header_camp.svg',
];

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1040, height: 520, deviceScaleFactor: 2 });

  for (const svg of SVG_FILES) {
    const name = svg.replace('.svg', '');
    const svgPath = path.join(SCRIPT_DIR, svg);
    const outPath = path.join(OUTPUT_DIR, `${name}.png`);

    await page.goto(`file://${svgPath}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1040, height: 520 } });
    console.log(`✓ ${name}.png`);
  }

  await browser.close();
  console.log(`\n完了: ${OUTPUT_DIR}/`);
})();
