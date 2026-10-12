import { randomBytes } from 'node:crypto';

import { expectText, expectThat, expectUrl, expectVisible } from './assertions';
import { openOn, urlOf } from './screens';
import { recipesServiceUrl } from '../setup/config';

const escapeForRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Prefixed so it's recognisable in the service's logs, and suffixed so it
// can't collide with a real id
const unknownRecipeId = () => `ui-no-such-recipe-${randomBytes(3).toString('hex')}`;

/**
 * A recipe's own page, as Playwright sees it. It is reached from the list,
 * since a spec knows a recipe only by the name it was listed under, or by an
 * id made up to not exist.
 */
export function createRecipeDetailsPageDriver(page) {
    const main = page.getByRole('main');
    // Shown once the recipe has loaded; a skeleton stands in until then
    const heading = main.getByRole('heading', { level: 1 });
    // The skeleton announces itself as an alert, so it counts among these
    const alerts = main.getByRole('alert');
    const loading = main.getByRole('alert', { name: 'Loading...' });
    const backLink = main.getByRole('link', { name: 'Back to recipes' });
    // `recipes/<id>`, where the id is whatever the service gave the recipe
    const detailsUrl = new RegExp(`^${escapeForRegExp(urlOf('recipes/'))}[^/]+$`);

    return {
        async shows(recipe) {
            const what = `showing recipe "${recipe.name}"`;

            await expectUrl(page, detailsUrl, what);
            await expectText(heading, recipe.name, what);
        },

        /**
         * Opens the page for an id the service doesn't have, and returns once
         * the app has handled the 404, so a check that follows sees whatever
         * the app does about it rather than a page still loading.
         */
        async openUnknownRecipe() {
            const id = unknownRecipeId();
            const what = `opening recipe "${id}", which doesn't exist`;
            // The service's URL exactly: the page's own URL ends in /recipes/<id> too
            const answered = page.waitForResponse(`${recipesServiceUrl}/recipes/${id}`);
            // The app logs the failure as it handles it, just before showing
            // anything about it
            const handled = page.waitForEvent('console', {
                predicate: message => message.type() === 'error' && message.text().includes('ApiError'),
                timeout: 10_000,
            });

            await openOn(page, 'desktop', `recipes/${id}`);

            // The control: the service really did say "not found", so what
            // follows is the app's handling of that, not of some other failure
            const status = (await answered).status();
            expectThat(status === 404, 'recipes-service to answer 404', `it answered ${status}`, what);
            await handled;
        },

        // Today's behaviour: the error alert sits inside the block that renders
        // only once a recipe has loaded, so the skeleton stays and nothing else
        // shows
        async keepsShowingLoading() {
            const what = 'showing a recipe that doesn\'t exist';

            await expectVisible(loading, what);

            // Read once, not with a retrying assertion: the app's error alert
            // fades out after 3 seconds, so retrying "only one alert" would
            // pass once it had gone. openUnknownRecipe waited until the app
            // had handled the 404, so anything it shows is already there
            const shown = await alerts.allTextContents();
            expectThat(shown.length === 1, 'only the "Loading..." skeleton', JSON.stringify(shown), what);
            expectThat(await heading.count() === 0, 'no recipe heading', 'a heading', what);
        },

        async goBackToRecipes() {
            await backLink.click();
        },

        async reload() {
            await page.reload();
        },
    };
}
