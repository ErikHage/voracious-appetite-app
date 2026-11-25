import { h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
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

// The app as main.js makes it: the feral themes, which FrAppShell switches between
async function mountApp(path = '/') {
    const router = linkRouter();
    await router.push(path);
    const vuetify = createVuetify(createFeralVuetifyOptions({ components, directives }));
    const wrapper = mount(App, { global: { plugins: [router, vuetify] }, attachTo: document.body });
    await flushPromises();
    return { wrapper, router };
}

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

    it("shows the route's page in the shell's main area", async () => {
        ({ wrapper } = await mountApp());

        expect(wrapper.find('.fr-app-shell main #stand-in-page').exists()).toBe(true);
    });
});
