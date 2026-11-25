<template>
  <fr-page title="Recipes">
    <!-- Stays until a load succeeds: a fading message would leave an empty list
         with nothing saying why -->
    <fr-alert v-if="recipesLoadError" type="error" class="mb-4">{{ recipesLoadError }}</fr-alert>
    <fr-card>
      <fr-text-field
          id="filter-recipes"
          class="mb-4"
          v-model="recipeFilter"
          placeholder="Search..."
          clearable
          hide-details
      />
      <fr-table
          class="mb-4"
          height="65vh">
        <tbody>
        <tr v-for="recipe in filteredRecipes" :key="recipe.recipeId">
          <td>
            <fr-btn
                variant="text"
                @click="onRecipeClick(recipe.recipeId)"
            >
              {{ recipe.recipeName }}
            </fr-btn>
          </td>
        </tr>
        </tbody>
      </fr-table>
      <span>Showing {{ filteredRecipes.length }} of {{ recipes.length }} recipes</span>
    </fr-card>
  </fr-page>
</template>

<script>
import {mapActions, mapState} from "pinia";
import {FrAlert, FrBtn, FrCard, FrPage, FrTable, FrTextField} from "@feral-auth/vue-components";
import {useCommonStore} from "@/store";
import {recipeFilterStorageKey} from "@/utils/constants";
import {matchesRecipeSearch} from "@/utils/recipe-search";

export default {
  name: 'RecipesPage',

  components: {
    FrAlert,
    FrBtn,
    FrCard,
    FrPage,
    FrTable,
    FrTextField,
  },

  data() {
    return {
      // sessionStorage keeps the search for this visit only
      recipeFilter: sessionStorage.getItem(recipeFilterStorageKey) || '',
    };
  },

  watch: {
    recipeFilter(value) {
      if (value) {
        sessionStorage.setItem(recipeFilterStorageKey, value);
      } else {
        sessionStorage.removeItem(recipeFilterStorageKey);
      }
    },
  },

  computed: {
    ...mapState(useCommonStore, {
      recipes: 'recipes',
      recipesLoadError: 'recipesLoadError',
    }),

    filteredRecipes() {
      let filtered = [...this.recipes];

      if (this.recipeFilter) {
        return this.recipes.filter(recipe => matchesRecipeSearch(recipe, this.recipeFilter));
      }

      return filtered.sort((a, b) =>
          a.recipeName.localeCompare(b.recipeName)
      );
    },
  },

  methods: {
    ...mapActions(useCommonStore, [
      'loadRecipes',
    ]),

    onRecipeClick(recipeId) {
      this.$router.push(`/recipes/${recipeId}`)
    },
  },

  async mounted() {
    await this.loadRecipes();
  },
}
</script>
