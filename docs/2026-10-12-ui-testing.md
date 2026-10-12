# UI testing

Drive the app in a real browser with Playwright, in the same layered prose style as the other projects' acceptance suites.

## 2026-10-12

**Goal:** start a UI test suite with a single test, to review before it grows. This is the first UI suite in any of the projects, so the layers below the spec were designed here.

**Decisions**
- **Layered like the `dsl-tests` suites.** Specs pass only `"name: value"` strings, parsed with `@feral-auth/ts-simple-dsl` (pinned at `0.0.1`).
- **The top layer is Page/Component objects, not "DSL".** A page object (`recipesPage`) represents a page and its actions. Smaller component objects (search box, app bar) can be built for reuse and exposed as page properties. None exist yet.
- **Drivers keep their usual role:** they hold the Playwright locators and own every assertion, through `drivers/assertions.js` (the only importer of `expect`).
- **Runner: `@playwright/test`**, as a separate `test:ui` script alongside Vitest. The entry `spec/helpers/ui/ui-test.js` extends Playwright's `test` with a fixture per page object, plus a shared `world` fixture that cleans up after each test. Specs therefore import only `test` and need no `afterEach`.
- **Backend: the real local recipes-service** (black-box). The suite never starts anything; `./start-voracious-appetite.sh` does, and Playwright has no `webServer`. The data is live from GitHub, so drivers assert invariants, never particular recipes.
- **Preflight** (`setup/global-setup.js`) probes the service's `/recipes` and the app URL. On failure it names the fix instead of letting the tests time out. It is the only `fetch` caller; there's no http-client layer, because the browser makes the app's calls.
- **Layout:** specs in `spec/ui/`, layers in `spec/helpers/ui/` (`pages/`, `components/`, `drivers/`, `setup/`, `world.js`, `params.js`). Files are ESM, like `spec/unit`.

**Declined**
- Mocking the API in the browser (`page.route`) with declared fixtures: deterministic, but you wanted the real service.
- Vitest plus the playwright library: one runner, but no built-in server handling, traces or retrying assertions.
- Plain Playwright tests: don't match the other suites.
- A `.env.ui` file: there are no secrets, so defaults plus shell overrides (`UI_APP_URL`, `UI_RECIPES_SERVICE_URL`) are enough.

**The first test:** `spec/ui/recipes/recipes-page.spec.js`, "lists every recipe the service has, sorted by name". The driver checks three things:
- the list is non-empty;
- the names are in `localeCompare` order (the rule is re-stated, not imported);
- the counter reads `Showing N of N recipes`, with N equal to the row count.

**How to run:** `./start-voracious-appetite.sh`, then `npm run test:ui`. One-time setup: `npx playwright install chromium`. Failures keep a screenshot and a trace in `test-results/`. Both `test-results/` and `playwright-report/` are git-ignored. `spec/ui/README.md` has the rules and how to add a test.

**Status:** 1 test, passing in about 1s. I broke the sort in `RecipesPage.filteredRecipes` on purpose: the test failed with `"Vanilla Cake Glaze" comes before "Vanilla Cake" (positions 135 and 136)`, then I reverted. With the servers stopped, the preflight reports `ECONNREFUSED` and names the start script. The layering greps are clean, and the 76 unit tests still pass (Vitest only includes `spec/unit/**`).

**Open notes**
- recipes-service answers `/recipes` while it is still loading from GitHub: one probe saw 91 recipes, a later one 142. The start script and the preflight wait only for a non-empty list. The current test is unaffected, because the rows and the counter come from the same load, but a test that compares against the service's full count would need to wait for loading to finish.
- Deferred until after review: a `dsl-misuse` spec, more tests and the first component objects, and recording these decisions in the "UI" section of the `dsl-tests` skill.

## 2026-10-12

**Plan for the remaining tests**, in four batches, with one commit and a review after each:
1. **Search:** the first component (`recipesPage.search`), and names in the world (`chooseRecipe('recipe: chosen')`).
2. **Navigation:** dashboard and recipe-details page objects, and an `appBar` component on every page.
3. **Recipe details sections:** a component and driver per card (time and yield, nutrition, ingredients, steps).
4. **Errors:** an unknown recipe id.

The `dsl-tests` skill's UI section gets updated after batch 1, once components and names have been tried.

**Decisions**
- **Error paths use the real service only.** The suite covers what the live service produces itself (an unknown recipe id). A failed list load is left to the unit tests. Declined: fault injection through `page.route`.
- **Search pins a found bug.** recipes-service builds `filterMatchString` by joining a recipe's words with `.`, so a search containing a space (e.g. a full multi-word name) finds nothing. A `DocumentsCurrentBehavior` test asserts what happens today; it isn't skipped.
- **Unknown recipe pins a found bug.** The details page keeps showing its loading skeleton: the error alert sits inside the `v-if="selectedRecipe"` block, so it never shows. This gets a `DocumentsCurrentBehavior` test too.

**Batch 1 (search), done**
- `components/recipe-search.js` is the first component object, exposed as `recipesPage.search`, with its own driver. Locators and assertions about the list stay with the recipes page driver; the search driver only types and clears.
- Names in the world: `recipesPage.chooseRecipe('recipe: chosen', 'words: any | several')` gives the first listed recipe that fits an alias. Search steps resolve it, e.g. `searchForWordOf` uses the longest word of the name, which is the least likely to match every recipe.
- "Found" means more than "the recipe is listed": the search must also narrow the list (M < N in `Showing M of N`). Otherwise a search that ignores its text would still pass. The driver retries until the counter stops reading `N of N`, then checks that the rows match it. This proves the list narrowed, and it never counts rows before the filtered list has rendered. (The first version counted once, which could fail falsely if the count ran before Vue re-rendered.)
- **No misuse spec.** The skill calls for one, but it tests the test layer rather than the app, and we don't test the test layer. Most of what it checked is `@feral-auth/ts-simple-dsl`'s own behaviour, which has its own tests. A real spec that misuses a step still fails at runtime with the library's `DslParamsError` message. I wrote one, and it was dropped in review. Also declined: moving it to a Vitest unit test, since it never used the browser.
- **Status:** 6 UI tests pass (9 while the misuse spec existed), the 76 unit tests pass, and the layering greps are clean. Two temporary changes to the app confirmed the tests can fail. Making the search ignore its text failed the 4 tests that depend on filtering, e.g. `expected: … to stop reading "Showing 142 of 142 recipes"`; the clear test still passed, as expected. Fixing the full-name bug in the app failed only the pinned test.
- **One worker.** Repeated runs (`--repeat-each`) timed out on `page.goto` with 3 or more workers: the Vite dev server serves each page as hundreds of unbundled modules, and this machine is old. Over 18 runs, 1 worker and 2 workers both passed every time, in 22s and 28s, while 3 workers failed 6 and 4 workers failed 11. `playwright.config.js` sets `workers: 1`; override it with `--workers` on a faster machine. After the change, 30 runs (`--repeat-each=5`) all passed.
- **Vite ignores Playwright's output.** `vite.config.js` now has `server.watch.ignored` for `test-results/` and `playwright-report/`. While investigating, I saw Vite send `page reload` to connected browsers when Playwright wrote its report HTML. It wasn't the cause of the timeouts (they continued without it), but it can reload a page under test.
- Searching uppercase depends on the app lowercasing input. Searching the word as it's listed (capitalized) depends on that too, so a case bug would fail both search tests, not just "ignores case".

## 2026-10-12

**Batch 2 (navigation), done.** 13 UI tests in all.
- **New page objects:** `dashboardPage` and `recipeDetailsPage`. The details page has no `open`: a spec knows a recipe only by its listed name, so it gets there with `recipesPage.openRecipe('recipe: chosen')`.
- **`appBar` component:** a property of every page object. All of them share one driver per test. Its steps only click; the destination page's `checkIsShown`/`checkShows` checks where the click led, by URL and heading.
- **Screen size:** `open` takes an optional `screen: desktop | phone` (a shared declaration in `params.js`). `drivers/screens.js` holds the viewport sizes either side of Vuetify's 960px `smAndDown` breakpoint, and builds app URLs from the config.
- **Tests added:**
  - the dashboard's Recipes button;
  - the app bar's Recipes link from a recipe page;
  - the phone home icon;
  - a recipe opened from the list;
  - the back link;
  - a reload of a recipe page;
  - the search kept after going to a recipe and back.
- **`actionTimeout: 10_000`** in the config. Without it, a click on a missing element waited out the 30s test timeout and said only that. Now it fails in 10s and names the locator.
- **The home icon now has `aria-label="Home"`** (in `AppBar.vue`, committed separately as an accessibility fix). Before, it had no accessible name, so the driver had to find it by its `href`. That caused two problems while breaking the app. A wrong target made the driver unable to find the icon at all, so the test failed on the locator, not on where the icon led. And with the Recipes link also pointed home, the locator matched two links. Now the driver finds it by role and name. After the change, the same two breaks each fail only their own test, with `expected: the browser to be at …`.
- **Status:** 13 UI tests and 76 unit tests pass, and the layering greps are clean. Five temporary breaks to the app each failed the expected tests, and I reverted each one:
  - search not restored from `sessionStorage`: the kept-search test;
  - back link to the dashboard: the back-link test and the kept-search test, which also uses the back link;
  - app bar Recipes link to the dashboard: its test, plus the phone test, because of the locator ambiguity above (only its own test after the label);
  - home icon to the list: the phone test;
  - dashboard button to the dashboard: its test.
