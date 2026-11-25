/**
 * Whether a recipe summary matches a search: every word typed must appear
 * somewhere in the recipe's match string, ignoring case, in any order.
 * recipes-service joins a recipe's words with '.', so the search as typed
 * (with its spaces) never appears whole. A search of no words matches every
 * recipe. The recipe list and the command palette both search this way
 */
export function matchesRecipeSearch(recipe, search) {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    const matchString = recipe.filterMatchString.toLowerCase();
    return words.every(word => matchString.includes(word));
}
