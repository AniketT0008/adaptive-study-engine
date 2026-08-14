import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of [
  '/',
  '/#/deck/mcv4u-calculus-vectors',
  '/#/learn/mcv4u-calculus-vectors',
  '/#/review/mcv4u-calculus-vectors',
  '/#/dashboard/mcv4u-calculus-vectors',
]) {
  test(`@a11y ${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact))).toEqual([]);
  });
}

