import { createRecipesPageDriver } from './recipes-page-driver';

/** Builds each driver once per test, over Playwright's `page`. */
export function createDrivers(page) {
    return {
        recipesPage: createRecipesPageDriver(page),
    };
}
