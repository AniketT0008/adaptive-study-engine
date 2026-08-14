import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
});

test('home to deck to learn renders without reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.getByRole('button', { name: /MCV4U - Grade 12 Calculus/i }).click();
  await expect(page).toHaveURL(/#\/deck\/mcv4u-calculus-vectors/);
  await expect(page.getByRole('heading', { name: /MCV4U - Grade 12 Calculus/i })).toBeVisible();
  await page.getByRole('button', { name: /Teacher Mode/i }).click();
  await expect(page).toHaveURL(/#\/learn\/mcv4u-calculus-vectors/);
  await expect(page.getByRole('heading', { name: 'Teacher Mode' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('quiz supports keyboard answers and persists progress', async ({ page }) => {
  await page.goto('/#/review/mcv4u-calculus-vectors');
  await expect(page.getByText(/Question 1 of/i)).toBeVisible();
  await page.keyboard.press('1');
  await expect(page.getByRole('heading', { name: /Correct|Not quite/ })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Question 2 of/i)).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('adaptive-study-engine-decks')));
  expect(stored.version).toBe(2);
  expect(stored.decks[0].concepts.some((concept) => concept.history?.length)).toBe(true);
});

test('focus, midterm, dashboard and missing routes have explicit states', async ({ page }) => {
  await page.goto('/#/review/mcv4u-calculus-vectors?focus=true');
  await expect(page.getByRole('heading', { name: /No weak spots yet/i })).toBeVisible();

  await page.goto('/#/review/mcv4u-calculus-vectors?midterm=true');
  await expect(page.getByText(/Question 1 of/i)).toBeVisible();

  await page.goto('/#/dashboard/mcv4u-calculus-vectors');
  await expect(page.getByRole('heading', { name: /Adaptive Analytics/i })).toBeVisible();

  await page.goto('/#/definitely-missing');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('custom deck refuses weak or unverified generation', async ({ page }) => {
  await page.getByRole('button', { name: /Create Custom Deck/i }).click();
  const build = page.getByRole('button', { name: /Build Custom Study Deck/i });
  await expect(build).toBeDisabled();
  await page.getByPlaceholder(/Paste your course notes/i).fill('Too short.');
  await expect(page.getByText(/More detailed notes required/i)).toBeVisible();
  await expect(build).toBeDisabled();
});

test('import rejects malformed data and export downloads valid decks', async ({ page }) => {
  const input = page.locator('input[accept=".json"]');
  await input.setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"id":"broken"}'),
  });
  await expect(page.getByRole('alert')).toContainText('Invalid deck file');

  const deck = {
    id: 'imported',
    title: 'Imported deck',
    concepts: [{ id: 'c1', label: 'Imported concept', mastery: 0, history: [] }],
    questions: [{
      id: 'q1',
      conceptId: 'c1',
      type: 'mcq',
      difficulty: 'easy',
      prompt: 'Which option is valid?',
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
      explanation: 'A is the fixture answer.',
    }],
  };
  await input.setInputFiles({
    name: 'valid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([deck])),
  });
  await expect(page.getByRole('status')).toContainText('Imported 1 valid deck');
  await expect(page.getByRole('button', { name: 'Open Imported deck' })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^synapse-decks-\d{4}-\d{2}-\d{2}\.json$/);
});

test('mobile layout remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Synapse' })).toBeVisible();
  await expect(page.getByRole('button', { name: /MCV4U/i })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('lesson diagrams are topic-specific, labelled, and responsive', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/learn/sch4u-chemistry-12');
  await expect(page.getByRole('heading', { name: 'Hydrocarbons and Isomerism' })).toBeVisible();
  await expect(page.locator('.concept-visual')).toHaveCount(0);

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Organic Reactions' })).toBeVisible();
  const esterification = page.getByRole('img', {
    name: 'Esterification combines a carboxylic acid and an alcohol to form an ester and water.',
  });
  await expect(esterification).toBeVisible();

  const fitsViewport = await esterification.evaluate((svg) => {
    const bounds = svg.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth && bounds.width > 0;
  });
  expect(fitsViewport).toBe(true);

  await page.goto('/#/learn/uoft-mat307');
  await expect(page.getByRole('heading', { name: 'Parametrized curves' })).toBeVisible();
  await expect(page.getByRole('img', {
    name: 'The tangent and principal normal vectors form part of the Frenet frame along a regular curve.',
  })).toBeVisible();
  await expect(page.getByRole('img', {
    name: 'The tangent line represents instantaneous rate at one point.',
  })).toHaveCount(0);
});

