import { expectUrl, expectVisible } from './assertions';
import { openOn, urlOf } from './screens';

/** The dashboard, the app's landing page, as Playwright sees it. */
export function createDashboardPageDriver(page) {
    const main = page.getByRole('main');
    const heading = main.getByRole('heading', { name: 'Voracious Appetite', level: 1 });
    const recipesButton = main.getByRole('button', { name: 'Recipes', exact: true });

    return {
        async open(screen) {
            await openOn(page, screen, '');
            await expectVisible(heading, 'opening the dashboard');
        },

        async goToRecipes() {
            await recipesButton.click();
        },

        async isShown() {
            const what = 'showing the dashboard';

            await expectUrl(page, urlOf(''), what);
            await expectVisible(heading, what);
        },
    };
}
