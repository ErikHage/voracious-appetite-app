import { activeViewFor, sections } from '@/utils/navigation';

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
});
