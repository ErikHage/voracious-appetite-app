import { expectEach, expectNotEmpty } from './assertions';
import { cardTitled, rowTexts } from './cards';

/** The "Ingredients" card on a recipe's page, as Playwright sees it. */
export function createIngredientsListDriver(page) {
    const card = cardTitled(page, 'Ingredients');

    return {
        async listsIngredients() {
            const what = 'listing the recipe\'s ingredients';

            // Waits for the recipe to load before reading the card
            await expectNotEmpty(card.getByRole('row'), what);
            const rows = await rowTexts(card);

            // A quantity, then a name (with any notes after it). The unit can
            // be blank, but the amount can't
            expectEach(rows, row => row.length === 2, 'a quantity and a name', what);
            expectEach(rows, ([quantity]) => /^\S/.test(quantity), 'led by an amount', what);
            expectEach(rows, ([, name]) => name !== '', 'named', what);
        },
    };
}
