import axios from "axios";

import { withApiErrorHandling } from './error-handler';
import { recipeServiceBaseUrl } from '@/utils/constants';

async function getRecipes() {
    try {
        const response = await axios.get(`${recipeServiceBaseUrl.v0}/recipes`);
        return response.data;
    } catch (err) {
        console.log('Error fetching recipes');
        throw err;
    }
}

async function getRecipeById(recipeId) {
    try {
        const response = await axios.get(`${recipeServiceBaseUrl.v0}/recipes/${recipeId}`);
        return response.data;
    } catch (err) {
        console.log(`Error fetching recipe with id: ${recipeId}`);
        throw err;
    }
}

export default {
    getRecipes: withApiErrorHandling(getRecipes),
    getRecipeById: withApiErrorHandling(getRecipeById),
};
