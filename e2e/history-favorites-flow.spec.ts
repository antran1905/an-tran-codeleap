import { expect, test } from '@playwright/test';

import { installDogApiMocks } from './support/dog-api-mocks';

test.describe('History and Favorites Flow', () => {
  test('records likes in history and favorites list', async ({ page }) => {
    await installDogApiMocks(page);

    await page.goto('/');

    await page.getByRole('button', { name: 'Love' }).click();
    await expect(page.getByText('Added to your favorites!')).toBeVisible();
    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const historyKey = Object.keys(window.localStorage).find((key) =>
            key.endsWith('.history'),
          );

          if (!historyKey) {
            return 0;
          }

          const rawHistory = window.localStorage.getItem(historyKey);

          if (!rawHistory) {
            return 0;
          }

          try {
            const parsed = JSON.parse(rawHistory) as unknown[];
            return parsed.length;
          } catch {
            return 0;
          }
        });
      })
      .toBeGreaterThan(0);

    await page.locator('a[href="/history"]').click();
    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
    const historyItem = page.locator('li', { hasText: 'Affenpinscher' });
    await expect(historyItem).toBeVisible();
    await expect(historyItem.getByText('Like', { exact: true })).toBeVisible();

    await page.locator('a[href="/favorites"]').click();
    await expect(page.getByRole('heading', { name: 'Favorites' })).toBeVisible();
    await expect(page.getByText('Dogs saved to your favourites list (1).')).toBeVisible();
    await expect(page.getByText('Affenpinscher')).toBeVisible();
  });
});
