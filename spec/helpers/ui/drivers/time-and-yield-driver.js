import { expectEach, expectNotEmpty, expectThat } from './assertions';
import { cardTitled, rowTexts } from './cards';

// Each row shows only when the recipe has that field, but always in this order
const headers = ['Prep Time', 'Cook Time', 'Yield'];

/** The "Time and Yield" card on a recipe's page, as Playwright sees it. */
export function createTimeAndYieldDriver(page) {
    const card = cardTitled(page, 'Time and Yield');

    return {
        async showsTimes() {
            const what = 'showing the recipe\'s time and yield';

            // Waits for the recipe to load before reading the card
            await expectNotEmpty(card.getByRole('row'), what);
            const rows = await rowTexts(card);
            const shown = rows.map(([header]) => header);

            expectThat(
                shown.every((header, i) => headers.indexOf(header) > headers.indexOf(shown[i - 1] ?? '')),
                `rows from ${headers.join(', ')}, in that order`,
                shown.join(', '),
                what,
            );
            // e.g. "10 minutes", "6 servings"
            expectEach(rows, ([, value]) => /^\S+ \S/.test(value), 'a value and a unit', what);
        },
    };
}
