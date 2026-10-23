import { expectCount, expectEach, expectEqual } from './assertions';
import { cardTitled, rowTexts } from './cards';

const nutrients = ['Serving Size', 'Calories', 'Fats (g)', 'Carbs (g)', 'Sugars (g)', 'Protein (g)'];

// A nutrient the recipe doesn't give shows as ---
const isAmountOrUnknown = value => /^\d+(\.\d+)?$/.test(value) || value === '---';

// e.g. "1 cup", or just "2" when the recipe gives no type
const isServingSizeOrUnknown = value => /^\d+(\.\d+)?( \S.*)?$/.test(value) || value === '---';

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
            const [[, servingSize], ...amounts] = rows;
            expectEach([servingSize], isServingSizeOrUnknown, 'a number with an optional unit, or ---', what);
            expectEach(amounts.map(([, amount]) => amount), isAmountOrUnknown, 'a number or ---', what);
        },
    };
}
