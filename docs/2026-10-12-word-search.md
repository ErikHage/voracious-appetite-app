# Word search

Make the recipe search find a recipe by its full name, and by its words in any order.

## 2026-10-12

**Bug:** searching for a recipe's full name (e.g. "Vanilla Cake") showed `Showing 0 of 142 recipes`. recipes-service builds each recipe's `filterMatchString` by joining its words with `.` (`vanilla.cake.glaze.dessert`), and `RecipesPage` looked for the whole search text as one substring, so any search with a space missed. The UI suite pinned this as known-wrong behaviour (see `docs/2026-10-12-ui-testing.md`). The unit tests missed it because their fixtures used spaces (`'Lentil Soup vegan'`), which the service never sends.

**Fix (in the app):** `filteredRecipes` splits the search into words and keeps a recipe when every word appears in its `filterMatchString`. Full names, words in any order ("cake vanilla") and a name word plus a keyword ("soup vegan") all match now.

**Declined: fixing it in recipes-service** by joining with spaces. That changes the API's output, so the service's acceptance and integration drivers (which re-state the format) would need updating and the service redeploying. Word order would still matter there.

**Side effect:** a search of only spaces now lists every recipe; before, it listed none. Filtered results are still not sorted by name; that quirk is unchanged and still pinned in the unit tests.

**Tests:**
- The unit-test fixtures in `spec/unit/components/views/RecipesPage.spec.js` now use the service's real format (`lentil.soup.vegan`).
- New tests cover a full name, any order, a name word plus a keyword, every word being required, and a search of only spaces.
- Four of the new tests failed before the fix. "Every word required" already held.
- After the fix, all 81 unit tests pass and lint is clean.
- The UI suite's pinned full-name test failed on the fix, as it should; it's unpinned in the next commit.

**How to check by hand:** `npm run dev`, then search "vanilla cake" and "cake vanilla". Both list Vanilla Cake and Vanilla Cake Glaze.

## 2026-10-12

- **Correction to the hand check above:** "vanilla cake" and "cake vanilla" list three recipes, not two. Quick Vanilla Buttercream Frosting matches too, because "cake" is one of its keywords (`quick.vanilla.buttercream.frosting.frosting.vanilla.cake`). That's intended: each word can match the name or a keyword. A multi-word keyword such as "ice cream" still matches, since both of its words appear.
- The UI suite now covers the fix: a full name, and the same name with its words reversed. With the old substring match put back, both tests failed. With the fix, 57 of 57 repeated runs passed (`--repeat-each=3`).
