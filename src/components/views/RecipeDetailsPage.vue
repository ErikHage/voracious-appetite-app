<template>
  <!-- No title of its own: the recipe's name is the title, below the way back -->
  <fr-page>
    <fr-btn
        id="back-to-recipes"
        class="mb-4"
        variant="text"
        prepend-icon="mdi-arrow-left"
        :to="{ name: 'recipes-list' }"
    >
      Back to recipes
    </fr-btn>
    <div v-if="selectedRecipe">
      <fr-page-title :title="selectedRecipe.recipeName"/>
      <h3 v-if="!!keywords" class="mb-6">{{ keywords }}</h3>
      <fr-card flush>
        <div class="pa-1 fill-height">
          <fr-row>
            <fr-col cols="12" md="4" class="h-100 d-flex flex-column">
              <TimeAndYield
                  class="ma-1"
                  :prep="selectedRecipe.prep"
                  :cook="selectedRecipe.cook"
                  :yield="selectedRecipe.yield"
              />
              <NutritionInfo
                  class="ma-1 mt-auto"
                  :nutrition="selectedRecipe.nutrition"/>
            </fr-col>
            <fr-col cols="12" md="8" class="d-flex flex-column">
              <IngredientsList
                  class="ma-1 fill-height"
                  :ingredients="selectedRecipe.ingredients"/>
            </fr-col>
            <fr-col cols="12">
              <PreparationStepsList
                  :steps="selectedRecipe.steps"/>
            </fr-col>
          </fr-row>
        </div>
      </fr-card>
    </div>
    <!-- Stays until a load succeeds -->
    <fr-alert v-else-if="selectedRecipeError" type="error" class="mx-auto" max-width="600">
      {{ errorMessage }}
    </fr-alert>
    <fr-skeleton
        v-else
        type="heading, paragraph, paragraph"
        elevation="2"
        class="mx-auto"
        max-width="600"
    />
  </fr-page>
</template>

<script>
import {mapActions, mapState} from "pinia";
import {
  FrAlert,
  FrBtn,
  FrCard,
  FrCol,
  FrPage,
  FrPageTitle,
  FrRow,
  FrSkeleton,
} from "@feral-auth/vue-components";
import {useCommonStore} from "@/store";
import TimeAndYield from "@/components/recipes/TimeAndYield.vue";
import IngredientsList from "@/components/recipes/IngredientsList.vue";
import NutritionInfo from "@/components/recipes/NutritionInfo.vue";
import PreparationStepsList from "@/components/recipes/PreparationStepsList.vue";

export default {
  name: 'RecipeDetailsPage',

  components: {
    FrAlert,
    FrBtn,
    FrCard,
    FrCol,
    FrPage,
    FrPageTitle,
    FrRow,
    FrSkeleton,
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
