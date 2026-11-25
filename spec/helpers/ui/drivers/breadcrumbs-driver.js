import { expectText, expectVisible } from './assertions';

/**
 * The breadcrumbs in the toolbar, as Playwright sees them: the banner's
 * list, one item per crumb (the dividers between them are hidden from it).
 * A crumb that leads somewhere is a link; the page's own is plain text.
 */
export function createBreadcrumbsDriver(page) {
    const crumbs = page.getByRole('banner').getByRole('list').getByRole('listitem');
    const recipesLink = crumbs.getByRole('link', { name: 'Recipes', exact: true });

    return {
        async goToRecipes() {
            await recipesLink.click();
        },

        async leadsToRecipe(recipe) {
            const what = `the breadcrumbs leading to recipe "${recipe.name}"`;

            await expectText(crumbs, ['Recipes', recipe.name], what);
            await expectVisible(recipesLink, what);
        },

        async showsOnlyRecipe(recipe) {
            await expectText(crumbs, [recipe.name], `the breadcrumbs showing recipe "${recipe.name}" alone`);
        },
    };
}
