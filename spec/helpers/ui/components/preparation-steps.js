import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

/**
 * The "Steps" card, in words. A component of a recipe's page,
 * exposed there as `recipeDetailsPage.steps`.
 */
export function createPreparationSteps(world, driver) {
    return {
        /** At least one step, each worded, in a numbered list. No parameters. */
        async checkNumbersSteps(...args) {
            parseDslArgs(args, {});

            await driver.numbersSteps();
        },
    };
}
