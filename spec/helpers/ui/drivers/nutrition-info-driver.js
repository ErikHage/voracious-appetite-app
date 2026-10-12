import { expectCount, expectEach, expectEqual } from './assertions';
import { cardTitled, rowTexts } from './cards';

const nutrients = ['Calories', 'Fats (g)', 'Carbs (g)', 'Sugars (g)', 'Protein (g)'];

// A nutrient the recipe doesn't give shows as ---
const isAmountOrUnknown = value => /^\d+(\.\d+)?$/.test(value) || value === '---';

/** The "Nutritional Information" card on a recipe's page, as Playwright sees it. */
export function createNutritionInfoDriver(page) {
    const card = cardTitled(page, 'Nutritional Information');

    return {
        async showsEveryNutrient() {
            const what = 'showing the recipe\'s nutritional information';

            // Waits for the recipe to load before reading the card
            await expectCount(card.getByRole('row'), nutrients.length, what);
            const rows = await rowTexts(card);

            expectEqual(rows.map(([nutrient]) => nutrient), nutrients, what);
            expectEach(rows.map(([, amount]) => amount), isAmountOrUnknown, 'a number or ---', what);
        },
    };
}
