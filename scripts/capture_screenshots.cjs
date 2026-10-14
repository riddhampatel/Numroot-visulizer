const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:5199';

const DIRS = [
  path.join(__dirname, '..', 'screenshots'),
  path.join(__dirname, '..', 'screenshot')
];

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function saveToAll(page, filename, options = {}) {
  for (const dir of DIRS) {
    const filePath = path.join(dir, filename);
    await page.screenshot({ path: filePath, ...options });
    console.log(`Saved screenshot: ${filePath}`);
  }
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Connecting to math assignment at ' + URL);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: {
      width: 1440,
      height: 960,
      deviceScaleFactor: 2
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await wait(1200);

  // 1. Dashboard Comparison Overview (Full Page)
  console.log('1. Capturing Dashboard Comparison Full Page...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(300);
  await saveToAll(page, '01_dashboard_comparison_overview.png', { fullPage: true });

  // 2. Interactive Graph Canvas View
  console.log('2. Capturing Interactive Graph Canvas & Controls...');
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) canvas.scrollIntoView({ block: 'center' });
  });
  await wait(500);
  await saveToAll(page, '02_interactive_graph_canvas.png', { fullPage: false });

  // 3. Convergence Chart Comparison View
  console.log('3. Capturing Convergence Chart & Statistics...');
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h3, h4, span, div')).find(
      (el) => el.textContent && el.textContent.includes('Convergence Rate Comparison')
    );
    if (heading) heading.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 680);
  });
  await wait(500);
  await saveToAll(page, '03_convergence_chart_comparison.png', { fullPage: false });

  // 4. Bisection Method Mode
  console.log('4. Switching to Bisection Method Mode...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const buttons = Array.from(document.querySelectorAll('button'));
    const bisectBtn = buttons.find(
      (b) => b.textContent && b.textContent.includes('Bisection') && !b.textContent.includes('Compare')
    );
    if (bisectBtn) bisectBtn.click();
  });
  await wait(800);
  await saveToAll(page, '04_bisection_method_view.png', { fullPage: true });

  // 5. Newton-Raphson Method Mode
  console.log('5. Switching to Newton-Raphson Method Mode...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const buttons = Array.from(document.querySelectorAll('button'));
    const newtonBtn = buttons.find(
      (b) => b.textContent && b.textContent.includes('Newton') && !b.textContent.includes('Compare')
    );
    if (newtonBtn) newtonBtn.click();
  });
  await wait(800);
  await saveToAll(page, '05_newton_raphson_view.png', { fullPage: true });

  // 6. Transcendental Preset (cos(x) - x = 0 Dottie Number)
  console.log('6. Applying Transcendental Preset (cos(x) - x = 0)...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const buttons = Array.from(document.querySelectorAll('button'));
    const compareBtn = buttons.find((b) => b.textContent && b.textContent.includes('Dual Comparison'));
    if (compareBtn) compareBtn.click();
    const dottieBtn = buttons.find(
      (b) => b.textContent && (b.textContent.includes('Dottie') || b.textContent.includes('cos(x)'))
    );
    if (dottieBtn) dottieBtn.click();
  });
  await wait(1000);
  await saveToAll(page, '06_transcendental_dottie_preset.png', { fullPage: true });

  // 7. CS Applications Modal
  console.log('7. Opening CS Applications Modal...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const csBtn = document.getElementById('btn-cs-applications');
    if (csBtn) csBtn.click();
  });
  await wait(800);
  await saveToAll(page, '07_computer_science_applications_modal.png', { fullPage: false });

  // Close CS Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button svg.lucide-x')
      ? document.querySelector('button svg.lucide-x').closest('button')
      : null;
    if (closeBtn) closeBtn.click();
  });
  await wait(500);

  // 8. Algorithm Theory & Guide Modal
  console.log('8. Opening Algorithm Theory & Guide Modal...');
  await page.evaluate(() => {
    const guideBtn = document.getElementById('btn-algorithm-guide');
    if (guideBtn) guideBtn.click();
  });
  await wait(800);
  await saveToAll(page, '08_algorithm_theory_guide_modal.png', { fullPage: false });

  // Close Guide Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button svg.lucide-x')
      ? document.querySelector('button svg.lucide-x').closest('button')
      : null;
    if (closeBtn) closeBtn.click();
  });
  await wait(500);

  // 9. Square Root (√5 Calculation) Preset View
  console.log('9. Applying Square Root √5 Preset...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const buttons = Array.from(document.querySelectorAll('button'));
    const sqrtBtn = buttons.find(
      (b) => b.textContent && (b.textContent.includes('x² - 5') || b.textContent.includes('√5'))
    );
    if (sqrtBtn) sqrtBtn.click();
  });
  await wait(1000);
  await saveToAll(page, '09_square_root_benchmark_preset.png', { fullPage: true });

  await browser.close();
  console.log('Successfully captured 9 high-resolution screenshots for the Math Assignment!');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
