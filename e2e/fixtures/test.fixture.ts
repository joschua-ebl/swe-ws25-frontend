import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SuchePage } from '../pages/suche.page';
import { DetailPage } from '../pages/detail.page';

/**
 * Test Fixture mit Page Objects
 * Erweitert den Basis-Test um vorkonfigurierte Page Objects
 */
type TestFixtures = {
    loginPage: LoginPage;
    suchePage: SuchePage;
    detailPage: DetailPage;
};

export const test = base.extend<TestFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    suchePage: async ({ page }, use) => {
        const suchePage = new SuchePage(page);
        await use(suchePage);
    },

    detailPage: async ({ page }, use) => {
        const detailPage = new DetailPage(page);
        await use(detailPage);
    },
});

export { expect } from '@playwright/test';

/**
 * Hilfsfunktion: Als Admin einloggen
 */
export async function loginAsAdmin(loginPage: LoginPage) {
    await loginPage.goto();
    await loginPage.login('admin', 'p');
    await loginPage.waitForRedirect();
}

/**
 * Hilfsfunktion: Als User einloggen
 */
export async function loginAsUser(loginPage: LoginPage) {
    await loginPage.goto();
    await loginPage.login('user', 'p');
    await loginPage.waitForRedirect();
}
