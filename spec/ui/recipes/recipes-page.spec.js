import { test } from '../../helpers/ui/ui-test';

test.describe('Recipes page', () => {
    test('lists every recipe the service has, sorted by name', async ({ recipesPage }) => {
        await recipesPage.open();

        await recipesPage.checkListsEveryRecipeByName();
    });
});
