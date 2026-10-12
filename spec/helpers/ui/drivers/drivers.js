import { createRecipeSearchDriver } from './recipe-search-driver';
import { createRecipesPageDriver } from './recipes-page-driver';

/** Builds each driver once per test, over Playwright's `page`. */
export function createDrivers(page) {
    return {
        recipesPage: createRecipesPageDriver(page),
        recipeSearch: createRecipeSearchDriver(page),
    };
}
