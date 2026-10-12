import { optional, parseDslArgs, required } from '@feral-auth/ts-simple-dsl';

import { alias } from '../params';

// The longest word is the least likely to appear in every recipe, so a
// search for it narrows the list
const longestWord = name => name.split(' ').reduce((a, b) => (b.length > a.length ? b : a));

/**
 * The recipe search box, in words. A component of the recipes page, exposed
 * there as `recipesPage.search`.
 */
export function createRecipeSearch(world, driver) {
    return {
        /** `text`: what to type into the search box. */
        async searchFor(...args) {
            const params = parseDslArgs(args, { text: required() });

            await driver.searchFor(params.text);
        },

        /**
         * `recipe`, and optional `case: unchanged | upper` (default
         * `unchanged`): searches for the longest word of the recipe's name.
         */
        async searchForWordOf(...args) {
            const params = parseDslArgs(args, {
                recipe: alias(),
                case: optional().allowedValues('unchanged', 'upper').withDefault('unchanged'),
            });

            const word = longestWord(world.recipeNamed(params.recipe).name);

            await driver.searchFor(params.case === 'upper' ? word.toUpperCase() : word);
        },

        /** `recipe`: searches for the recipe's whole name, as listed. */
        async searchForNameOf(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.searchFor(world.recipeNamed(params.recipe).name);
        },

        /** `recipe`: the search box still holds the word searched for by `searchForWordOf`. */
        async checkHoldsWordOf(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.holds(longestWord(world.recipeNamed(params.recipe).name));
        },

        /** Empties the search box with its clear button. No parameters. */
        async clear(...args) {
            parseDslArgs(args, {});

            await driver.clear();
        },
    };
}
