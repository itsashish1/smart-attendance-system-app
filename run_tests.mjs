import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = './test_results';

// Ensure artifact directory exists
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const routesToTest = [
  { name: 'home', path: '/' },
  { name: 'clubs', path: '/clubs' },
  { name: 'events', path: '/events' },
  { name: 'forum', path: '/forum' },
  { name: 'faculty', path: '/faculty' },
  { name: 'placements', path: '/placements' },
  { name: 'search', path: '/search' },
  { name: 'announcements', path: '/announcements' },
];

(async () => {
  console.log('Launching Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    consoleErrors.push(`[uncaught exception] ${exception}`);
  });

  console.log('Starting Route Verification & Screenshot Capture...');

  for (const route of routesToTest) {
    try {
      console.log(`Testing route: ${route.path}`);
      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Wait for the loading screen to disappear if present
      const loadingSpinner = page.locator('.loading-screen');
      if (await loadingSpinner.count() > 0) {
          await loadingSpinner.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
      }
      
      // Additional wait for potential staggered entry animations
      await page.waitForTimeout(1000);

      // Verify the page has content
      const contentText = await page.textContent('body');
      if (!contentText || contentText.length < 50) {
         console.log(`WARNING: Route ${route.path} might be empty!`);
      }

      const screenshotPath = path.join(ARTIFACTS_DIR, `${route.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot for ${route.name} at ${screenshotPath}`);

    } catch (e) {
      console.log(`Error testing route ${route.path}: ${e.message}`);
    }
  }

  await browser.close();
  
  console.log('\n--- Test Summary ---');
  if (consoleErrors.length > 0) {
    console.log('Console Errors Detected:');
    consoleErrors.forEach(e => console.log(' -', e));
  } else {
    console.log('No console errors detected! The application is running smoothly.');
  }
  
  console.log('Testing completed.');
})();
