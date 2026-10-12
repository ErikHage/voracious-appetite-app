import { defineConfig, devices } from '@playwright/test';

import { appUrl } from './spec/helpers/ui/setup/config';

// UI tests run against an already running app and recipes-service; see
// spec/ui/README.md. There is no webServer: the suite never starts either.
export default defineConfig({
    testDir: './spec/ui',
    globalSetup: './spec/helpers/ui/setup/global-setup.js',
    // The Vite dev server serves each page as hundreds of unbundled modules.
    // On a slow machine, three or more browsers loading at once time out, and
    // two run no faster than one. Override with --workers on a faster machine
    workers: 1,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: appUrl,
        // Without one, a click on a missing element waits out the whole test
        // timeout and reports only that
        actionTimeout: 10_000,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
