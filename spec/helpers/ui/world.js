import { createDrivers } from './drivers/drivers';

/**
 * What a spec has named so far, plus the drivers for this test.
 *
 * Page and component objects are stateless; a recipe chosen on one page is
 * searched for, opened or checked on another, so the names live here. A name
 * stands for what the driver found when it was given (e.g. `{ name }`), since
 * the data is live and a spec can't know it in advance.
 *
 * One world per test, built over Playwright's `page`.
 */
export function createWorld(page) {
    const recipesByAlias = new Map();

    return {
        /** So a page object can be handed the driver it drives. */
        drivers: createDrivers(page),

        nameRecipe(alias, recipe) {
            if (recipesByAlias.has(alias)) {
                throw new Error(`a recipe called "${alias}" is already chosen in this test -- give the second one another name`);
            }
            recipesByAlias.set(alias, recipe);
        },

        recipeNamed(alias) {
            const recipe = recipesByAlias.get(alias);

            if (recipe === undefined) {
                throw new Error(`no recipe called "${alias}" in this test -- choose one first with recipesPage.chooseRecipe('recipe: ${alias}')`);
            }

            return recipe;
        },

        /** Forgets every name. Nothing to tear down: the suite only reads. */
        async cleanup() {
            recipesByAlias.clear();
        },
    };
}
