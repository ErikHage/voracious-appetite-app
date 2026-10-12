import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

/**
 * The "Nutritional Information" card, in words. A component of a recipe's page,
 * exposed there as `recipeDetailsPage.nutrition`.
 */
export function createNutritionInfo(world, driver) {
    return {
        /** Every nutrient is listed, in order, as a number or ---. No parameters. */
        async checkShowsEveryNutrient(...args) {
            parseDslArgs(args, {});

            await driver.showsEveryNutrient();
        },
    };
}
