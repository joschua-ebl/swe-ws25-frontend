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

    async goto() {
        await this.page.goto('/login');
        await this.page.waitForLoadState('networkidle');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async waitForRedirect() {
        await this.page.waitForURL('**/suche', { timeout: 15000 });
    }

    async isErrorVisible() {
        return await this.errorMessage.isVisible();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    async togglePasswordVisibility() {
        await this.passwordToggle.click();
    }

    async isPasswordVisible() {
        const type = await this.passwordInput.getAttribute('type');
        return type === 'text';
    }
}
