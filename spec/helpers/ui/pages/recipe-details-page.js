import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

import { alias } from '../params';
import { createAppBar } from '../components/app-bar';

/**
 * A recipe's own page, in words. There is no `open`: a spec reaches it from
 * the list with `recipesPage.openRecipe('recipe: ...')`, since it knows a
 * recipe only by the name it was listed under.
 */
export function createRecipeDetailsPage(world, driver) {
    return {
        appBar: createAppBar(world, world.drivers.appBar),

        /** `recipe`: the page shows that recipe. */
        async checkShows(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.shows(world.recipeNamed(params.recipe));
        },

        /** Follows the "Back to recipes" link. No parameters. */
        async goBackToRecipes(...args) {
            parseDslArgs(args, {});

            await driver.goBackToRecipes();
        },

        /** Reloads the page in the browser. No parameters. */
        async reload(...args) {
            parseDslArgs(args, {});

            await driver.reload();
        },
    };
}
