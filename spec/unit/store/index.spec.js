import { createPinia, setActivePinia } from 'pinia';
import { useCommonStore } from '@/store';
import recipesApi from '@/api/recipes-api';

vi.mock('@/api/recipes-api', () => ({
    default: {
        getRecipes: vi.fn(),
        getRecipeById: vi.fn(),
    },
}));

describe('useCommonStore', () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useCommonStore();
        vi.useFakeTimers();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('starts idle with no recipes and no alert', () => {
        expect(store.$state).toEqual({
            status: 'idle',
            recipes: [],
            selectedRecipe: null,
            selectedRecipeError: null,
            alertVisible: false,
            alertType: 'success',
            alertMessage: null,
        });
    });

    describe('setAlertMessage', () => {
        it('shows the alert, then hides it after 3 seconds', () => {
            store.setAlertMessage(null, 'success', 'saved');

            expect(store.alertVisible).toBe(true);
            expect(store.alertType).toBe('success');
            expect(store.alertMessage).toBe('saved');

            vi.advanceTimersByTime(2999);
            expect(store.alertVisible).toBe(true);

            vi.advanceTimersByTime(1);
            expect(store.alertVisible).toBe(false);
        });

        it('logs the error when one is given', () => {
            const err = new Error('boom');

            store.setAlertMessage(err, 'error', 'failed');

            expect(console.error).toHaveBeenCalledWith(err);
        });
    });

    describe('loadRecipes', () => {
        it('is loading while the request is in flight', () => {
            recipesApi.getRecipes.mockReturnValue(new Promise(() => {}));

            store.loadRecipes();

            expect(store.status).toBe('loading');
        });

        it('stores the recipes and returns to idle', async () => {
            const recipes = [{ recipeId: '1', recipeName: 'Soup' }];
            recipesApi.getRecipes.mockResolvedValue(recipes);

            await store.loadRecipes();

            expect(store.recipes).toEqual(recipes);
            expect(store.status).toBe('idle');
        });

        it('shows an error alert and sets error status on failure', async () => {
            recipesApi.getRecipes.mockRejectedValue(new Error('boom'));

            await store.loadRecipes();

            expect(store.status).toBe('error');
            expect(store.recipes).toEqual([]);
            expect(store.alertVisible).toBe(true);
            expect(store.alertType).toBe('error');
            expect(store.alertMessage).toBe('unable to load recipes');
        });
    });

    describe('loadSelectedRecipe', () => {
        it('fetches the recipe by id, stores it and returns to idle', async () => {
            const recipe = { recipeId: '42', recipeName: 'Stew' };
            recipesApi.getRecipeById.mockResolvedValue(recipe);

            await store.loadSelectedRecipe('42');

            expect(recipesApi.getRecipeById).toHaveBeenCalledWith('42');
            expect(store.selectedRecipe).toEqual(recipe);
            expect(store.status).toBe('idle');
        });

        it('forgets the previous recipe while the next one loads', () => {
            store.selectedRecipe = { recipeId: '7', recipeName: 'Soup' };
            store.selectedRecipeError = 'failed';
            recipesApi.getRecipeById.mockReturnValue(new Promise(() => {}));

            store.loadSelectedRecipe('42');

            expect(store.selectedRecipe).toBeNull();
            expect(store.selectedRecipeError).toBeNull();
            expect(store.status).toBe('loading');
        });

        it('records a recipe the service does not have as not found', async () => {
            recipesApi.getRecipeById.mockRejectedValue(Object.assign(new Error('Not Found'), { status: 404 }));

            await store.loadSelectedRecipe('42');

            expect(store.status).toBe('error');
            expect(store.selectedRecipe).toBeNull();
            expect(store.selectedRecipeError).toBe('not-found');
        });

        it('records any other failure as failed, and logs it', async () => {
            const err = new Error('boom');
            recipesApi.getRecipeById.mockRejectedValue(err);

            await store.loadSelectedRecipe('42');

            expect(store.status).toBe('error');
            expect(store.selectedRecipeError).toBe('failed');
            expect(console.error).toHaveBeenCalledWith(err);
        });

        it('leaves the shared alert alone, since the page shows the failure itself', async () => {
            recipesApi.getRecipeById.mockRejectedValue(new Error('boom'));

            await store.loadSelectedRecipe('42');

            expect(store.alertVisible).toBe(false);
        });
    });
});
