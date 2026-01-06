import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object für die Detail-Seite
 */
export class DetailPage {
    readonly page: Page;
    readonly backButton: Locator;
    readonly buchTitel: Locator;
    readonly buchUntertitel: Locator;
    readonly isbnValue: Locator;
    readonly artChip: Locator;
    readonly ratingStars: Locator;
    readonly preisValue: Locator;
    readonly rabattValue: Locator;
    readonly lieferbarStatus: Locator;
    readonly datumValue: Locator;
    readonly homepageLink: Locator;
    readonly schlagwoerterChips: Locator;
    readonly loadingSpinner: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backButton = page.locator('button.back-button');
        this.buchTitel = page.locator('mat-card-title');
        this.buchUntertitel = page.locator('mat-card-subtitle');
        this.isbnValue = page.locator('.detail-item').filter({ hasText: 'ISBN' }).locator('.detail-value');
        this.artChip = page.locator('.detail-item').filter({ hasText: 'Art' }).locator('mat-chip');
        this.ratingStars = page.locator('.detail-item').filter({ hasText: 'Rating' }).locator('.stars');
        this.preisValue = page.locator('.detail-item').filter({ hasText: 'Preis' }).locator('.detail-value');
        this.rabattValue = page.locator('.detail-item').filter({ hasText: 'Rabatt' }).locator('.detail-value');
        this.lieferbarStatus = page.locator('.detail-item').filter({ hasText: 'Lieferbar' }).locator('mat-chip');
        this.datumValue = page.locator('.detail-item').filter({ hasText: 'Erscheinungsdatum' }).locator('.detail-value');
        this.homepageLink = page.locator('.detail-item').filter({ hasText: 'Homepage' }).locator('a');
        this.schlagwoerterChips = page.locator('.detail-item.full-width').locator('mat-chip');
        this.loadingSpinner = page.locator('mat-spinner');
        this.errorMessage = page.locator('.error-container');
    }

    /**
     * Zu einer Detail-Seite navigieren
     */
    async goto(id: number) {
        await this.page.goto(`/buch/${id}`);
        await this.waitForLoad();
    }

    /**
     * Warten bis Seite geladen ist
     */
    async waitForLoad() {
        await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }

    /**
     * Zurück zur Suche navigieren
     */
    async goBack() {
        await this.backButton.click();
        await this.page.waitForURL('**/suche');
    }

    /**
     * Buchtitel abrufen
     */
    async getTitel() {
        return await this.buchTitel.textContent();
    }

    /**
     * Untertitel abrufen
     */
    async getUntertitel() {
        return await this.buchUntertitel.textContent();
    }

    /**
     * ISBN abrufen
     */
    async getIsbn() {
        return await this.isbnValue.textContent();
    }

    /**
     * Art abrufen
     */
    async getArt() {
        return await this.artChip.textContent();
    }

    /**
     * Preis abrufen
     */
    async getPreis() {
        return await this.preisValue.textContent();
    }

    /**
     * Prüfen ob Buch lieferbar ist
     */
    async isLieferbar() {
        const text = await this.lieferbarStatus.textContent();
        return text?.includes('Verfügbar');
    }

    /**
     * Prüfen ob Fehlermeldung angezeigt wird
     */
    async hasError() {
        return await this.errorMessage.isVisible();
    }

    /**
     * Schlagwörter abrufen
     */
    async getSchlagwoerter() {
        const chips = await this.schlagwoerterChips.allTextContents();
        return chips;
    }
}
