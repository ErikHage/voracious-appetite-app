# Security updates

Clear the `npm audit` vulnerabilities without changing app behavior.

## 2026-10-11

**Goal:** `npm audit` reported 21 vulnerabilities (16 high) on `master`. Installing the test tooling briefly raised that to 24 (2 critical, from Vitest 3). Now it reports 0. The unit tests in `docs/2026-10-11-unit-testing.md` were written first, as a safety net.

**What changed**
- `npm audit fix` covered the semver-compatible fixes: vite 6.3.6 → 6.4.4, axios 1.12 → 1.20, plus transitive packages (rollup, postcss, form-data, lodash, etc.).
- **Vue 3.5.14 → 3.5.43.** `npm audit fix` and `npm update` both left it alone, so I installed it explicitly (`^3.5.43`). This also fixes `@vue/server-renderer`.
- **Vitest 3 → 5** (and `@vitest/coverage-v8`). This fixes the critical `tinypool` and `@vitest/mocker` advisories. Vitest 5 needs vite ≥ 6.4.0. No test changes were needed.
- **eslint 7 → 10, eslint-plugin-vue 8 → 10.** This fixes the moderate `js-yaml`/`argparse`/`sprintf-js`/`postcss-selector-parser` chain. Lint config moved from `eslintConfig` in `package.json` to `eslint.config.mjs` (flat config), with the same rule sets (`eslint:recommended` + Vue `essential`). Added `@eslint/js` and `globals`. The `lint` script drops `--ext`, which flat config no longer supports.
- Removed `babel.config.js`, a Vue CLI leftover whose preset was never installed.
- Raised the minimum ranges for `axios` (`^1.20.0`) and `vite` (`^6.4.4`), so a regenerated lockfile can't fall back to vulnerable versions. The Dockerfile runs `npm install`, which honors the lockfile.

**Declined for now:** major upgrades that audit didn't require: vite 8, `@vitejs/plugin-vue` 6, vuetify 4, pinia 3/4, vue-router 5, `@mdi/font` 7 and jsdom 30. They're bigger migrations with no security benefit today.

**Verification:** `npm audit` reports 0 vulnerabilities. `npm run test:unit` passes (68 tests). `npm run build` succeeds. The dev server serves `/`, `/recipes` and `/recipes/:id`, and their modules transform without errors.

**Open: lint findings.** Lint had been failing on every file, because the `@babel/eslint-parser` it referenced was missing. It now runs and reports 6 errors in source code that existed before this change; the source was left alone:
- `vue/multi-word-component-names`: `Dashboard`, `Nutrition`.
- `vue/no-parsing-error`: `TimeAndYield.vue` uses `yield` as a prop name, which is reserved in strict-mode template parsing. It works at runtime.
- `no-extra-boolean-cast`: `!!mappedKind` in `src/utils/measurements.js`.
