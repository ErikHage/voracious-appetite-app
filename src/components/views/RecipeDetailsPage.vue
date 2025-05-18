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
            <v-card-text>
              <div class="d-flex">
                <TimeAndYield
                    :prep="selectedRecipe.prep"
                    :cook="selectedRecipe.cook"
                    :yield="selectedRecipe.yield"
                />
              </div>
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

export default {
  name: 'RecipeDetailsPage',

  components: {
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
