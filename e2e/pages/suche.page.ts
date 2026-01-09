import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object für die Such-Seite
 */
export class SuchePage {
    readonly page: Page;

    // Searchbar Component
    readonly titelInput: Locator;
    readonly isbnInput: Locator;
    readonly suchenButton: Locator;

    // Filter Component
    readonly artSelect: Locator;
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

        // Searchbar selectors
        this.titelInput = page.locator('app-searchbar input').first();
        this.isbnInput = page.locator('app-searchbar input').nth(1);
        this.suchenButton = page.locator('app-searchbar button').filter({ hasText: 'Suchen' });

        // Filter selectors
        this.artSelect = page.locator('app-filter mat-select');
        this.lieferbarCheckbox = page.locator('app-filter mat-checkbox');
        this.filterAnwendenButton = page.locator('app-filter button').filter({ hasText: 'Filter anwenden' });
        this.resetFilterButton = page.locator('app-filter button[mat-icon-button]').first();

        // BookList selectors
        this.suchergebnisseGrid = page.locator('app-book-list .book-grid');
        this.bookCards = page.locator('app-book-list mat-card.book-card');
        this.paginator = page.locator('app-book-list mat-paginator');
        this.noResultsMessage = page.locator('app-book-list .no-results');
        this.errorMessage = page.locator('app-book-list .error-container');
        this.loadingSpinner = page.locator('app-book-list mat-spinner');
    }

    async goto() {
        await this.page.goto('/suche');
        await this.page.waitForLoadState('networkidle');
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

    async checkLieferbar() {
        await this.lieferbarCheckbox.click();
    }

    async suchen() {
        await this.suchenButton.click();
        await this.waitForResults();
    }

    async applyFilters() {
        await this.filterAnwendenButton.click();
        await this.waitForResults();
    }

    async zuruecksetzen() {
        await this.resetFilterButton.click();
        await this.waitForResults();
    }

    async waitForResults() {
        await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
        await this.page.waitForTimeout(500);
    }

    async getResultCount() {
        return await this.bookCards.count();
    }

    async clickFirstResult() {
        await this.bookCards.first().locator('button').filter({ hasText: 'DETAILS' }).click();
    }

    async hasNoResults() {
        return await this.noResultsMessage.isVisible();
    }

    async isPaginatorVisible() {
        return await this.paginator.isVisible();
    }
}
