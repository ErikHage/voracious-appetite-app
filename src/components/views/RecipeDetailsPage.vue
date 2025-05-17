<template>
  <v-container>
    <div v-if="selectedRecipe">
      <v-row>
        <v-col>
          <div class="text-center">
            <h1>{{ selectedRecipe.recipeName }}</h1>
            <fade-out-alert :is-visible="alert.isVisible" :alert-type="alert.type" :message="alert.message"/>
          </div>
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

export default {
  name: 'RecipeDetailsPage',

  components: {
    FadeOutAlert,
  },

  computed: {
    ...mapState(useCommonStore, {
      selectedRecipe: 'selectedRecipe',
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
