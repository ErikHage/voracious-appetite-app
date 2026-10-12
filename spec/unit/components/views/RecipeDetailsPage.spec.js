import { createTestingPinia } from '@pinia/testing';
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

function mountPage(selectedRecipe) {
    const pinia = createTestingPinia({ initialState: { common: { selectedRecipe } } });
    const wrapper = mountWithPlugins(RecipeDetailsPage, {
        global: {
            plugins: [pinia],
            mocks: { $route: { params: { recipeId: '42' } } },
        },
    });
    return { wrapper, store: useCommonStore(pinia) };
}

describe('RecipeDetailsPage', () => {
    it('loads the recipe from the route id on mount', () => {
        const { store } = mountPage(null);

        expect(store.loadSelectedRecipe).toHaveBeenCalledWith('42');
    });

    it('shows a skeleton loader until the recipe is loaded', () => {
        const { wrapper } = mountPage(null);

        expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);
        expect(wrapper.find('h1').exists()).toBe(false);
    });

    it('shows the recipe name, keywords and sections once loaded', () => {
        const { wrapper } = mountPage(recipe);

        expect(wrapper.find('h1').text()).toBe('Beef Stew');
        expect(wrapper.find('h3').text()).toBe('comfort, winter');
        expect(wrapper.text()).toContain('Time and Yield');
        expect(wrapper.text()).toContain('Nutritional Information');
        expect(wrapper.text()).toContain('Ingredients');
        expect(wrapper.text()).toContain('Brown the beef.');
    });

    it.each([[[]], [undefined]])('omits the keywords heading when keywords are %s', (keywords) => {
        const { wrapper } = mountPage({ ...recipe, keywords });

        expect(wrapper.find('h3').exists()).toBe(false);
    });
});
