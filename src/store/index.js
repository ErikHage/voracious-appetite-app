import { defineStore } from 'pinia';
import recipesApi from "@/api/recipes-api";

export const useCommonStore = defineStore('common', {
    actions: {
        setAlertMessage(err, type, message) {
            if (err) {
                console.error(err);
            }
            this.alertVisible = true;
            this.alertType = type;
            this.alertMessage = message;
            setTimeout(() => {
                this.alertVisible = false;
            }, 3000);
        },
        async loadRecipes() {
            this.status = 'loading';
            try {
                this.recipes = await recipesApi.getRecipes();
                this.status = 'idle';
            } catch (err) {
                this.setAlertMessage(err, 'error', 'unable to load recipes');
                this.status = 'error';
            }
        },
        async loadSelectedRecipe(recipeId) {
            this.status = 'loading';
            try {
                this.selectedRecipe = await recipesApi.getRecipeById(recipeId);
                this.status = 'idle';
            } catch (err) {
                this.setAlertMessage(err, 'error', 'unable to load recipes');
                this.status = 'error';
            }
        },
    },
    state: () => {
        return {
            status: 'idle',
            recipes: [], // this is a summary object
            selectedRecipe: null, // thi is the full object
            alertVisible: false,
            alertType: 'success',
            alertMessage: null,
        };
    },
});
