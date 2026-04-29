import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/',         name: 'home' },
  { path: '/menu',     name: 'menu' },
  { path: '/events',   name: 'events' },
  { path: '/about',    name: 'about' },
  { path: '/contact',  name: 'contact' },
  { path: '/catering', name: 'catering' },
];

const VIEWPORTS = [
  { width: 1280, height: 800,  label: 'desktop' },
  { width: 390,  height: 844,  label: 'mobile' },
];

for (const { path, name } of ROUTES) {
  for (const { width, height, label } of VIEWPORTS) {
    test(`visual: ${name} @ ${label}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(path);
      // Wait for fonts + images to settle
      await page.waitForLoadState('networkidle');
      // Dismiss cookie banner if present
      const acceptBtn = page.getByRole('button', { name: /aceptar/i });
      if (await acceptBtn.isVisible()) await acceptBtn.click();

      await expect(page).toHaveScreenshot(`${name}-${label}.png`, {
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      });
    });
  }
}
