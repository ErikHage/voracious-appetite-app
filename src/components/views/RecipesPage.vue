<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-center">
          <h1>Recipes</h1>
          <fade-out-alert :is-visible="alert.isVisible" :alert-type="alert.type" :message="alert.message"/>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-text-field
                id="filter-recipes"
                class="mb-4 mt-2"
                v-model="recipeFilter"
                placeholder="Search..."
                clearable
                dense
                outlined
                hide-details
            />
          </v-card-title>
          <v-card-text>
            <v-table
                density="compact"
                class="elevation-1 mb-4"
                height="65vh">
              <tbody>
              <tr v-for="recipe in filteredRecipes" :key="recipe.recipeId">
                <td>
                  <v-btn
                      variant="text"
                      color="primary"
                      @click="onRecipeClick(recipe.recipeId)"
                  >
                    {{ recipe.recipeName }}
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </v-table>
            <span>Showing {{ filteredRecipes.length }} of {{ recipes.length }} recipes</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "pinia";
import {useCommonStore} from "@/store";
import FadeOutAlert from "@/components/utils/FadeOutAlert.vue";
import {recipeFilterStorageKey} from "@/utils/constants";

export default {
  name: 'RecipesPage',

  components: {
    FadeOutAlert,
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
      alertType: 'alertType',
      alertMessage: 'alertMessage',
      alertVisible: 'alertVisible',
    }),

    alert() {
      return {
        isVisible: this.alertVisible,
        type: this.alertType,
        message: this.alertMessage,
      };
    },

    filteredRecipes() {
      let filtered = [...this.recipes];

      if (this.recipeFilter) {
        // Every word typed must appear somewhere in the recipe's match string,
        // in any order. recipes-service joins a recipe's words with '.', so the
        // search as typed (with its spaces) never appears whole
        const words = this.recipeFilter.toLowerCase().split(/\s+/).filter(Boolean);

        return this.recipes.filter(recipe => {
          const matchString = recipe.filterMatchString.toLowerCase();
          return words.every(word => matchString.includes(word));
        });
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
