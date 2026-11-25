import { defineStore } from 'pinia';
import recipesApi from "@/api/recipes-api";

export const useCommonStore = defineStore('common', {
    actions: {
        async loadRecipes() {
            this.recipesLoadError = null;
            this.status = 'loading';
            try {
                this.recipes = await recipesApi.getRecipes();
                this.status = 'idle';
            } catch (err) {
                // The recipe list shows this until a load succeeds
                console.error(err);
                this.recipesLoadError = 'Unable to load recipes';
                this.status = 'error';
            }
        },
        async loadSelectedRecipe(recipeId) {
            // Forget the previous recipe, so neither a slow load nor a failed
            // one shows it in place of this one
            this.selectedRecipe = null;
            this.selectedRecipeError = null;
            this.status = 'loading';
            try {
                this.selectedRecipe = await recipesApi.getRecipeById(recipeId);
                this.status = 'idle';
            } catch (err) {
                // The details page shows this until a load succeeds
                console.error(err);
                this.selectedRecipeError = err.status === 404 ? 'not-found' : 'failed';
                this.status = 'error';
            }
        },
    },
    state: () => {
        return {
            status: 'idle',
            recipes: [], // this is a summary object
            selectedRecipe: null, // thi is the full object
            selectedRecipeError: null, // 'not-found' | 'failed', when it couldn't be loaded
            recipesLoadError: null, // the recipe list's message, when it couldn't be loaded
        };
    },
});
