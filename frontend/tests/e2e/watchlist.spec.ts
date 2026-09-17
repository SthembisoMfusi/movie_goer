import { test, expect } from '@playwright/test';

test.describe('Watchlist Flow (Authenticated)', () => {
  const testUser = {
    name: 'Playwright Tester',
    email: `pw-${Date.now()}@example.com`,
    password: 'password123',
  };

  test('user can register, add a movie to watchlist, then remove it', async ({ page }) => {
    // Register
    await page.goto('/register');
    await page.getByLabel('Your Name').fill(testUser.name);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByRole('button', { name: /Create your IMDb account/ }).click();

    await expect(page).toHaveURL('/login');

    // Log in
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(`Welcome, ${testUser.name}`)).toBeVisible();

    // Go to a movie and add to watchlist
    const firstMovie = page.locator('a[href^="/movie/"]').first();
    await expect(firstMovie).toBeVisible({ timeout: 10_000 });
    await firstMovie.click();

    await page.getByRole('button', { name: '+ Add to Watchlist' }).click();
    await expect(page.getByRole('button', { name: '✓ In Your Watchlist' })).toBeVisible();

    // Check the watchlist page
    await page.getByRole('link', { name: 'My Watchlist' }).click();
    await expect(page).toHaveURL('/watchlist');
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

    // Remove it
    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByText('Your watchlist is empty.')).toBeVisible();
  });

  test('logged out user is redirected away from /watchlist', async ({ page }) => {
    await page.goto('/watchlist');
    await expect(page).toHaveURL('/login');
  });
});