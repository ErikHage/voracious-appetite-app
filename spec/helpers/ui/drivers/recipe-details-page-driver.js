import { expectText, expectUrl } from './assertions';
import { urlOf } from './screens';

const escapeForRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A recipe's own page, as Playwright sees it. It is reached from the list,
 * since a spec knows a recipe only by the name it was listed under.
 */
export function createRecipeDetailsPageDriver(page) {
    const main = page.getByRole('main');
    // Shown once the recipe has loaded; a skeleton stands in until then
    const heading = main.getByRole('heading', { level: 1 });
    const backLink = main.getByRole('link', { name: 'Back to recipes' });
    // `recipes/<id>`, where the id is whatever the service gave the recipe
    const detailsUrl = new RegExp(`^${escapeForRegExp(urlOf('recipes/'))}[^/]+$`);

    return {
        async shows(recipe) {
            const what = `showing recipe "${recipe.name}"`;

            await expectUrl(page, detailsUrl, what);
            await expectText(heading, recipe.name, what);
        },

        async goBackToRecipes() {
            await backLink.click();
        },

        async reload() {
            await page.reload();
        },
    };
}
