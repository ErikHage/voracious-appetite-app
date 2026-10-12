import { test as base } from '@playwright/test';

import { createWorld } from './world';
import { createRecipesPage } from './pages/recipes-page';

/**
 * The one thing a spec imports.
 *
 * Playwright's `test`, extended with a fixture per page object, so a spec
 * asks for the pages it uses by name: `async ({ recipesPage }) => ...`.
 * Everything a spec can say lives behind these, so the layering is
 * checkable: any other import in spec/ui is a spec reaching past the pages.
 *
 * `expect` is deliberately not exported; assertions live in the drivers.
 */
export const test = base.extend({
    // One world per test, shared by every page object in it, and cleaned up
    // when the test ends, so specs need no afterEach
    world: async ({ page }, use) => {
        const world = createWorld(page);
        await use(world);
        await world.cleanup();
    },

    recipesPage: async ({ world }, use) => {
        await use(createRecipesPage(world, world.drivers.recipesPage));
    },
});
