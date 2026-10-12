/**
 * A card on a recipe's page, found by its title. Cards have no role, so this
 * is CSS: the `.v-card` whose own title reads exactly `title`. The page's
 * outer card contains every other card, so matching on its text alone would
 * find two.
 */
export const cardTitled = (page, title) => page.getByRole('main')
    .locator(`.v-card:has(> .v-card-title:text-is("${title}"))`);

/** Each row of a card's table, as `[header or first cell, ...cells]` text, trimmed. */
export async function rowTexts(card) {
    return Promise.all((await card.getByRole('row').all()).map(async row => (
        await row.locator('th, td').allTextContents()).map(text => text.trim())));
}
