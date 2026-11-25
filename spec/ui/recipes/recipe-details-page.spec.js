import { test } from '../../helpers/ui/ui-test';

test.describe('Recipe details page', () => {
    test('shows the recipe opened from the list', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');

        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.checkShows('recipe: chosen');
    });

    test('titles the window after the recipe', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');

        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.checkTitlesWindowAfter('recipe: chosen');
    });

    test('says when a recipe does not exist', async ({ recipeDetailsPage, recipesPage }) => {
        await recipeDetailsPage.openUnknownRecipe();

        await recipeDetailsPage.checkReportsRecipeNotFound();

        // Still usable
        await recipeDetailsPage.nav.goToRecipes();
        await recipesPage.checkIsShown();
    });

    test('shows the same recipe after a reload', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');
        await recipeDetailsPage.checkShows('recipe: chosen');

        await recipeDetailsPage.reload();

        await recipeDetailsPage.checkShows('recipe: chosen');
    });
});
