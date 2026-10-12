# Recipe not found

Make a recipe's page say when the recipe can't be loaded, instead of showing "Loading..." forever.

## 2026-10-12

**Bug:** opening a recipe the service doesn't have (e.g. an old bookmark) left the page on its loading skeleton for good. The store did set an error alert, but `RecipeDetailsPage` only rendered that alert inside the `v-if="selectedRecipe"` block, and with no recipe that block never shows. The alert also faded after 3 seconds. The UI suite pinned this as known-wrong behaviour (see `docs/2026-10-12-ui-testing.md`).

**Fix:**
- **The store records why a load failed.** A new `selectedRecipeError` holds `'not-found'` for a 404 (`ApiError.status`) and `'failed'` for anything else. `loadSelectedRecipe` still logs the error with `console.error`.
- **The page shows a lasting error in place of the skeleton:** "Recipe not found" or "Unable to load this recipe". The "Back to recipes" link stays above it.
- **The previous recipe is cleared when a load starts.** Before, opening a second recipe showed the first one until the second arrived, and a failed load kept showing it. Now the page shows the skeleton.
- **The shared alert is no longer used for a failed recipe load.** It's shared with the recipe list, so the list could show "unable to load recipes" if you went back within 3 seconds. That removes the pinned "recipes" (plural) quirk noted in `docs/2026-10-11-unit-testing.md`. `RecipeDetailsPage` no longer uses `FadeOutAlert`; the recipe list still does.

**Tests:**
- **Store:** clears the previous recipe while loading; a 404 is recorded as `not-found`; anything else is `failed` and logged; the shared alert stays hidden.
- **Page:** shows each message in place of the skeleton, and keeps the back link.
- Seven of the new tests failed before the fix; the back-link test already passed. After it, all 87 unit tests pass, and lint and the build are clean.
- The UI suite's pinned test failed on the fix, as it should; it's unpinned in the next commit.

**How to check by hand:** `npm run dev`, then open `/apps/voracious-appetite/recipes/no-such-recipe`. The page says "Recipe not found" under the back link.

## 2026-10-12

- The UI suite now checks the fix: an unknown id shows "Recipe not found", with no skeleton or recipe heading, and the back link still works. With the fix reverted, that test failed. With it, 57 of 57 repeated runs passed.
