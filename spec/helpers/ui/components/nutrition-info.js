import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

/**
 * The "Nutritional Information" card, in words. A component of a recipe's page,
 * exposed there as `recipeDetailsPage.nutrition`.
 */
export function createNutritionInfo(world, driver) {
    return {
        /**
         * The serving size and every nutrient are listed, in order: the serving size
         * as a number with an optional unit, the nutrients as numbers, any of them
         * --- when unknown. No parameters.
         */
        async checkShowsEveryNutrient(...args) {
            parseDslArgs(args, {});

            await driver.showsEveryNutrient();
        },
    };
}
