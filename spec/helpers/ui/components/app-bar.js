import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

/**
 * The app bar at the top of every page, in words. Every page object exposes
 * it as `appBar`. Where a step leads is checked by the destination page.
 */
export function createAppBar(world, driver) {
    return {
        /** Follows the Recipes link. No parameters. */
        async goToRecipes(...args) {
            parseDslArgs(args, {});

            await driver.goToRecipes();
        },

        /** Follows the home icon, which shows only on a phone screen. No parameters. */
        async goHome(...args) {
            parseDslArgs(args, {});

            await driver.goHome();
        },
    };
}
