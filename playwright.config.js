import { defineConfig, devices } from '@playwright/test';

import { appUrl } from './spec/helpers/ui/setup/config';

// UI tests run against an already running app and recipes-service; see
// spec/ui/README.md. There is no webServer: the suite never starts either.
export default defineConfig({
    testDir: './spec/ui',
    globalSetup: './spec/helpers/ui/setup/global-setup.js',
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: appUrl,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
