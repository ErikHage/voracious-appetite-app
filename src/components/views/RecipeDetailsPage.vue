<template>
  <v-container>
    <div v-if="selectedRecipe">
      <v-row>
        <v-col>
          <div class="text-center">
            <h1>{{ selectedRecipe.recipeName }}</h1>
            <h3 v-if="!!keywords">{{ keywords }}</h3>
            <fade-out-alert :is-visible="alert.isVisible" :alert-type="alert.type" :message="alert.message"/>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text class="pa-1 fill-height">
              <v-row>
                <v-col cols="4" class="h-100 d-flex flex-column">
                  <TimeAndYield
                      class="ma-1"
                      :prep="selectedRecipe.prep"
                      :cook="selectedRecipe.cook"
                      :yield="selectedRecipe.yield"
                  />
                  <Nutrition
                      class="ma-1 mt-auto"
                    :nutrition="selectedRecipe.nutrition"/>
                </v-col>
                <v-col cols="8" class="d-flex flex-column">
                  <IngredientsList
                      class="ma-1 fill-height"
                      :ingredients="selectedRecipe.ingredients"/>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
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
import FadeOutAlert from "@/components/utils/FadeOutAlert.vue";
import {mapActions, mapState} from "pinia";
import {useCommonStore} from "@/store";
import TimeAndYield from "@/components/recipes/TimeAndYield.vue";
import IngredientsList from "@/components/recipes/IngredientsList.vue";
import Nutrition from "@/components/recipes/Nutrition.vue";

export default {
  name: 'RecipeDetailsPage',

  components: {
    Nutrition,
    IngredientsList,
    TimeAndYield,
    FadeOutAlert,
  },

  computed: {
    ...mapState(useCommonStore, {
      selectedRecipe: 'selectedRecipe',
      alertType: 'alertType',
      alertMessage: 'alertMessage',
      alertVisible: 'alertVisible',
    }),

    keywords() {
      if (this.selectedRecipe.keywords?.length > 0) {
        return this.selectedRecipe.keywords.join(", ");
      }
      return '';
    },

    alert() {
      return {
        isVisible: this.alertVisible,
        type: this.alertType,
        message: this.alertMessage,
      };
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
