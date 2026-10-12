import { h } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { VLayout } from 'vuetify/components';
import { mountWithPlugins } from '../../../helpers/mount';
import AppBar from '@/components/layout/AppBar.vue';

// v-app-bar must live inside a layout
const LayoutWithAppBar = {
    render: () => h(VLayout, () => h(AppBar)),
};

function mountAppBar() {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/', component: { render: () => null } },
            { path: '/recipes', component: { render: () => null } },
        ],
    });
    return mountWithPlugins(LayoutWithAppBar, { global: { plugins: [router] } });
}

describe('AppBar', () => {
    it('links to the recipes list', () => {
        const wrapper = mountAppBar();

        const recipesLink = wrapper.findAll('a').find(link => link.text() === 'Recipes');
        expect(recipesLink.attributes('href')).toBe('/recipes');
    });

    it('shows either the title or a home button depending on screen size', () => {
        const wrapper = mountAppBar();

        const hasTitle = wrapper.text().includes('Voracious Appetite');
        const hasHomeButton = wrapper.find('.mdi-home').exists();
        expect(hasTitle !== hasHomeButton).toBe(true);
    });
});
