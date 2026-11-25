<template>
  <!-- The app's front page: centred, unlike the other pages -->
  <fr-container>
    <fr-row justify="center">
      <fr-col cols="12" lg="6">
        <div class="text-center mb-4">
          <h1>Voracious Appetite</h1>
          <h3 class="ma-2">An Online Recipe Store</h3>
          <fr-image
              :src="getAssetPath('ai-cardinal.jpg')"
              alt="Logo"
              max-width="500"
              class="mx-auto"
          />
        </div>

        <fr-card class="text-center" title="Let's Get Cooking!">
          <fr-btn @click="goToRecipesList">Recipes</fr-btn>
        </fr-card>
      </fr-col>
    </fr-row>
  </fr-container>
</template>

<script>
import {FrBtn, FrCard, FrCol, FrContainer, FrImage, FrRow} from "@feral-auth/vue-components";
import {getAssetPath} from "@/utils/assets";

export default {
  name: 'DashboardPage',

  components: {
    FrBtn,
    FrCard,
    FrCol,
    FrContainer,
    FrImage,
    FrRow,
  },

  methods: {
    getAssetPath,

    goToRecipesList() {
      this.$router.push("/recipes");
    },
  },
}
</script>
