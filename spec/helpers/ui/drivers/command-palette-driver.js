import { expectSorted, expectThat, expectVisible } from './assertions';

// The app's rules for the palette's recipes, re-stated rather than imported
// from src/, so a change to them breaks this test instead of agreeing with it
const byName = (a, b) => a.localeCompare(b);
const maxRecipes = 10;

/**
 * FrAppShell's command palette, as Playwright sees it: a dialog named
 * "Command palette" that Ctrl+K opens on any page. Its search box is a
 * combobox named after its placeholder, and what it finds are options in a
 * listbox, grouped under headings. The app's recipes are the group named
 * "RECIPES".
 */
export function createCommandPaletteDriver(page) {
    const palette = page.getByRole('dialog', { name: 'Command palette', exact: true });
    // Vuetify wraps the input in a second, unnamed combobox
    const searchBox = palette.getByRole('combobox', { name: /^Search views/ });
    const recipes = palette.getByRole('group', { name: 'RECIPES', exact: true });
    const recipeOptions = recipes.getByRole('option');
    const recipeOption = name => recipes.getByRole('option', { name, exact: true });

    return {
        /** Opens the palette with Ctrl+K and types `text` into it. */
        async searchFor(text) {
            await page.keyboard.press('Control+k');
            await expectVisible(searchBox, 'opening the command palette with Ctrl+K');
            await searchBox.fill(text);
        },

        /**
         * `recipe` is among the recipes found, which are sorted by name and
         * no more than ten.
         */
        async found(recipe) {
            const what = `finding recipe "${recipe.name}" in the command palette`;

            // Waits for the recipes to arrive before reading them
            await expectVisible(recipeOption(recipe.name), what);
            const names = (await recipeOptions.allTextContents()).map(name => name.trim());

            expectThat(names.length <= maxRecipes, `at most ${maxRecipes} recipes`, `${names.length}`, what);
            expectSorted(names, byName, what);
        },

        /** Chooses `recipe` from what the palette found. */
        async choose(recipe) {
            await recipeOption(recipe.name).click();
        },
    };
}
