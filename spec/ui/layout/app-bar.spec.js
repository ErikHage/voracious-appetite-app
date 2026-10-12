import { test } from '../../helpers/ui/ui-test';

test.describe('App bar', () => {
    test('opens the recipe list from another page', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.appBar.goToRecipes();

        await recipesPage.checkIsShown();
    });

    test('returns to the dashboard from its home icon on a phone', async ({ recipesPage, dashboardPage }) => {
        await recipesPage.open('screen: phone');

        await recipesPage.appBar.goHome();

        await dashboardPage.checkIsShown();
    });
});
