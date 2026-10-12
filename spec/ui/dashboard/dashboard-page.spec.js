import { test } from '../../helpers/ui/ui-test';

test.describe('Dashboard', () => {
    test('opens the recipe list from its Recipes button', async ({ dashboardPage, recipesPage }) => {
        await dashboardPage.open();

        await dashboardPage.goToRecipes();

        await recipesPage.checkIsShown();
    });
});
