import { createDrivers } from './drivers/drivers';

/**
 * What a spec has named so far, plus the drivers for this test.
 *
 * Page and component objects are stateless; a name given in one is used in
 * another, so it lives here. Nothing is named yet, but the home is kept so
 * the first step that names something has one.
 *
 * One world per test, built over Playwright's `page`.
 */
export function createWorld(page) {
    return {
        /** So a page object can be handed the driver it drives. */
        drivers: createDrivers(page),

        /** Forgets every name. Nothing to tear down yet: the suite only reads. */
        async cleanup() {},
    };
}
