import { test, expect } from '@playwright/test';

test.describe('Shopping flow', () => {
    test('should allow user to browse products and add to cart', async ({ page }) => {
        // Register a new unique user to authenticate dynamically
        await page.goto('http://localhost:3000/register');
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for authentication to complete
        await expect(page.locator('button[title="Logout"]')).toBeVisible({ timeout: 10000 });

        // Navigate to products
        await page.goto('http://localhost:3000/products');

        // Check if products load
        await expect(page.locator('text=Quick Add').first()).toBeVisible({ timeout: 10000 });

        // Click quick add on first product
        await page.click('text=Quick Add >> nth=0');

        // Wait for item to be added to cart and UI to update
        await expect(page.locator('text=Added')).toBeVisible();

        // Check cart indicator updated to 1
        const cartIndicator = page.locator('nav a[href="/cart"]');
        await expect(cartIndicator).toContainText('1');
    });
});
