import { createAppBarDriver } from './app-bar-driver';
import { createDashboardPageDriver } from './dashboard-page-driver';
import { createRecipeDetailsPageDriver } from './recipe-details-page-driver';
import { createRecipeSearchDriver } from './recipe-search-driver';
import { createRecipesPageDriver } from './recipes-page-driver';

/** Builds each driver once per test, over Playwright's `page`. */
export function createDrivers(page) {
    return {
        appBar: createAppBarDriver(page),
        dashboardPage: createDashboardPageDriver(page),
        recipeDetailsPage: createRecipeDetailsPageDriver(page),
        recipesPage: createRecipesPageDriver(page),
        recipeSearch: createRecipeSearchDriver(page),
    };
}
