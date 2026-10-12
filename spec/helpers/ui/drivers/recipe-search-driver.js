import { expectValue } from './assertions';

/**
 * The recipe search box, as Playwright sees it. What the search does to the
 * list is the recipes page driver's to check; this one only types.
 */
export function createRecipeSearchDriver(page) {
    const searchBox = page.getByRole('textbox', { name: 'Search...' });
    const clearButton = page.getByRole('button', { name: 'Clear' });

    return {
        async searchFor(text) {
            await searchBox.fill(text);
            await expectValue(searchBox, text, `searching for "${text}"`);
        },

        async clear() {
            await clearButton.click();
            await expectValue(searchBox, '', 'clearing the search');
        },
    };
}
