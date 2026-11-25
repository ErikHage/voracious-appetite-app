import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

import { alias } from '../params';

/**
 * The breadcrumbs in the toolbar, in words. Every page object exposes them
 * as `breadcrumbs`. Where a step leads is checked by the destination page.
 */
export function createBreadcrumbs(world, driver) {
    return {
        /** Follows the Recipes crumb, back to the list. No parameters. */
        async goToRecipes(...args) {
            parseDslArgs(args, {});

            await driver.goToRecipes();
        },

        /** `recipe`: the trail reads Recipes, as a link, then the recipe. */
        async checkLeadsToRecipe(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.leadsToRecipe(world.recipeNamed(params.recipe));
        },

        /** `recipe`: the trail is the recipe alone, as on a phone. */
        async checkShowsOnlyRecipe(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.showsOnlyRecipe(world.recipeNamed(params.recipe));
        },
    };
}
