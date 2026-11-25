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

    it('starts idle with no recipes and no load errors', () => {
        expect(store.$state).toEqual({
            status: 'idle',
            recipes: [],
            selectedRecipe: null,
            selectedRecipeError: null,
            recipesLoadError: null,
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

        it('records a load error, logs it and sets error status on failure', async () => {
            const err = new Error('boom');
            recipesApi.getRecipes.mockRejectedValue(err);

            await store.loadRecipes();

            expect(store.status).toBe('error');
            expect(store.recipes).toEqual([]);
            expect(store.recipesLoadError).toBe('Unable to load recipes');
            expect(console.error).toHaveBeenCalledWith(err);
        });

        it('keeps the load error until a later load succeeds', async () => {
            recipesApi.getRecipes.mockRejectedValue(new Error('boom'));
            await store.loadRecipes();
            vi.advanceTimersByTime(10_000);
            expect(store.recipesLoadError).toBe('Unable to load recipes');

            recipesApi.getRecipes.mockResolvedValue([]);
            await store.loadRecipes();

            expect(store.recipesLoadError).toBeNull();
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

        it("leaves the recipe list's load error alone", async () => {
            recipesApi.getRecipeById.mockRejectedValue(new Error('boom'));

            await store.loadSelectedRecipe('42');

            expect(store.recipesLoadError).toBeNull();
        });
    });
});
