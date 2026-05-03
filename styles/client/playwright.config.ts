import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    timeout: 60000,
    webServer: [
        {
            command: 'cd ../server && npm run start',
            port: 4000,
            reuseExistingServer: !process.env.CI,
            timeout: 120000,
        },
        {
            command: 'npm run build && npm run start',
            port: 3000,
            reuseExistingServer: !process.env.CI,
            timeout: 120000,
        }
    ],
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
