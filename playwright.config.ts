import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Konfiguration für E2E-Tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e/tests',

    /* Maximale Zeit für einen einzelnen Test */
    timeout: 30 * 1000,

    /* Erwartete Assertions */
    expect: {
        timeout: 5000,
    },

    /* Parallele Tests */
    fullyParallel: true,

    /* Keine Wiederholungen in CI */
    forbidOnly: !!process.env['CI'],

    /* Wiederholungen bei Fehler */
    retries: process.env['CI'] ? 2 : 0,

    /* Anzahl paralleler Worker */
    workers: process.env['CI'] ? 1 : undefined,

    /* Reporter */
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
    ],

    /* Globale Einstellungen */
    use: {
        /* Base URL für Tests */
        baseURL: 'https://localhost:4200',

        /* Trace bei Fehler */
        trace: 'on-first-retry',

        /* Screenshots bei Fehler */
        screenshot: 'only-on-failure',

        /* Video bei Fehler */
        video: 'on-first-retry',

        /* Selbst-signierte Zertifikate erlauben */
        ignoreHTTPSErrors: true,
    },

    /* Projekte für verschiedene Browser */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    /* Webserver vor Tests starten */
    webServer: {
        command: 'pnpm start',
        url: 'https://localhost:4200',
        reuseExistingServer: !process.env['CI'],
        ignoreHTTPSErrors: true,
        timeout: 120 * 1000,
    },
});
