import { optional, parseDslArgs } from '@feral-auth/ts-simple-dsl';

import { alias } from '../params';
import { createRecipeSearch } from '../components/recipe-search';

/**
 * The recipe list page, in words.
 *
 * Parses each step's "name: value" arguments, resolves names through the
 * world, and delegates to the driver. No locators and no assertions live
 * here; the drivers own both. Parts of the page that are their own component
 * (the search box) are exposed as properties.
 */
export function createRecipesPage(world, driver) {
    return {
        /** The search box above the list. */
        search: createRecipeSearch(world, world.drivers.recipeSearch),

        /** Opens the page and waits for it to show. No parameters. */
        async open(...args) {
            parseDslArgs(args, {});

            await driver.open();
        },

        /**
         * Names a recipe from the list, for later steps: `recipe` (the alias)
         * and optional `words: any | several` (how many words its name must
         * have; default `any`). The first listed recipe that fits is chosen.
         */
        async chooseRecipe(...args) {
            const params = parseDslArgs(args, {
                recipe: alias(),
                words: optional().allowedValues('any', 'several').withDefault('any'),
            });

            world.nameRecipe(params.recipe, await driver.chooseRecipe({
                severalWords: params.words === 'several',
            }));
        },

        /**
         * The list shows every recipe the app loaded, sorted by name, and the
         * counter agrees. No parameters.
         */
        async checkListsEveryRecipeByName(...args) {
            parseDslArgs(args, {});

            await driver.listsEveryRecipeByName();
        },

        /**
         * `recipe`: the search narrowed the list, and the recipe is in what
         * is left.
         */
        async checkSearchFound(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.searchFound(world.recipeNamed(params.recipe));
        },

        /** The search left nothing in the list. No parameters. */
        async checkSearchFoundNothing(...args) {
            parseDslArgs(args, {});

            await driver.searchFoundNothing();
        },

        /** `recipe`: searching for its whole name lists it. */
        async checkFindsRecipeByFullName(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.fullNameSearchFindsNothing(world.recipeNamed(params.recipe));
        },
    };
}
