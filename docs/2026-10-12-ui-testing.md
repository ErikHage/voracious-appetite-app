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
