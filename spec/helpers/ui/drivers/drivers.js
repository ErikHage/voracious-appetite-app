import { createAppBarDriver } from './app-bar-driver';
import { createDashboardPageDriver } from './dashboard-page-driver';
import { createIngredientsListDriver } from './ingredients-list-driver';
import { createNutritionInfoDriver } from './nutrition-info-driver';
import { createPreparationStepsDriver } from './preparation-steps-driver';
import { createRecipeDetailsPageDriver } from './recipe-details-page-driver';
import { createRecipeSearchDriver } from './recipe-search-driver';
import { createRecipesPageDriver } from './recipes-page-driver';
import { createTimeAndYieldDriver } from './time-and-yield-driver';

/** Builds each driver once per test, over Playwright's `page`. */
export function createDrivers(page) {
    return {
        appBar: createAppBarDriver(page),
        dashboardPage: createDashboardPageDriver(page),
        ingredientsList: createIngredientsListDriver(page),
        nutritionInfo: createNutritionInfoDriver(page),
        preparationSteps: createPreparationStepsDriver(page),
        recipeDetailsPage: createRecipeDetailsPageDriver(page),
        recipesPage: createRecipesPageDriver(page),
        recipeSearch: createRecipeSearchDriver(page),
        timeAndYield: createTimeAndYieldDriver(page),
    };
}
