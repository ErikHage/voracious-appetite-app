# Recipe list navigation

Make it easy to get from a recipe back to the list, and keep the search while you do.

## 2026-10-11

**Goal:** the only way back from a recipe to the list was the app bar's "Recipes" button. Added a "Back to recipes" button to `RecipeDetailsPage`.

**Decisions**
- **`:to="{ name: 'recipes-list' }"`, not `$router.back()`.** It always lands on the list, even when the recipe was opened from a bookmark or after a refresh. The app bar links the same way. The search is saved separately (next entry), so going back doesn't lose it either way.
- **The button sits outside the `v-if="selectedRecipe"` block**, so it shows while the recipe is loading and after a failed load.

**Tests:** `spec/unit/components/views/RecipeDetailsPage.spec.js` now mounts with a memory router, like `AppBar.spec.js` does, instead of mocking `$route`. A `v-btn` with `:to` renders a `RouterLink`, which needs a real router. New tests check that the link points to `/recipes`, that it shows while loading, and that clicking it navigates to the list.

**How to run:** `npm run test:unit`

**Status:** 71 tests pass. `npm run lint` reports 6 errors, all from before this change, in `TimeAndYield.vue` (`yield` as a prop name), `Dashboard.vue` (single-word component name) and `measurements.js` (redundant `!!`).
