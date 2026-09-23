import { test, expect } from '@playwright/test';

test.describe('Movie Discovery Flow', () => {
  test('home page loads top rated movies', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Top Rated Movies' })).toBeVisible();
    // Wait for at least one movie card to render
    await expect(page.locator('a[href^="/movie/"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('clicking a movie navigates to its details page', async ({ page }) => {
    await page.goto('/');
    const firstMovie = page.locator('a[href^="/movie/"]').first();
    await expect(firstMovie).toBeVisible({ timeout: 10_000 });
    const title = await firstMovie.locator('h3').textContent();
    await firstMovie.click();

    await expect(page).toHaveURL(/\/movie\/tt\d+/);
    if (title) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
  });

  test('search bar returns results and navigates on click', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search movies...').fill('matrix');

    const firstResult = page.locator('text=/.*\\(\\d{4}\\)/').first();
    await expect(firstResult).toBeVisible({ timeout: 5_000 });
    await firstResult.click();

    await expect(page).toHaveURL(/\/movie\/tt\d+/);
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });
});