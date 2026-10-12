import { appUrl } from '../setup/config';

// Vuetify switches to its small layout below 960px wide (`smAndDown`), so a
// phone is well under that and a desktop well over
const sizes = {
    desktop: { width: 1280, height: 720 },
    phone: { width: 390, height: 844 },
};

/** Sizes the browser for `screen` (`desktop | phone`) and opens `path` in the app. */
export async function openOn(page, screen, path) {
    await page.setViewportSize(sizes[screen]);
    await page.goto(`${appUrl}${path}`);
}

/** The app's URL for `path`, for drivers to check where the browser is. */
export const urlOf = path => `${appUrl}${path}`;
