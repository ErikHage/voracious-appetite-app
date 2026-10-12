<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
            id="back-to-recipes"
            variant="text"
            color="primary"
            prepend-icon="mdi-arrow-left"
            :to="{ name: 'recipes-list' }"
        >
          Back to recipes
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="selectedRecipe">
      <v-row>
        <v-col>
          <div class="text-center">
            <h1>{{ selectedRecipe.recipeName }}</h1>
            <h3 v-if="!!keywords">{{ keywords }}</h3>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text class="pa-1 fill-height">
              <v-row>
                <v-col cols="12" md="4" class="h-100 d-flex flex-column">
                  <TimeAndYield
                      class="ma-1"
                      :prep="selectedRecipe.prep"
                      :cook="selectedRecipe.cook"
                      :yield="selectedRecipe.yield"
                  />
                  <NutritionInfo
                      class="ma-1 mt-auto"
                    :nutrition="selectedRecipe.nutrition"/>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column">
                  <IngredientsList
                      class="ma-1 fill-height"
                      :ingredients="selectedRecipe.ingredients"/>
                </v-col>
                <v-col cols="12">
                  <PreparationStepsList
                    :steps="selectedRecipe.steps"/>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-row v-else-if="selectedRecipeError">
      <v-col>
        <v-alert type="error" class="mx-auto" max-width="600">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
    <div v-else>
      <v-skeleton-loader
          type="heading, paragraph, paragraph"
          elevation="2"
          class="mx-auto"
          max-width="600"
      />
    </div>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "pinia";
import {useCommonStore} from "@/store";
import TimeAndYield from "@/components/recipes/TimeAndYield.vue";
import IngredientsList from "@/components/recipes/IngredientsList.vue";
import NutritionInfo from "@/components/recipes/NutritionInfo.vue";
import PreparationStepsList from "@/components/recipes/PreparationStepsList.vue";

export default {
  name: 'RecipeDetailsPage',

  components: {
    PreparationStepsList,
    NutritionInfo,
    IngredientsList,
    TimeAndYield,
  },

  computed: {
    ...mapState(useCommonStore, {
      selectedRecipe: 'selectedRecipe',
      selectedRecipeError: 'selectedRecipeError',
    }),

    keywords() {
      if (this.selectedRecipe.keywords?.length > 0) {
        return this.selectedRecipe.keywords.join(", ");
      }
      return '';
    },

    errorMessage() {
      return this.selectedRecipeError === 'not-found'
          ? 'Recipe not found'
          : 'Unable to load this recipe';
    },
  },

  methods: {
    ...mapActions(useCommonStore, [
      'loadSelectedRecipe',
    ]),
  },

  async mounted() {
    await this.loadSelectedRecipe(this.$route.params.recipeId);
  }
}
</script>
