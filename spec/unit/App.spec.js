import { h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createTestingPinia } from '@pinia/testing';
import { createFeralVuetifyOptions } from '@feral-auth/vue-components';
import App from '@/App.vue';

// Every path goes to the same stand-in page, so a spec can follow a link
// without loading the app's pages
const StandInPage = { render: () => h('div', { id: 'stand-in-page' }) };

function linkRouter() {
    return createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/:path(.*)*', component: StandInPage }],
    });
}

const recipes = [
    { recipeId: 'beef-stew', recipeName: 'Beef Stew', filterMatchString: 'beef.stew.winter' },
    { recipeId: 'lentil-soup', recipeName: 'Lentil Soup', filterMatchString: 'lentil.soup' },
];

// The app as main.js makes it: the feral themes, which FrAppShell switches
// between, and the store, holding `common`'s state
async function mountApp(path = '/', common = { recipes }) {
    const router = linkRouter();
    await router.push(path);
    const vuetify = createVuetify(createFeralVuetifyOptions({ components, directives }));
    const pinia = createTestingPinia({ initialState: { common } });
    const wrapper = mount(App, { global: { plugins: [router, vuetify, pinia] }, attachTo: document.body });
    await flushPromises();
    return { wrapper, router };
}

// The sources FrAppShell's command palette searches. The palette's own
// dialog needs a real browser; the UI suite drives it
const paletteSources = wrapper => wrapper.findComponent({ name: 'FrAppShell' }).props('searchSources');

describe('App', () => {
    let wrapper;

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('runs in FrAppShell, with Home and Recipes in its drawer', async () => {
        ({ wrapper } = await mountApp());
        const shell = wrapper.findComponent({ name: 'FrAppShell' });

        expect(shell.props()).toMatchObject({ title: 'Voracious Appetite', storagePrefix: 'voracious-appetite' });
        const links = wrapper.findAll('nav#app-nav .v-list-item').map(link => link.attributes('aria-label'));
        expect(links).toEqual(['Home', 'Recipes']);
    });

    it("marks the page's link, or the link it's under", async () => {
        let router;
        ({ wrapper, router } = await mountApp('/recipes/beef-stew'));

        expect(wrapper.find('#nav-recipes-list').attributes('aria-current')).toBe('page');
        expect(wrapper.find('#nav-dashboard').attributes('aria-current')).toBeUndefined();

        await router.push('/');
        await flushPromises();
        expect(wrapper.find('#nav-dashboard').attributes('aria-current')).toBe('page');
        expect(wrapper.find('#nav-recipes-list').attributes('aria-current')).toBeUndefined();
    });

    it('finds recipes in the command palette, and opens the one chosen', async () => {
        let router;
        ({ wrapper, router } = await mountApp());

        const [source] = paletteSources(wrapper);
        const found = await source.search('stew');
        source.select(found[0]);

        expect(source.section).toBe('RECIPES');
        expect(found.map(result => result.title)).toEqual(['Beef Stew']);
        // The navigation outlasts a flush of promises
        await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/recipes/beef-stew'));
    });

    it("titles the window after the recipe on a recipe's page", async () => {
        ({ wrapper } = await mountApp('/recipes/beef-stew', { recipes, selectedRecipe: { recipeId: 'beef-stew', recipeName: 'Beef Stew' } }));

        expect(document.title).toBe('Beef Stew - Voracious Appetite');
    });

    it("titles the window after Recipes while a recipe's page loads", async () => {
        ({ wrapper } = await mountApp('/recipes/beef-stew', { recipes, selectedRecipe: null }));

        expect(document.title).toBe('Recipes - Voracious Appetite');
    });

    it('titles the window after Recipes when the recipe could not be loaded', async () => {
        ({ wrapper } = await mountApp('/recipes/no-such', { recipes, selectedRecipe: null, selectedRecipeError: 'not-found' }));

        expect(document.title).toBe('Recipes - Voracious Appetite');
    });

    it('titles the window after the page, not the last recipe, once off its page', async () => {
        let router;
        ({ wrapper, router } = await mountApp('/recipes/beef-stew', { recipes, selectedRecipe: { recipeId: 'beef-stew', recipeName: 'Beef Stew' } }));

        await router.push('/recipes');
        await flushPromises();

        expect(document.title).toBe('Recipes - Voracious Appetite');
    });

    it("shows the route's page in the shell's main area", async () => {
        ({ wrapper } = await mountApp());

        expect(wrapper.find('.fr-app-shell main #stand-in-page').exists()).toBe(true);
    });
});
