import { test } from '../../helpers/ui/ui-test';

test.describe('Breadcrumbs', () => {
    test("lead from Recipes to the recipe on its page", async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');
        await recipeDetailsPage.checkShows('recipe: chosen');

        await recipeDetailsPage.breadcrumbs.checkLeadsToRecipe('recipe: chosen');
    });

    test('return to the recipe list from a recipe', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');
        await recipeDetailsPage.checkShows('recipe: chosen');

        await recipeDetailsPage.breadcrumbs.goToRecipes();

        await recipesPage.checkIsShown();
    });

    test('show the recipe alone on a phone', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open('screen: phone');
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');
        await recipeDetailsPage.checkShows('recipe: chosen');

        await recipeDetailsPage.breadcrumbs.checkShowsOnlyRecipe('recipe: chosen');
    });
});
