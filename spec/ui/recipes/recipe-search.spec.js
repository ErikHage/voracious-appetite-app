import { test } from '../../helpers/ui/ui-test';

test.describe('Recipe search', () => {
    test('finds a recipe by a word of its name', async ({ recipesPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');

        await recipesPage.search.searchForWordOf('recipe: chosen');

        await recipesPage.checkSearchFound('recipe: chosen');
    });

    test('ignores case', async ({ recipesPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');

        await recipesPage.search.searchForWordOf('recipe: chosen', 'case: upper');

        await recipesPage.checkSearchFound('recipe: chosen');
    });

    test('lists nothing when no recipe matches', async ({ recipesPage }) => {
        await recipesPage.open();

        await recipesPage.search.searchFor('text: zzz-no-such-recipe');

        await recipesPage.checkSearchFoundNothing();
    });

    test('lists every recipe again once cleared', async ({ recipesPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.search.searchForWordOf('recipe: chosen');

        await recipesPage.search.clear();

        await recipesPage.checkListsEveryRecipeByName();
    });

    test('keeps the search after opening a recipe and coming back', async ({ recipesPage, recipeDetailsPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.search.searchForWordOf('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');

        await recipeDetailsPage.goBackToRecipes();

        await recipesPage.search.checkHoldsWordOf('recipe: chosen');
        await recipesPage.checkSearchFound('recipe: chosen');
    });

    test('finds a recipe by its full name', async ({ recipesPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen', 'words: several');

        await recipesPage.search.searchForNameOf('recipe: chosen');

        await recipesPage.checkSearchFound('recipe: chosen');
    });

    test('finds a recipe by the words of its name in any order', async ({ recipesPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen', 'words: several');

        await recipesPage.search.searchForNameOf('recipe: chosen', 'order: reversed');

        await recipesPage.checkSearchFound('recipe: chosen');
    });
});
