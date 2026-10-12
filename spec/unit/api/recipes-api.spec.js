import axios, { AxiosError } from 'axios';
import recipesApi from '@/api/recipes-api';
import { ApiError } from '@/api/error-handler';

const baseUrl = 'https://api.test/recipes-service';

describe('recipes-api', () => {
    beforeEach(() => {
        vi.spyOn(axios, 'get');
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getRecipes', () => {
        it('fetches the recipe list and returns the response data', async () => {
            const recipes = [{ recipeId: '1', recipeName: 'Soup' }];
            axios.get.mockResolvedValue({ data: recipes });

            const result = await recipesApi.getRecipes();

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/recipes`);
            expect(result).toEqual(recipes);
        });

        it('throws an ApiError when the request fails', async () => {
            axios.get.mockRejectedValue(new AxiosError('Network Error', 'ERR_NETWORK'));

            await expect(recipesApi.getRecipes()).rejects.toBeInstanceOf(ApiError);
        });
    });

    describe('getRecipeById', () => {
        it('fetches one recipe by id and returns the response data', async () => {
            const recipe = { recipeId: '42', recipeName: 'Stew' };
            axios.get.mockResolvedValue({ data: recipe });

            const result = await recipesApi.getRecipeById('42');

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/recipes/42`);
            expect(result).toEqual(recipe);
        });

        it('throws an ApiError carrying the response status', async () => {
            axios.get.mockRejectedValue(
                new AxiosError('Not Found', 'ERR_BAD_REQUEST', {}, {}, { status: 404, data: null }));

            await expect(recipesApi.getRecipeById('missing')).rejects.toMatchObject({
                name: 'ApiError',
                status: 404,
            });
        });
    });
});
