import router from '@/router';
import Dashboard from '@/components/views/Dashboard.vue';
import RecipesPage from '@/components/views/RecipesPage.vue';
import RecipeDetailsPage from '@/components/views/RecipeDetailsPage.vue';

describe('router', () => {
    it('serves the app under /apps/voracious-appetite/', () => {
        expect(router.resolve('/recipes').href).toBe('/apps/voracious-appetite/recipes');
    });

    it.each([
        ['/', 'dashboard', Dashboard],
        ['/recipes', 'recipes-list', RecipesPage],
        ['/recipes/42', 'recipe-details', RecipeDetailsPage],
    ])('resolves %s to the %s route', (path, name, component) => {
        const route = router.resolve(path);

        expect(route.name).toBe(name);
        expect(route.matched[0].components.default).toBe(component);
    });

    it('passes the recipe id as a route param', () => {
        expect(router.resolve('/recipes/42').params).toEqual({ recipeId: '42' });
    });
});
