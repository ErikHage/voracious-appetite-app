import { test } from '../../helpers/ui/ui-test';

test.describe('Command palette', () => {
    // The dashboard is opened afresh, so the app hasn't loaded the recipe
    // list: the palette has to load it itself
    test('opens a recipe found by name, from a page without the list', async ({ recipesPage, dashboardPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await dashboardPage.open();

        await dashboardPage.palette.searchForNameOf('recipe: chosen');
        await dashboardPage.palette.checkFound('recipe: chosen');
        await dashboardPage.palette.choose('recipe: chosen');

        await recipeDetailsPage.checkShows('recipe: chosen');
    });
});
