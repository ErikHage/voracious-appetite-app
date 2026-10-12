import { test } from '../../helpers/ui/ui-test';

test.describe('Recipe details sections', () => {
    test.beforeEach(async ({ recipesPage }) => {
        await recipesPage.open();
        await recipesPage.chooseRecipe('recipe: chosen');
        await recipesPage.openRecipe('recipe: chosen');
    });

    test('shows its times and yield', async ({ recipeDetailsPage }) => {
        await recipeDetailsPage.timeAndYield.checkShowsTimes();
    });

    test('shows every nutrient, marking unknown ones', async ({ recipeDetailsPage }) => {
        await recipeDetailsPage.nutrition.checkShowsEveryNutrient();
    });

    test('lists its ingredients', async ({ recipeDetailsPage }) => {
        await recipeDetailsPage.ingredients.checkListsIngredients();
    });

    test('numbers its steps', async ({ recipeDetailsPage }) => {
        await recipeDetailsPage.steps.checkNumbersSteps();
    });
});
