import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

/**
 * The "Time and Yield" card, in words. A component of a recipe's page,
 * exposed there as `recipeDetailsPage.timeAndYield`.
 */
export function createTimeAndYield(world, driver) {
    return {
        /** Each row is a time or the yield, in order, with a value and a unit. No parameters. */
        async checkShowsTimes(...args) {
            parseDslArgs(args, {});

            await driver.showsTimes();
        },
    };
}
