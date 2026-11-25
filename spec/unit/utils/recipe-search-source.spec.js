import { recipeSearchSource } from '@/utils/recipe-search-source';

const summary = (recipeId, recipeName, keywords = '') => ({
    recipeId,
    recipeName,
    filterMatchString: [recipeName.toLowerCase().replaceAll(' ', '.'), keywords].filter(Boolean).join('.'),
});

const beefStew = summary('beef-stew', 'Beef Stew', 'winter');
const appleCake = summary('apple-cake', 'Apple Cake', 'winter');
const lentilSoup = summary('lentil-soup', 'Lentil Soup');

// The store as the source uses it: the recipe summaries, and the action that loads them
function fakeStore(recipes = [], loaded = recipes) {
    const store = {
        recipes,
        loadRecipes: vi.fn(async () => {
            store.recipes = loaded;
        }),
    };
    return store;
}

const fakeRouter = () => ({ push: vi.fn() });

describe('recipeSearchSource', () => {
    it('lists its results under Recipes', () => {
        expect(recipeSearchSource(fakeStore(), fakeRouter()).section).toBe('RECIPES');
    });

    it('finds recipes the way the recipe list does', async () => {
        const source = recipeSearchSource(fakeStore([beefStew, lentilSoup]), fakeRouter());

        expect(await source.search('stew beef')).toEqual([
            { value: 'beef-stew', title: 'Beef Stew', icon: 'mdi-silverware-fork-knife' },
        ]);
    });

    it('lists what it found by name', async () => {
        const source = recipeSearchSource(fakeStore([beefStew, lentilSoup, appleCake]), fakeRouter());

        const titles = (await source.search('winter')).map(result => result.title);

        expect(titles).toEqual(['Apple Cake', 'Beef Stew']);
    });

    it('lists no more than ten', async () => {
        const many = Array.from({ length: 12 }, (_, i) => summary(`soup-${i}`, `Soup ${String(i).padStart(2, '0')}`));
        const source = recipeSearchSource(fakeStore(many), fakeRouter());

        const titles = (await source.search('soup')).map(result => result.title);

        expect(titles).toEqual(many.slice(0, 10).map(recipe => recipe.recipeName));
    });

    it('suggests nothing before anything is typed', () => {
        expect(recipeSearchSource(fakeStore([beefStew]), fakeRouter()).suggest).toBeUndefined();
    });

    it('loads the recipes when none are loaded yet', async () => {
        const store = fakeStore([], [beefStew]);
        const source = recipeSearchSource(store, fakeRouter());

        const results = await source.search('stew');

        expect(store.loadRecipes).toHaveBeenCalledTimes(1);
        expect(results.map(result => result.value)).toEqual(['beef-stew']);
    });

    it('loads them once for searches typed while they load', async () => {
        const store = fakeStore([], [beefStew]);
        const source = recipeSearchSource(store, fakeRouter());

        const [first, second] = await Promise.all([source.search('s'), source.search('st')]);

        expect(store.loadRecipes).toHaveBeenCalledTimes(1);
        expect(first).toHaveLength(1);
        expect(second).toHaveLength(1);
    });

    it('does not load the recipes again once they are loaded', async () => {
        const store = fakeStore([beefStew]);
        const source = recipeSearchSource(store, fakeRouter());

        await source.search('stew');

        expect(store.loadRecipes).not.toHaveBeenCalled();
    });

    it('finds nothing, without failing, when the recipes cannot be loaded', async () => {
        const store = fakeStore();
        store.loadRecipes.mockRejectedValue(new Error('down'));
        const source = recipeSearchSource(store, fakeRouter());
        vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(await source.search('stew')).toEqual([]);
    });

    it("opens a chosen recipe's page", () => {
        const router = fakeRouter();
        const source = recipeSearchSource(fakeStore([beefStew]), router);

        source.select({ value: 'beef-stew', title: 'Beef Stew' });

        expect(router.push).toHaveBeenCalledWith('/recipes/beef-stew');
    });
});
