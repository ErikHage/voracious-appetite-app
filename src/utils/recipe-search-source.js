import { matchesRecipeSearch } from '@/utils/recipe-search';

const maxResults = 10;

/**
 * The command palette's recipes, as one of FrAppShell's `search-sources`:
 * the recipes the recipe list would show for what's typed, by name, ten at
 * most. Nothing is suggested before anything is typed. The palette can open
 * before the recipe list has ever loaded, so a search loads the recipes into
 * the store when there are none, once however many searches wait on it. A
 * load that fails finds nothing; the recipe list reports it when it's shown.
 * Choosing a recipe opens its page
 */
export function recipeSearchSource(store, router) {
    let loading = null;

    async function loadedRecipes() {
        if (store.recipes.length === 0) {
            loading ??= store.loadRecipes().finally(() => {
                loading = null;
            });
            await loading;
        }
        return store.recipes;
    }

    return {
        section: 'RECIPES',

        async search(query) {
            let recipes;
            try {
                recipes = await loadedRecipes();
            } catch (err) {
                // The palette fails a whole search when any source throws
                console.error(err);
                return [];
            }
            return recipes
                .filter(recipe => matchesRecipeSearch(recipe, query))
                .sort((a, b) => a.recipeName.localeCompare(b.recipeName))
                .slice(0, maxResults)
                .map(recipe => ({
                    value: recipe.recipeId,
                    title: recipe.recipeName,
                    icon: 'mdi-silverware-fork-knife',
                }));
        },

        select(result) {
            router.push(`/recipes/${result.value}`);
        },
    };
}
