import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

/**
 * The "Ingredients" card, in words. A component of a recipe's page,
 * exposed there as `recipeDetailsPage.ingredients`.
 */
export function createIngredientsList(world, driver) {
    return {
        /** At least one ingredient, each with an amount and a name. No parameters. */
        async checkListsIngredients(...args) {
            parseDslArgs(args, {});

            await driver.listsIngredients();
        },
    };
}
