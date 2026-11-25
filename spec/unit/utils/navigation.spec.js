import { activeViewFor, crumbsFor, sections } from '@/utils/navigation';

describe('navigation', () => {
    it('links Home and Recipes, in one section with no heading, each named by its route', () => {
        expect(sections).toHaveLength(1);
        expect(sections[0].label).toBeUndefined();
        expect(sections[0].items.map(item => [item.title, item.to, item.value])).toEqual([
            ['Home', '/', 'dashboard'],
            ['Recipes', '/recipes', 'recipes-list'],
        ]);
    });

    it.each([
        ['/', 'dashboard'],
        ['/recipes', 'recipes-list'],
        ['/recipes/beef-stew', 'recipes-list'],
        ['/recipesx', ''],
        ['/unknown', ''],
    ])('marks %s as the link %j', (path, value) => {
        expect(activeViewFor(path)).toBe(value);
    });

    describe('crumbsFor', () => {
        const stew = { recipeId: 'beef-stew', recipeName: 'Beef Stew' };
        const recipes = { title: 'Recipes', to: '/recipes' };

        it.each([
            ['/', [{ title: 'Home' }]],
            ['/recipes', [{ title: 'Recipes' }]],
        ])("names %s's page alone, not as a link", (path, crumbs) => {
            expect(crumbsFor(path, stew, false)).toEqual(crumbs);
        });

        it("leads from Recipes, as a link, to the recipe on its page", () => {
            expect(crumbsFor('/recipes/beef-stew', stew, false)).toEqual([recipes, { title: 'Beef Stew' }]);
        });

        it("stops at Recipes until the page's recipe has loaded, or when it can't be", () => {
            expect(crumbsFor('/recipes/beef-stew', null, false)).toEqual([recipes]);
        });

        it("stops at Recipes when the last recipe loaded is another page's", () => {
            expect(crumbsFor('/recipes/lentil-soup', stew, false)).toEqual([recipes]);
        });

        it.each([
            ['/', [{ title: 'Home' }]],
            ['/recipes', [{ title: 'Recipes' }]],
            ['/recipes/beef-stew', [{ title: 'Beef Stew' }]],
        ])('shows only the last crumb for %s on a small screen', (path, crumbs) => {
            expect(crumbsFor(path, stew, true)).toEqual(crumbs);
        });

        it('has none for a path under no link', () => {
            expect(crumbsFor('/unknown', stew, false)).toEqual([]);
        });
    });
});
