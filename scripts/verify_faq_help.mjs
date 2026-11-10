import { chromium } from '../frontend/node_modules/playwright/index.mjs';
import path from 'path';

async function main() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:8080/faq-help...');
  await page.goto('http://localhost:8080/faq-help', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Capture Nepali view (default or current)
  const npPath = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_faq_np.png');
  await page.screenshot({ path: npPath, fullPage: false });
  console.log('Saved Nepali screenshot to:', npPath);

  // Switch to English
  const langBtn = await page.$('button:has-text("EN"), button:has-text("नेपाली")');
  if (langBtn) {
    console.log('Clicking language button...');
    await langBtn.click();
    await page.waitForTimeout(1000);
  }

  // Capture English view
  const enPath = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_faq_en.png');
  await page.screenshot({ path: enPath, fullPage: false });
  console.log('Saved English screenshot to:', enPath);

  await browser.close();
}

main().catch(console.error);
