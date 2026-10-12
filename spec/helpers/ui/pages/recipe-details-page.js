import { parseDslArgs } from '@feral-auth/ts-simple-dsl';

import { alias } from '../params';
import { createAppBar } from '../components/app-bar';
import { createIngredientsList } from '../components/ingredients-list';
import { createNutritionInfo } from '../components/nutrition-info';
import { createPreparationSteps } from '../components/preparation-steps';
import { createTimeAndYield } from '../components/time-and-yield';

/**
 * A recipe's own page, in words. There is no `open` for a real recipe: a
 * spec reaches one from the list with `recipesPage.openRecipe('recipe: ...')`,
 * since it knows a recipe only by the name it was listed under. Each card on
 * the page is a component, exposed as a property.
 */
export function createRecipeDetailsPage(world, driver) {
    const { drivers } = world;

    return {
        appBar: createAppBar(world, drivers.appBar),
        timeAndYield: createTimeAndYield(world, drivers.timeAndYield),
        nutrition: createNutritionInfo(world, drivers.nutritionInfo),
        ingredients: createIngredientsList(world, drivers.ingredientsList),
        steps: createPreparationSteps(world, drivers.preparationSteps),

        /** `recipe`: the page shows that recipe. */
        async checkShows(...args) {
            const params = parseDslArgs(args, { recipe: alias() });

            await driver.shows(world.recipeNamed(params.recipe));
        },

        /** Opens the page for a recipe id the service doesn't have. No parameters. */
        async openUnknownRecipe(...args) {
            parseDslArgs(args, {});

            await driver.openUnknownRecipe();
        },

        /** The page says the recipe wasn't found. No parameters. */
        async checkReportsRecipeNotFound(...args) {
            parseDslArgs(args, {});

            await driver.reportsRecipeNotFound();
        },

        /** Follows the "Back to recipes" link. No parameters. */
        async goBackToRecipes(...args) {
            parseDslArgs(args, {});

            await driver.goBackToRecipes();
        },

        /** Reloads the page in the browser. No parameters. */
        async reload(...args) {
            parseDslArgs(args, {});

            await driver.reload();
        },
    };
}
