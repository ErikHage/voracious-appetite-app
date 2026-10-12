# Unit testing

Add a unit-test safety net before upgrading dependencies to clear `npm audit` vulnerabilities.

## 2026-10-11

**Goal:** the app had no tests. `npm audit` reported 21 vulnerabilities (16 high), mostly vite/rollup/postcss and other build tooling. The tests pin down current behavior so the dependency upgrades can be checked against them.

**Decisions**
- **Vitest + Vue Test Utils + jsdom.** Vitest reuses `vite.config.js` (the `@` alias, Vue plugin and Vuetify auto-import) through `mergeConfig` in `vitest.config.js`, so there's no separate build setup. Added `@pinia/testing` 0.1.x (the line for Pinia 2) for component tests, plus `@vitest/coverage-v8`.
- **Characterization tests.** The tests assert what the code does today, including the quirks below. They don't assert what it should do. Bug fixes are a separate change after the upgrade.
- **Layout:** specs live in `spec/unit/`, mirroring `src/` (e.g. `src/components/views/RecipesPage.vue` → `spec/unit/components/views/RecipesPage.spec.js`). Shared setup is in `spec/setup.js` (a `ResizeObserver` stub for Vuetify), and `spec/helpers/mount.js` has `mountWithPlugins`, which mounts with a fresh Vuetify instance.
- **Scripts:** named `test:unit` (+ `test:unit:watch`, `test:unit:coverage`) rather than `test`.
- Test env values (`VITE_*`) are fixed in `vitest.config.js`, so tests don't depend on `.env.*` files.

**How to run**
- `npm run test:unit`: runs once
- `npm run test:unit:watch`: watch mode
- `npm run test:unit:coverage`: writes a coverage report to `/coverage` (git-ignored)

**Status:** 15 spec files, 68 tests, all passing. Coverage is 100% for `src/api`, `src/store`, `src/router`, the views, and the utils. The remaining gaps are bootstrap code (`main.js`, `App.vue`, `src/plugins`). I broke `mapMeasurementKind` and the recipe filter on purpose and the tests failed, then reverted. `npm run build` still succeeds.

**Removed dead code.** A review for unused code found these, all from the initial commit (they look like leftovers from a shared app template). Removing them means fewer packages to patch during the security upgrade.
- Components: `DatePickerDialog`, `DatePickerDialogActivator`, `TextBoxDialog` (nothing imports them; their specs were removed too).
- Utils: `src/utils/display.js`, `src/utils/storage-utils.js` (and its spec), and the `applicationId` export in `src/utils/constants.js`.
- Packages: `dayjs`, `jwt-decode`, `roboto-fontface`. Roboto still loads from Google Fonts through `src/plugins/webfontloader.js`.
- Kept `VITE_APPLICATION_ID` in `.env.*` in case the deploy still sets it.

**Quirks the tests capture (not fixed)**
- `RecipesPage.filteredRecipes`: results aren't sorted by name while a filter is active, because the filter branch returns early.
- `Nutrition`: the prop default `() => {}` returns `undefined`, so mounting without a `nutrition` prop throws.
- `loadSelectedRecipe` failure shows "unable to load recipes" (plural).
- Leftover Vue CLI config: `babel.config.js` and `@babel/eslint-parser` in `eslintConfig`, which aren't installed. This matters for the eslint upgrade.

**Open notes**
- Installing the test tooling took `npm audit` from 21 to 24 findings. The new ones are dev-only: Vitest 3.2.7 (critical, via `tinypool` and `@vitest/mocker`). The fix is Vitest 5, which needs `vite@^6.4.0` (6.3.6 is installed). Upgrade `vitest` and `@vitest/coverage-v8` along with vite.
- npm blocked the install scripts for `esbuild` and `vue-demi`. Both work without them: vue-demi defaults to Vue 3.
