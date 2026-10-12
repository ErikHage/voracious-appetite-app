/**
 * Where the suite finds the app and the service. The defaults match
 * ./start-voracious-appetite.sh; override either from the shell.
 */

const withTrailingSlash = url => (url.endsWith('/') ? url : `${url}/`);

// baseURL must end in a slash, or page.goto('recipes') drops the app's base path
export const appUrl = withTrailingSlash(
    process.env.UI_APP_URL || 'http://localhost:5175/apps/voracious-appetite/');

export const recipesServiceUrl = process.env.UI_RECIPES_SERVICE_URL
    || 'http://localhost:3000/api/recipes-service';
