# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Movie Discovery Flow >> home page loads top rated movies
- Location: tests/e2e/navigation.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Top Rated Movies' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Top Rated Movies' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Top Rated Movies' })

```

```yaml
- navigation:
  - link "IMDb":
    - /url: /
  - link "Home":
    - /url: /
  - textbox "Search movies..."
  - link "Log In":
    - /url: /login
  - link "Sign Up":
    - /url: /register
- main:
  - paragraph: Could not load movies.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Movie Discovery Flow', () => {
  4  |   test('home page loads top rated movies', async ({ page }) => {
  5  |     await page.goto('/');
> 6  |     await expect(page.getByRole('heading', { name: 'Top Rated Movies' })).toBeVisible();
     |                                                                           ^ Error: expect(locator).toBeVisible() failed
  7  |     // Wait for at least one movie card to render
  8  |     await expect(page.locator('a[href^="/movie/"]').first()).toBeVisible({ timeout: 10_000 });
  9  |   });
  10 | 
  11 |   test('clicking a movie navigates to its details page', async ({ page }) => {
  12 |     await page.goto('/');
  13 |     const firstMovie = page.locator('a[href^="/movie/"]').first();
  14 |     await expect(firstMovie).toBeVisible({ timeout: 10_000 });
  15 |     const title = await firstMovie.locator('h3').textContent();
  16 |     await firstMovie.click();
  17 | 
  18 |     await expect(page).toHaveURL(/\/movie\/tt\d+/);
  19 |     if (title) {
  20 |       await expect(page.getByRole('heading', { name: title })).toBeVisible();
  21 |     }
  22 |   });
  23 | 
  24 |   test('search bar returns results and navigates on click', async ({ page }) => {
  25 |     await page.goto('/');
  26 |     await page.getByPlaceholder('Search movies...').fill('matrix');
  27 | 
  28 |     const firstResult = page.locator('text=/.*\\(\\d{4}\\)/').first();
  29 |     await expect(firstResult).toBeVisible({ timeout: 5_000 });
  30 |     await firstResult.click();
  31 | 
  32 |     await expect(page).toHaveURL(/\/movie\/tt\d+/);
  33 |   });
  34 | 
  35 |   test('unknown route shows 404 page', async ({ page }) => {
  36 |     await page.goto('/this-route-does-not-exist');
  37 |     await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  38 |   });
  39 | });
```