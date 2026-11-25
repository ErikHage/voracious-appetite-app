import { test } from '../../helpers/ui/ui-test';

test.describe('Navigation', () => {
    test('opens the recipe list from another page', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.nav.goToRecipes();

        await recipesPage.checkIsShown();
    });

    test('goes home from the drawer on a phone', async ({ recipesPage, dashboardPage }) => {
        await recipesPage.open('screen: phone');

        await recipesPage.nav.goToHome();

        await dashboardPage.checkIsShown();
    });

    test("marks Recipes on a recipe's page", async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');
        await recipeDetailsPage.checkShows('recipe: chosen');

        await recipeDetailsPage.nav.checkMarks('link: recipes');
    });
});
