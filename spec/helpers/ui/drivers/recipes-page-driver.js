import { expectNotEmpty, expectSorted, expectText, expectVisible } from './assertions';

// The app's sort rule, re-stated rather than imported from src/, so a change
// to it breaks this test instead of silently agreeing with it
const byName = (a, b) => a.localeCompare(b);

/**
 * The recipe list page, as Playwright sees it. Owns the locators and every
 * assertion about this page.
 *
 * The data is live, so expectations are about shape and invariants, never
 * about a particular recipe.
 */
export function createRecipesPageDriver(page) {
    const heading = page.getByRole('heading', { name: 'Recipes', level: 1 });
    const recipeButtons = page.getByRole('table').getByRole('button');
    const counter = page.getByText(/^Showing \d+ of \d+ recipes$/);

    return {
        async open() {
            // Relative to baseURL, which ends in the app's base path
            await page.goto('recipes');
            await expectVisible(heading, 'opening the recipes page');
        },

        async listsEveryRecipeByName() {
            const what = 'listing every recipe on the recipes page';

            // Waits for the recipes to load before reading them
            await expectNotEmpty(recipeButtons, what);
            const names = (await recipeButtons.allTextContents()).map(name => name.trim());

            expectSorted(names, byName, what);
            // The total comes from the store, so a mismatch means rows are missing
            await expectText(counter, `Showing ${names.length} of ${names.length} recipes`, what);
        },
    };
}
