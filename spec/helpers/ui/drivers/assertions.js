import { expect } from '@playwright/test';

/**
 * Low-level expectations shared by the drivers.
 *
 * This is the only file in the suite that imports `expect`. Specs and page
 * objects contain no assertions and no locators; the drivers express theirs
 * through these primitives.
 *
 * Every message says what was being done and what was expected, so a failing
 * run explains itself. Locator assertions retry until Playwright's timeout.
 */

const failureMessage = (what, expectation) => `${what}\n  expected: ${expectation}`;

export async function expectVisible(locator, what) {
    await expect(locator, failureMessage(what, `${locator} to be visible`)).toBeVisible();
}

/** Waits until the locator matches at least one visible element. */
export async function expectNotEmpty(locator, what) {
    await expect(locator.first(), failureMessage(what, `at least one ${locator}`)).toBeVisible();
}

export async function expectText(locator, text, what) {
    await expect(locator, failureMessage(what, `${locator} to read "${text}"`)).toHaveText(text);
}

/** Reports the first pair out of order rather than diffing the whole list. */
export function expectSorted(values, compare, what) {
    const index = values.findIndex((value, i) => i > 0 && compare(values[i - 1], value) > 0);

    expectThat(
        index === -1,
        `${values.length} values in sorted order`,
        `"${values[index - 1]}" comes before "${values[index]}" (positions ${index - 1} and ${index})`,
        what,
    );
}

/**
 * For conditions a driver has already worked out. `expectation` says, in
 * words, what should have been true, and `actual` what was found instead.
 */
export function expectThat(condition, expectation, actual, what) {
    expect(condition, `${failureMessage(what, expectation)}\n  actual:   ${actual}`).toBe(true);
}
