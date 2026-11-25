import { parseDslArgs, required } from '@feral-auth/ts-simple-dsl';

/**
 * The side drawer, with a link to every page, in words. Every page object
 * exposes it as `nav`. Where a step leads is checked by the destination page.
 */
export function createNav(world, driver) {
    // Each step follows one link, and takes no parameters
    const goTo = destination => async (...args) => {
        parseDslArgs(args, {});

        await driver.goTo(destination);
    };

    return {
        /** Follows the Home link. No parameters. */
        goToHome: goTo('home'),

        /** Follows the Recipes link. No parameters. */
        goToRecipes: goTo('recipes'),

        /**
         * `link: home | recipes`: the drawer marks that link as the current
         * page, and no other.
         */
        async checkMarks(...args) {
            const params = parseDslArgs(args, {
                link: required().allowedValues('home', 'recipes'),
            });

            await driver.marks(params.link);
        },
    };
}
