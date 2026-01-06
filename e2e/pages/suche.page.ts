import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object für die Such-Seite (Refactored)
 */
export class SuchePage {
    readonly page: Page;

    // Searchbar Component
    readonly titelInput: Locator;
    readonly isbnInput: Locator;
    readonly suchenButton: Locator;

    // Filter Component
    readonly artSelect: Locator;
    readonly ratingRadios: Locator;
    readonly lieferbarCheckbox: Locator;
    readonly filterAnwendenButton: Locator;
    readonly resetFilterButton: Locator;

    // BookList Component
    readonly suchergebnisseGrid: Locator;
    readonly bookCards: Locator;
    readonly paginator: Locator;
    readonly noResultsMessage: Locator;
    readonly errorMessage: Locator;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
        this.page = page;

        // Searchbar selectors (inside app-searchbar)
        this.titelInput = page.locator('app-searchbar input[placeholder*="Titel"]');
        this.isbnInput = page.locator('app-searchbar input[placeholder*="ISBN"]');
        this.suchenButton = page.locator('app-searchbar button').filter({ hasText: 'Suchen' });

        // Filter selectors (inside app-filter)
        this.artSelect = page.locator('app-filter mat-select');
        this.ratingRadios = page.locator('app-filter mat-radio-group');
        this.lieferbarCheckbox = page.locator('app-filter mat-checkbox'); // Erste Checkbox ist Lieferbar
        this.filterAnwendenButton = page.locator('app-filter button').filter({ hasText: 'Filter anwenden' });
        this.resetFilterButton = page.locator('app-filter button mat-icon:has-text("restart_alt")').locator('..');

        // BookList selectors (inside app-book-list)
        this.suchergebnisseGrid = page.locator('app-book-list .book-grid');
        this.bookCards = page.locator('app-book-list mat-card.book-card');
        this.paginator = page.locator('app-book-list mat-paginator');
        this.noResultsMessage = page.locator('app-book-list .no-results');
        this.errorMessage = page.locator('app-book-list .error-container');
        this.loadingSpinner = page.locator('app-book-list mat-spinner');
    }

    async goto() {
        await this.page.goto('/suche');
    }

    async searchByTitel(titel: string) {
        await this.titelInput.fill(titel);
        await this.suchenButton.click();
        await this.waitForResults();
    }

    async searchByIsbn(isbn: string) {
        await this.isbnInput.fill(isbn);
        await this.suchenButton.click();
        await this.waitForResults();
    }

    async selectArt(art: string) {
        await this.artSelect.click();
        await this.page.locator(`mat-option:has-text("${art}")`).click();
    }

    async selectRating(rating: number) {
        await this.ratingRadios.locator(`mat-radio-button`).nth(rating + 1).click(); // nth(0) is 'Alle'
    }

    async checkLieferbar() {
        await this.lieferbarCheckbox.click();
    }

    async suchen() {
        // Explicit search triggering usually via main button or filter apply
        await this.suchenButton.click();
        await this.waitForResults();
    }

    async applyFilters() {
        await this.filterAnwendenButton.click();
        await this.waitForResults();
    }

    async zuruecksetzen() {
        await this.resetFilterButton.click();
    }

    async waitForResults() {
        // Wait for spinner to disappear
        await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }

    async getResultCount() {
        return await this.bookCards.count();
    }

    async clickFirstResult() {
        await this.bookCards.first().locator('button').click();
    }

    async hasNoResults() {
        return await this.noResultsMessage.isVisible();
    }

    async isPaginatorVisible() {
        return await this.paginator.isVisible();
    }
}
