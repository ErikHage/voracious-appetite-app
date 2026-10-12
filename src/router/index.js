import { createRouter, createWebHistory } from 'vue-router';

import DashboardPage from "@/components/views/DashboardPage.vue";
import RecipesPage from "@/components/views/RecipesPage.vue";
import RecipeDetailsPage from "@/components/views/RecipeDetailsPage.vue";

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: DashboardPage,
        meta: {},
    },
    {
        path: '/recipes',
        name: 'recipes-list',
        component: RecipesPage,
        meta: {},
    },
    {
        path: '/recipes/:recipeId',
        name: 'recipe-details',
        component: RecipeDetailsPage,
        meta: {},
    },
];

const router = createRouter({
    history: createWebHistory('/apps/voracious-appetite/'),
    routes
});

export default router;
