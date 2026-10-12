import { appUrl, recipesServiceUrl } from './config';

/**
 * Preflight: probes the service and the app once, before any test runs, and
 * turns each way the suite can be misconfigured into a message naming the
 * fix, rather than a wall of identical timeouts.
 *
 * The suite never starts either one; ./start-voracious-appetite.sh does.
 */

const startHint = 'Start both with ./start-voracious-appetite.sh, '
    + 'or point UI_APP_URL / UI_RECIPES_SERVICE_URL at running ones.';

async function probe(url) {
    try {
        const response = await fetch(url);
        return { status: response.status, body: await response.text() };
    } catch (err) {
        return { error: err.cause?.code || err.message };
    }
}

export default async function globalSetup() {
    const recipesUrl = `${recipesServiceUrl}/recipes`;
    const service = await probe(recipesUrl);

    if (service.error || service.status !== 200) {
        throw new Error(`recipes-service is not answering at ${recipesUrl} `
            + `(${service.error || `status ${service.status}`}). ${startHint}`);
    }
    if (service.body.trim() === '[]') {
        throw new Error(`recipes-service at ${recipesUrl} has no recipes yet. `
            + 'It may still be loading them from GitHub; see .run/recipes-service.log.');
    }

    const app = await probe(appUrl);

    if (app.error || app.status !== 200) {
        throw new Error(`the app is not answering at ${appUrl} `
            + `(${app.error || `status ${app.status}`}). ${startHint}`);
    }
}
