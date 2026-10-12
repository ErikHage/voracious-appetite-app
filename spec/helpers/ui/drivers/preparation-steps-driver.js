import { expectCount, expectEach, expectNotEmpty } from './assertions';
import { cardTitled } from './cards';

/** The "Steps" card on a recipe's page, as Playwright sees it. */
export function createPreparationStepsDriver(page) {
    const card = cardTitled(page, 'Steps');
    const steps = card.getByRole('listitem');

    return {
        async numbersSteps() {
            const what = 'numbering the recipe\'s steps';

            // Waits for the recipe to load before reading the card
            await expectNotEmpty(steps, what);
            const texts = (await steps.allTextContents()).map(text => text.trim());

            // Numbered means an ordered list; the browser draws the numbers
            await expectCount(card.locator('ol > li'), texts.length, what);
            expectEach(texts, text => text !== '', 'worded', what);
        },
    };
}
