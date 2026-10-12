import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

import { screen } from '../params';
import { createAppBar } from '../components/app-bar';

/** The dashboard, the app's landing page, in words. */
export function createDashboardPage(world, driver) {
    return {
        appBar: createAppBar(world, world.drivers.appBar),

        /** Opens the page, on optional `screen: desktop | phone` (default desktop). */
        async open(...args) {
            const params = parseDslArgs(args, { screen: screen() });

            await driver.open(params.screen);
        },

        /** Follows the Recipes button on the page itself. No parameters. */
        async goToRecipes(...args) {
            parseDslArgs(args, {});

            await driver.goToRecipes();
        },

        /** The browser is on the dashboard. No parameters. */
        async checkIsShown(...args) {
            parseDslArgs(args, {});

            await driver.isShown();
        },
    };
}
