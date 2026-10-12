import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

/**
 * The recipe list page, in words.
 *
 * Parses each step's "name: value" arguments and delegates to the driver.
 * No locators and no assertions live here; the driver owns both. Smaller
 * parts of the page (the search box, say) become component objects in
 * ../components and are exposed here as properties.
 */
export function createRecipesPage(world, driver) {
    return {
        /** Opens the page and waits for it to show. No parameters. */
        async open(...args) {
            parseDslArgs(args, {});

            await driver.open();
        },

        /**
         * The list shows every recipe the app loaded, sorted by name, and the
         * counter agrees. No parameters.
         */
        async checkListsEveryRecipeByName(...args) {
            parseDslArgs(args, {});

            await driver.listsEveryRecipeByName();
        },
    };
}
