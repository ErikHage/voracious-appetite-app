import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

import { alias } from '../params';

/**
 * The command palette, which Ctrl+K opens on every page, in words. Every
 * page object exposes it as `palette`. Where choosing something leads is
 * checked by the destination page.
 */
export function createCommandPalette(world, driver) {
    return {
        /** `recipe`: opens the palette and types the recipe's whole name. */
        async searchForNameOf(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.searchFor(world.recipeNamed(params.recipe).name);
        },

        /**
         * `recipe`: the palette found it among its recipes, which it lists by
         * name, ten at most.
         */
        async checkFound(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.found(world.recipeNamed(params.recipe));
        },

        /** `recipe`: chooses it from what the palette found. */
        async choose(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.choose(world.recipeNamed(params.recipe));
        },
    };
}
