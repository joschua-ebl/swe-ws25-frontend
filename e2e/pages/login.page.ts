import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object für die Login-Seite
 */
export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly passwordToggle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('input[formcontrolname="username"]');
        this.passwordInput = page.locator('input[formcontrolname="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('.error-container');
        this.passwordToggle = page.locator('button[mat-icon-button]').filter({ hasText: /visibility/ });
    }

    /**
     * Zur Login-Seite navigieren
     */
    async goto() {
        await this.page.goto('/login');
    }

    /**
     * Login durchführen
     */
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Auf Weiterleitung nach Login warten
     */
    async waitForRedirect() {
        await this.page.waitForURL('**/suche');
    }

    /**
     * Prüfen ob Fehlermeldung sichtbar ist
     */
    async isErrorVisible() {
        return await this.errorMessage.isVisible();
    }

    /**
     * Fehlermeldung abrufen
     */
    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    /**
     * Passwort-Sichtbarkeit umschalten
     */
    async togglePasswordVisibility() {
        await this.passwordToggle.click();
    }

    /**
     * Prüfen ob Passwort sichtbar ist
     */
    async isPasswordVisible() {
        const type = await this.passwordInput.getAttribute('type');
        return type === 'text';
    }
}
