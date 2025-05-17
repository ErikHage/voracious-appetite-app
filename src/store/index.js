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
            try {
                this.recipes = await recipesApi.getRecipes();
            } catch (err) {
                this.setAlertMessage(err, 'error', 'unable to load recipes');
            }
        },
    },
    state: () => {
        return {
            recipes: [],
            selectedRecipe: null,
            alertVisible: false,
            alertType: 'success',
            alertMessage: null,
        };
    },
});
