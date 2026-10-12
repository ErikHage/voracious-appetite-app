/**
 * The app bar at the top of every page, as Playwright sees it. It only
 * clicks; where that leads is the destination page driver's to check.
 */
export function createAppBarDriver(page) {
    const appBar = page.getByRole('banner');
    const recipesLink = appBar.getByRole('link', { name: 'Recipes' });
    // Shown only on small screens
    const homeLink = appBar.getByRole('link', { name: 'Home' });

    return {
        async goToRecipes() {
            await recipesLink.click();
        },

        async goHome() {
            await homeLink.click();
        },
    };
}
