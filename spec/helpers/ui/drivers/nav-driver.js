import { expectAttribute, expectCount } from './assertions';

/**
 * The side drawer, with a link to every page, as Playwright sees it.
 *
 * It's FrAppShell's navigation drawer, a `navigation` named "Main". It marks
 * the link of the page the browser is on, or the page it's under (a recipe's
 * page is under Recipes), with `aria-current="page"`.
 *
 * On a phone (below Vuetify's md breakpoint, 960px) it's hidden, and the
 * banner's Menu button slides it in over the page. Hidden, it's off screen,
 * but Playwright's role locators still find its links, and call them
 * visible. So `goTo` opens it first.
 */

// Each link's name
const destinations = {
    home: 'Home',
    recipes: 'Recipes',
};

const phoneWidth = 960;

export function createNavDriver(page) {
    const drawer = page.getByRole('navigation', { name: 'Main', exact: true });
    const menuButton = page.getByRole('banner').getByRole('button', { name: 'Menu' });
    const link = destination => drawer.getByRole('link', { name: destinations[destination], exact: true });
    const onAPhone = () => (page.viewportSize()?.width ?? phoneWidth) < phoneWidth;

    return {
        /** Follows the link to `destination`, a key of `destinations`, opening the drawer first on a phone. */
        async goTo(destination) {
            if (onAPhone()) {
                await menuButton.click();
            }
            await link(destination).click();
        },

        /** `destination`'s link is the current page's, and it's the only one marked. */
        async marks(destination) {
            const what = `the side drawer marking ${destinations[destination]} as the current page`;

            await expectAttribute(link(destination), 'aria-current', 'page', what);
            await expectCount(drawer.locator('[aria-current="page"]'), 1, what);
        },
    };
}
