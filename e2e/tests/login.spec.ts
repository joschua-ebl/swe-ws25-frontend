import { test, expect } from '../fixtures/test.fixture';

test.describe('Login', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('sollte Login-Formular anzeigen', async ({ loginPage }) => {
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('sollte erfolgreich mit gültigen Credentials einloggen', async ({ loginPage }) => {
        await loginPage.login('admin', 'p');
        await loginPage.waitForRedirect();

        // Prüfen ob auf Suche-Seite weitergeleitet wurde
        await expect(loginPage.page).toHaveURL(/\/suche/);
    });

    test('sollte Fehlermeldung bei ungültigen Credentials anzeigen', async ({ loginPage }) => {
        await loginPage.login('invalid', 'invalid');

        // Warten auf Fehlermeldung
        await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
    });

    test('sollte Passwort-Sichtbarkeit umschalten können', async ({ loginPage }) => {
        await loginPage.passwordInput.fill('testpasswort');

        // Initial versteckt
        expect(await loginPage.isPasswordVisible()).toBe(false);

        // Umschalten
        await loginPage.togglePasswordVisibility();
        expect(await loginPage.isPasswordVisible()).toBe(true);

        // Zurück umschalten
        await loginPage.togglePasswordVisibility();
        expect(await loginPage.isPasswordVisible()).toBe(false);
    });

    test('sollte Validierungsfehler bei leerem Formular anzeigen', async ({ loginPage }) => {
        await loginPage.loginButton.click();

        // Prüfen ob Fehler-Klassen gesetzt wurden
        await expect(loginPage.usernameInput).toHaveClass(/ng-invalid/);
        await expect(loginPage.passwordInput).toHaveClass(/ng-invalid/);
    });
});
