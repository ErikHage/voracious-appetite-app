# UI tests

Playwright tests that drive the app in a real browser against a running app and recipes-service. Specs read as prose: they call page objects with `"name: value"` strings, and drivers underneath own every locator and assertion.

## Run

```bash
./start-voracious-appetite.sh   # the suite never starts anything itself
npm run test:ui
./stop-voracious-appetite.sh
```

To use a different app or service, set `UI_APP_URL` (default `http://localhost:5175/apps/voracious-appetite/`) or `UI_RECIPES_SERVICE_URL` (default `http://localhost:3000/api/recipes-service`). A preflight probes both before any test runs. If either is down, it fails with a message naming the fix.

Failures save a screenshot and a trace under `test-results/`. Open a trace with `npx playwright show-trace <path>/trace.zip`, or open the HTML report with `npx playwright show-report`.

## Layers

```
spec/ui/**/*.spec.js           what the app should do, in "name: value" strings
   |
helpers/ui/ui-test.js          the one import: Playwright's test, with a fixture per page object
   |
helpers/ui/pages/*-page.js     a page and the actions on it; parses the strings and delegates
helpers/ui/components/*.js     reusable parts of a page (search box, app bar), exposed as page properties
   |
helpers/ui/drivers/*-driver.js locators and every assertion, as typed methods
   |
helpers/ui/drivers/assertions.js  the only importer of expect
```

`helpers/ui/world.js` holds what a spec has named (shared by every page object in a test) and the drivers. `helpers/ui/params.js` holds shared parameter declarations. Steps are parsed with [`@feral-auth/ts-simple-dsl`](https://github.com/ErikHage/ts-simple-dsl).

**Names, not data.** The data is live, so a spec can't name a real recipe. Instead it chooses one from the list and gives it an alias: `recipesPage.chooseRecipe('recipe: chosen')`. Later steps refer to `recipe: chosen`, and the world resolves the alias to what the driver found.

**Navigation is checked at the destination.** A step that clicks (`appBar.goToRecipes()`) asserts nothing; the next step checks where it led (`recipesPage.checkIsShown()`), by URL and heading. A page's `open` takes an optional `screen: desktop | phone`. A page with no URL a spec could know, like a recipe's page, has no `open`; it's reached from another page (`recipesPage.openRecipe('recipe: chosen')`).

**Known-wrong behaviour is pinned, not skipped.** A `// DocumentsCurrentBehavior:` comment above the test says what happens today and what should happen. The test title and the step name the intent (e.g. `checkReportsRecipeNotFound`). The driver method names today's behaviour (it was `keepsShowingLoading`), so it's the one thing a fix renames. Both bugs pinned so far have since been fixed, so no test is pinned at the moment.

## Rules

1. **Specs are prose.** A spec's only import is `ui-test`. Its steps take `"name: value"` strings and nothing else.
2. **Assertions and locators live in the drivers.** Page and component objects have neither.
3. **Only `drivers/assertions.js` imports `expect`.** Only the preflight calls `fetch`. The browser makes the app's own calls.
4. **Nothing imports from `src/`.** A driver re-states any rule it checks, such as the sort order. That way a change in the app breaks a test instead of silently agreeing with it.
5. **The data is live.** Drivers assert shape and invariants, never a particular recipe.

## Adding a test

1. Write the spec first, in the steps you wish existed: `await recipesPage.search.searchFor('text: soup')`.
2. Add the step to the page or component object. Declare its parameters with `parseDslArgs` (use `parseDslArgs(args, {})` for none), then delegate to the driver.
3. Add the driver method, with its locators and assertions. A new kind of check becomes a primitive in `assertions.js`.
4. For a new page, add a driver in `drivers/drivers.js` and a fixture in `ui-test.js`. For a new component, add a driver too, and expose the component as a property of each page that contains it.
5. Run it. A misspelled parameter fails only at runtime.
6. Check the layering:
   ```bash
   grep -rnE "\bexpect\(|import \{[^}]*\bexpect\b" spec/ui spec/helpers/ui   # assertions.js only
   grep -rn "getBy\|locator(" spec/ui/*/ spec/helpers/ui/pages spec/helpers/ui/components  # nothing
   grep -rn "^import" spec/ui                                                 # ui-test only
   ```
