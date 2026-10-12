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

/** `text` is a string to match exactly, or a RegExp. */
export async function expectText(locator, text, what) {
    await expect(locator, failureMessage(what, `${locator} to read ${text instanceof RegExp ? text : `"${text}"`}`))
        .toHaveText(text);
}

/** Retries until the locator reads anything but `text`. */
export async function expectNotText(locator, text, what) {
    await expect(locator, failureMessage(what, `${locator} to stop reading "${text}"`)).not.toHaveText(text);
}

/** `url` is a string to match exactly, or a RegExp. */
export async function expectUrl(page, url, what) {
    await expect(page, failureMessage(what, `the browser to be at ${url}`)).toHaveURL(url);
}

/** For form fields: what has been typed into one. */
export async function expectValue(locator, value, what) {
    await expect(locator, failureMessage(what, `${locator} to hold "${value}"`)).toHaveValue(value);
}

export async function expectCount(locator, count, what) {
    await expect(locator, failureMessage(what, `${locator} to match ${count} element(s)`)).toHaveCount(count);
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