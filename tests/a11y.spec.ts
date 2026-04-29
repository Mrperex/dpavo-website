import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/menu', '/events', '/about', '/gallery', '/contact', '/catering'];

for (const route of ROUTES) {
  test(`a11y: ${route} has no critical violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#__next') // exclude Next.js internals
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, `Critical a11y violations on ${route}:\n${JSON.stringify(critical.map(v => ({ id: v.id, impact: v.impact, description: v.description })), null, 2)}`).toHaveLength(0);
  });
}
