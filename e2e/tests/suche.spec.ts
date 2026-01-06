import { test, expect } from '../fixtures/test.fixture';

test.describe('Suche', () => {
    test.beforeEach(async ({ suchePage }) => {
        await suchePage.goto();
    });

    test('sollte Suchformular und Filter anzeigen', async ({ suchePage }) => {
        await expect(suchePage.titelInput).toBeVisible();
        await expect(suchePage.isbnInput).toBeVisible();

        // Filter prüfen (Sidebar muss evtl. geöffnet sein auf Mobile, Desktop ist sie offen)
        await expect(suchePage.artSelect).toBeVisible();
        await expect(suchePage.lieferbarCheckbox).toBeVisible();
        await expect(suchePage.suchenButton).toBeVisible();
    });

    test('sollte initiale Suchergebnisse laden', async ({ suchePage }) => {
        await suchePage.waitForResults();

        // Grid sollte sichtbar sein
        await expect(suchePage.suchergebnisseGrid).toBeVisible();
    });

    test('sollte nach Titel filtern können', async ({ suchePage }) => {
        await suchePage.searchByTitel('Alpha');

        // Ergebnis-Grid sollte sichtbar sein
        await expect(suchePage.suchergebnisseGrid).toBeVisible();
    });

    test('sollte leere Ergebnisse bei unbekanntem Titel anzeigen', async ({ suchePage }) => {
        await suchePage.searchByTitel('XYZ_NICHT_VORHANDEN_123');

        // No-Results Nachricht
        const hasNoResults = await suchePage.hasNoResults();
        expect(hasNoResults).toBe(true);
    });

    test('sollte Art-Filter verwenden können', async ({ suchePage }) => {
        await suchePage.selectArt('EPUB');
        await suchePage.applyFilters(); // Filter explizit anwenden

        // Grid sollte sichtbar sein
        await expect(suchePage.suchergebnisseGrid).toBeVisible();
    });

    test('sollte Lieferbar-Filter aktivieren können', async ({ suchePage }) => {
        await suchePage.checkLieferbar();
        await suchePage.applyFilters();

        // Grid sollte sichtbar sein
        await expect(suchePage.suchergebnisseGrid).toBeVisible();
    });

    test('sollte Formular zurücksetzen können', async ({ suchePage }) => {
        await suchePage.titelInput.fill('Test');
        await suchePage.zuruecksetzen();

        // Input sollte leer sein
        await expect(suchePage.titelInput).toHaveValue('');
    });

    test('sollte zur Detail-Seite navigieren beim Klick auf Ergebnis', async ({ suchePage, page }) => {
        await suchePage.waitForResults();

        const resultCount = await suchePage.getResultCount();
        if (resultCount > 0) {
            await suchePage.clickFirstResult();

            // URL sollte Detail-Muster entsprechen
            await expect(page).toHaveURL(/\/buch\/\d+/);
        }
    });
});

test.describe('Suche mit Pagination', () => {
    test('sollte Paginator anzeigen bei vielen Ergebnissen', async ({ suchePage }) => {
        await suchePage.goto();
        await suchePage.waitForResults();

        // Paginator prüfen
        const isPaginatorVisible = await suchePage.isPaginatorVisible();
        expect(isPaginatorVisible).toBe(true);
    });
});
