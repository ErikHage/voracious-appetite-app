import { createTestingPinia } from '@pinia/testing';
import { flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { mountWithPlugins } from '../../../helpers/mount';
import RecipeDetailsPage from '@/components/views/RecipeDetailsPage.vue';
import { useCommonStore } from '@/store';

const recipe = {
    recipeId: '42',
    recipeName: 'Beef Stew',
    keywords: ['comfort', 'winter'],
    prep: { value: 20, kind: 'minutes' },
    cook: { value: 2, kind: 'hours' },
    yield: { value: 6, kind: 'servings' },
    nutrition: { calories: 450 },
    ingredients: [{ name: 'beef', quantity: { value: 2, kind: 'pounds' } }],
    steps: [{ text: 'Brown the beef.' }],
};

async function mountPage(selectedRecipe) {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/recipes', name: 'recipes-list', component: { render: () => null } },
            { path: '/recipes/:recipeId', name: 'recipe-details', component: { render: () => null } },
        ],
    });
    router.push('/recipes/42');
    await router.isReady();

    const pinia = createTestingPinia({ initialState: { common: { selectedRecipe } } });
    const wrapper = mountWithPlugins(RecipeDetailsPage, {
        global: { plugins: [pinia, router] },
    });
    return { wrapper, router, store: useCommonStore(pinia) };
}

describe('RecipeDetailsPage', () => {
    it('loads the recipe from the route id on mount', async () => {
        const { store } = await mountPage(null);

        expect(store.loadSelectedRecipe).toHaveBeenCalledWith('42');
    });

    it('shows a skeleton loader until the recipe is loaded', async () => {
        const { wrapper } = await mountPage(null);

        expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);
        expect(wrapper.find('h1').exists()).toBe(false);
    });

    it('shows the recipe name, keywords and sections once loaded', async () => {
        const { wrapper } = await mountPage(recipe);

        expect(wrapper.find('h1').text()).toBe('Beef Stew');
        expect(wrapper.find('h3').text()).toBe('comfort, winter');
        expect(wrapper.text()).toContain('Time and Yield');
        expect(wrapper.text()).toContain('Nutritional Information');
        expect(wrapper.text()).toContain('Ingredients');
        expect(wrapper.text()).toContain('Brown the beef.');
    });

    it.each([[[]], [undefined]])('omits the keywords heading when keywords are %s', async (keywords) => {
        const { wrapper } = await mountPage({ ...recipe, keywords });

        expect(wrapper.find('h3').exists()).toBe(false);
    });

    it('links back to the recipes list', async () => {
        const { wrapper } = await mountPage(recipe);

        const backLink = wrapper.find('#back-to-recipes');
        expect(backLink.text()).toBe('Back to recipes');
        expect(backLink.attributes('href')).toBe('/recipes');
    });

    it('shows the back link while the recipe is still loading', async () => {
        const { wrapper } = await mountPage(null);

        expect(wrapper.find('#back-to-recipes').exists()).toBe(true);
    });

    it('navigates to the recipes list when the back link is clicked', async () => {
        const { wrapper, router } = await mountPage(recipe);

        await wrapper.find('#back-to-recipes').trigger('click');
        await flushPromises();

        expect(router.currentRoute.value.name).toBe('recipes-list');
    });
});
