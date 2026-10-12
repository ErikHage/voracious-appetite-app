import {
    expectCount,
    expectNotEmpty,
    expectNotText,
    expectSorted,
    expectText,
    expectThat,
    expectUrl,
    expectVisible,
} from './assertions';
import { openOn, urlOf } from './screens';

// The app's sort rule, re-stated rather than imported from src/, so a change
// to it breaks this test instead of silently agreeing with it
const byName = (a, b) => a.localeCompare(b);

/**
 * The recipe list page, as Playwright sees it. Owns the locators and every
 * assertion about this page.
 *
 * The data is live, so expectations are about shape and invariants, or about
 * a recipe this test chose from the list, never about a particular recipe.
 */
export function createRecipesPageDriver(page) {
    const heading = page.getByRole('heading', { name: 'Recipes', level: 1 });
    const recipeButtons = page.getByRole('table').getByRole('button');
    const recipeButton = name => page.getByRole('table').getByRole('button', { name, exact: true });
    const counter = page.getByText(/^Showing \d+ of \d+ recipes$/);

    async function listedNames(what) {
        // Waits for the recipes to load before reading them
        await expectNotEmpty(recipeButtons, what);
        return (await recipeButtons.allTextContents()).map(name => name.trim());
    }

    // `Showing M of N recipes`, as numbers
    async function counted() {
        const [, shown, total] = (await counter.textContent()).match(/^Showing (\d+) of (\d+)/);
        return { shown: Number(shown), total: Number(total) };
    }

    async function listIsEmpty(what) {
        await expectCount(recipeButtons, 0, what);
        await expectText(counter, /^Showing 0 of [1-9]\d* recipes$/, what);
    }

    return {
        async open(screen) {
            await openOn(page, screen, 'recipes');
            await expectVisible(heading, 'opening the recipes page');
        },

        async isShown() {
            const what = 'showing the recipes page';

            await expectUrl(page, urlOf('recipes'), what);
            await expectVisible(heading, what);
        },

        async openRecipe(recipe) {
            await recipeButton(recipe.name).click();
        },

        /** Returns `{ name }` for the first listed recipe that fits. */
        async chooseRecipe({ severalWords }) {
            const what = `choosing a recipe${severalWords ? ' with several words in its name' : ''}`;
            const name = (await listedNames(what))
                .find(listed => !severalWords || listed.includes(' '));

            expectThat(name !== undefined, 'a recipe in the list that fits', 'none did', what);

            return { name };
        },

        async listsEveryRecipeByName() {
            const what = 'listing every recipe on the recipes page';
            const names = await listedNames(what);

            expectSorted(names, byName, what);
            // The total comes from the store, so a mismatch means rows are missing
            await expectText(counter, `Showing ${names.length} of ${names.length} recipes`, what);
        },

        async searchFound(recipe) {
            const what = `searching for recipe "${recipe.name}"`;

            const { total } = await counted();

            // Retries until the filtered list has rendered, so nothing below
            // reads the full list. Since M can't exceed N, it also proves the
            // search narrowed the list
            await expectNotText(counter, `Showing ${total} of ${total} recipes`, what);
            await expectVisible(recipeButton(recipe.name), what);

            const { shown } = await counted();

            await expectCount(recipeButtons, shown, what);
        },

        async searchFoundNothing() {
            await listIsEmpty('searching for something no recipe has');
        },

        // Today's behaviour. recipes-service builds the string the search
        // matches by joining a name's words with '.', so a search with a space
        // in it matches nothing
        async fullNameSearchFindsNothing(recipe) {
            await listIsEmpty(`searching for the full name "${recipe.name}"`);
        },
    };
}
