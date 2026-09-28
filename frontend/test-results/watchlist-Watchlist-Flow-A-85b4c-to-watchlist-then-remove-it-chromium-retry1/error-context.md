# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: watchlist.spec.ts >> Watchlist Flow (Authenticated) >> user can register, add a movie to watchlist, then remove it
- Location: tests/e2e/watchlist.spec.ts:10:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:5173/login"
Received: "http://localhost:5173/register"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/register"

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
  - heading "Create Account" [level=2]
  - text: User registration failed Your Name
  - textbox "Your Name": Playwright Tester
  - text: Email
  - textbox "Email": pw-1790162268170@example.com
  - text: Password
  - textbox "Password":
    - /placeholder: At least 6 characters
    - text: password123
  - button "Create your IMDb account"
  - paragraph:
    - text: Already have an account?
    - link "Sign In":
      - /url: /login
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Watchlist Flow (Authenticated)', () => {
  4  |   const testUser = {
  5  |     name: 'Playwright Tester',
  6  |     email: `pw-${Date.now()}@example.com`,
  7  |     password: 'password123',
  8  |   };
  9  | 
  10 |   test('user can register, add a movie to watchlist, then remove it', async ({ page }) => {
  11 |     // Register
  12 |     await page.goto('/register');
  13 |     await page.getByLabel('Your Name').fill(testUser.name);
  14 |     await page.getByLabel('Email').fill(testUser.email);
  15 |     await page.getByLabel('Password').fill(testUser.password);
  16 |     await page.getByRole('button', { name: /Create your IMDb account/ }).click();
  17 | 
> 18 |     await expect(page).toHaveURL('/login');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  19 | 
  20 |     // Log in
  21 |     await page.getByLabel('Email').fill(testUser.email);
  22 |     await page.getByLabel('Password').fill(testUser.password);
  23 |     await page.getByRole('button', { name: 'Sign In' }).click();
  24 | 
  25 |     await expect(page).toHaveURL('/');
  26 |     await expect(page.getByText(`Welcome, ${testUser.name}`)).toBeVisible();
  27 | 
  28 |     // Go to a movie and add to watchlist
  29 |     const firstMovie = page.locator('a[href^="/movie/"]').first();
  30 |     await expect(firstMovie).toBeVisible({ timeout: 10_000 });
  31 |     await firstMovie.click();
  32 | 
  33 |     await page.getByRole('button', { name: '+ Add to Watchlist' }).click();
  34 |     await expect(page.getByRole('button', { name: '✓ In Your Watchlist' })).toBeVisible();
  35 | 
  36 |     // Check the watchlist page
  37 |     await page.getByRole('link', { name: 'My Watchlist' }).click();
  38 |     await expect(page).toHaveURL('/watchlist');
  39 |     await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
  40 | 
  41 |     // Remove it
  42 |     await page.getByRole('button', { name: 'Remove' }).click();
  43 |     await expect(page.getByText('Your watchlist is empty.')).toBeVisible();
  44 |   });
  45 | 
  46 |   test('logged out user is redirected away from /watchlist', async ({ page }) => {
  47 |     await page.goto('/watchlist');
  48 |     await expect(page).toHaveURL('/login');
  49 |   });
  50 | });
```