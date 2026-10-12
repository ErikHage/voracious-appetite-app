import { createTestingPinia } from '@pinia/testing';
import { mountWithPlugins } from '../../../helpers/mount';
import RecipesPage from '@/components/views/RecipesPage.vue';
import { useCommonStore } from '@/store';
import { recipeFilterStorageKey } from '@/utils/constants';

const recipes = [
    { recipeId: '2', recipeName: 'Lentil Soup', filterMatchString: 'Lentil Soup vegan' },
    { recipeId: '1', recipeName: 'Beef Stew', filterMatchString: 'Beef Stew comfort' },
    { recipeId: '3', recipeName: 'Apple Pie', filterMatchString: 'Apple Pie dessert vegan' },
];

function mountPage(state = {}) {
    const router = { push: vi.fn() };
    const pinia = createTestingPinia({ initialState: { common: { recipes, ...state } } });
    const wrapper = mountWithPlugins(RecipesPage, {
        global: {
            plugins: [pinia],
            mocks: { $router: router },
        },
    });
    return { wrapper, router, store: useCommonStore(pinia) };
}

function recipeNames(wrapper) {
    return wrapper.findAll('tbody tr').map(row => row.text());
}

describe('RecipesPage', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('loads recipes on mount', () => {
        const { store } = mountPage();

        expect(store.loadRecipes).toHaveBeenCalledTimes(1);
    });

    it('lists all recipes sorted by name when there is no filter', () => {
        const { wrapper } = mountPage();

        expect(recipeNames(wrapper)).toEqual(['Apple Pie', 'Beef Stew', 'Lentil Soup']);
        expect(wrapper.text()).toContain('Showing 3 of 3 recipes');
    });

    it('filters on filterMatchString, ignoring case', async () => {
        const { wrapper } = mountPage();

        await wrapper.find('#filter-recipes').setValue('sOUP');

        expect(recipeNames(wrapper)).toEqual(['Lentil Soup']);
        expect(wrapper.text()).toContain('Showing 1 of 3 recipes');
    });

    it('matches on words beyond the recipe name', async () => {
        const { wrapper } = mountPage();

        await wrapper.find('#filter-recipes').setValue('vegan');

        expect(recipeNames(wrapper)).toEqual(expect.arrayContaining(['Lentil Soup', 'Apple Pie']));
        expect(wrapper.text()).toContain('Showing 2 of 3 recipes');
    });

    it('keeps the store order when a filter is active', async () => {
        // current behavior: the filtered branch returns early and skips the name sort
        const { wrapper } = mountPage();

        await wrapper.find('#filter-recipes').setValue('e');

        expect(recipeNames(wrapper)).toEqual(['Lentil Soup', 'Beef Stew', 'Apple Pie']);
    });

    it('shows nothing when no recipe matches', async () => {
        const { wrapper } = mountPage();

        await wrapper.find('#filter-recipes').setValue('pizza');

        expect(recipeNames(wrapper)).toEqual([]);
        expect(wrapper.text()).toContain('Showing 0 of 3 recipes');
    });

    it('navigates to the recipe details when a recipe is clicked', async () => {
        const { wrapper, router } = mountPage();

        await wrapper.findAll('tbody tr button')[1].trigger('click');

        expect(router.push).toHaveBeenCalledWith('/recipes/1');
    });

    describe('saved search', () => {
        it('starts with an empty search when nothing is saved', () => {
            const { wrapper } = mountPage();

            expect(wrapper.find('#filter-recipes').element.value).toBe('');
            expect(wrapper.text()).toContain('Showing 3 of 3 recipes');
        });

        it('restores the search saved earlier in the session', () => {
            sessionStorage.setItem(recipeFilterStorageKey, 'vegan');

            const { wrapper } = mountPage();

            expect(wrapper.find('#filter-recipes').element.value).toBe('vegan');
            expect(wrapper.text()).toContain('Showing 2 of 3 recipes');
        });

        it('saves the search as the user types', async () => {
            const { wrapper } = mountPage();

            await wrapper.find('#filter-recipes').setValue('soup');

            expect(sessionStorage.getItem(recipeFilterStorageKey)).toBe('soup');
        });

        it('forgets the search when the field is emptied', async () => {
            const { wrapper } = mountPage();

            await wrapper.find('#filter-recipes').setValue('soup');
            await wrapper.find('#filter-recipes').setValue('');

            expect(sessionStorage.getItem(recipeFilterStorageKey)).toBeNull();
        });

        it('forgets the search when the field is cleared', async () => {
            sessionStorage.setItem(recipeFilterStorageKey, 'soup');
            const { wrapper } = mountPage();

            await wrapper.find('.v-field__clearable .v-icon').trigger('click');

            expect(sessionStorage.getItem(recipeFilterStorageKey)).toBeNull();
            expect(wrapper.text()).toContain('Showing 3 of 3 recipes');
        });
    });

    it('shows the store alert', () => {
        const { wrapper } = mountPage({
            alertVisible: true,
            alertType: 'error',
            alertMessage: 'unable to load recipes',
        });

        expect(wrapper.find('.v-alert').text()).toContain('unable to load recipes');
    });
});
