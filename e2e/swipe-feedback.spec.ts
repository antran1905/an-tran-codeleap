import { expect, test } from '@playwright/test';

import { installDogApiMocks } from './support/dog-api-mocks';

test.describe('Swipe Feedback', () => {
  test('shows swipe-specific toast messages for reject, like, and super like', async ({ page }) => {
    await installDogApiMocks(page);

    await page.goto('/');

    await page.getByRole('button', { name: 'Dislike' }).click();
    await expect(page.getByText('Not a match this time!')).toBeVisible();

    await page.getByRole('button', { name: 'Love' }).click();
    await expect(page.getByText('Added to your favorites!')).toBeVisible();

    await page.getByRole('button', { name: 'Star' }).click();
    await expect(page.getByText('Top pick! Saved to Super Likes.')).toBeVisible();
  });
});
