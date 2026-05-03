import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
    test('should allow user to login and redirect to home', async ({ page }) => {
        const uniqueEmail = `test-${Date.now()}@example.com`;

        // Register first
        await page.goto('http://localhost:3000/register');
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');
        await expect(page.locator('button[title="Logout"]')).toBeVisible({ timeout: 10000 });

        // Logout
        await page.click('button[title="Logout"]');

        // Navigate to login
        await page.goto('http://localhost:3000/login');

        // Fill credentials
        await page.fill('input[type="email"]', uniqueEmail);
        await page.fill('input[type="password"]', 'password123');

        // Submit form
        await page.click('button[type="submit"]');

        // Check exact redirection to home page and authentication state
        await expect(page).toHaveURL('http://localhost:3000/');
        await expect(page.locator('button[title="Logout"]')).toBeVisible({ timeout: 10000 });
    });
});
