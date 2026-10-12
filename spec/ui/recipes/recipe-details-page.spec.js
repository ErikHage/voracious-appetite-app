import { test } from '../../helpers/ui/ui-test';

test.describe('Recipe details page', () => {
    test('shows the recipe opened from the list', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');

        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.checkShows('recipe: chosen');
    });

    test('returns to the list from its back link', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.goBackToRecipes();

        await recipesPage.checkIsShown();
    });

    // DocumentsCurrentBehavior: keeps showing "Loading..." after recipes-service
    // answers 404, and says nothing else. The error alert sits inside the block
    // that renders only once a recipe has loaded. Should say the recipe wasn't
    // found.
    test('says when a recipe does not exist', async ({ recipeDetailsPage, recipesPage }) => {
        await recipeDetailsPage.openUnknownRecipe();

        await recipeDetailsPage.checkReportsRecipeNotFound();

        // Still usable
        await recipeDetailsPage.goBackToRecipes();
        await recipesPage.checkIsShown();
    });

    test('shows the same recipe after a reload', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.reload();

        await recipeDetailsPage.checkShows('recipe: chosen');
    });
});
