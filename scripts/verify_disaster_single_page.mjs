import { chromium } from '../frontend/node_modules/playwright/index.mjs';
import path from 'path';

async function main() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  });

  const page = await context.newPage();

  // Inject Super Admin Session
  await page.addInitScript(() => {
    localStorage.setItem('p5_token', 'mock_jwt_token_for_admin_dev_session');
    localStorage.setItem('p5_user', JSON.stringify({
      id: 'admin-1',
      email: 'admin@p5digital.local',
      role: 'super_admin',
      fullName: 'DRRM System Administrator'
    }));
    localStorage.setItem('p5_role', 'super_admin');
    localStorage.setItem('p5_email', 'admin@p5digital.local');
    localStorage.setItem('p5_name', 'DRRM System Administrator');
  });

  // 1. Main Incidents Single Page (formerly tab 1)
  console.log('Navigating to http://localhost:8080/app/disaster...');
  await page.goto('http://localhost:8080/app/disaster', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  const p1 = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_disaster_admin_incidents.png');
  await page.screenshot({ path: p1, fullPage: false });
  console.log('Saved:', p1);

  // 2. River Level & Flood Single Page (formerly tab 7)
  console.log('Navigating to http://localhost:8080/app/disaster?tab=sensors...');
  await page.goto('http://localhost:8080/app/disaster?tab=sensors', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  const p2 = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_disaster_admin_sensors.png');
  await page.screenshot({ path: p2, fullPage: false });
  console.log('Saved:', p2);

  // 3. SAR Heavy Equipment Single Page (formerly tab 15)
  console.log('Navigating to http://localhost:8080/app/disaster?tab=heavy_equipment...');
  await page.goto('http://localhost:8080/app/disaster?tab=heavy_equipment', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  const p3 = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_disaster_admin_sar.png');
  await page.screenshot({ path: p3, fullPage: false });
  console.log('Saved:', p3);

  // 4. Public Disaster Single Page (River Twin)
  console.log('Navigating to http://localhost:8080/disaster...');
  await page.goto('http://localhost:8080/disaster', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  const p4 = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_public_disaster_single.png');
  await page.screenshot({ path: p4, fullPage: false });
  console.log('Saved:', p4);

  // 5. Public Disaster BIPAD Gateway Single Page
  console.log('Navigating to http://localhost:8080/disaster?tab=national_gateway...');
  await page.goto('http://localhost:8080/disaster?tab=national_gateway', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  const p5 = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_public_bipad_gateway.png');
  await page.screenshot({ path: p5, fullPage: false });
  console.log('Saved:', p5);

  // 6. FAQ & Help Single Page
  console.log('Navigating to http://localhost:8080/faq-help...');
  await page.goto('http://localhost:8080/faq-help', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  const p6 = path.resolve('C:/Users/UNepal/.gemini/antigravity/brain/7222bb98-6c29-4d85-94aa-5c7676bbfa0e/verify_faq_help_disaster.png');
  await page.screenshot({ path: p6, fullPage: false });
  console.log('Saved:', p6);

  await browser.close();
  console.log('Finished all admin single-page captures!');
}

main().catch(console.error);
