<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" lg="6">
        <div class="text-center mb-4">
          <h1>Voracious Appetite</h1>
          <h3 class="ma-2">An Online Recipe Store</h3>
          <v-img
              :src="getAssetPath('ai-cardinal.jpg')"
              alt="Logo"
              contain
              max-width="500"
              class="mx-auto"
          ></v-img>
        </div>

        <v-card class="text-center">
          <v-card-title>Let's Get Cooking!</v-card-title>
          <v-card-text>
            <v-btn @click="goToRecipesList">Recipes</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import {getAssetPath} from "@/utils/assets";

export default {
  name: 'Dashboard',

  data: () => ({}),

  computed: {},

  methods: {
    getAssetPath,

    goToRecipesList() {
      this.$router.push("/recipes");
    },
  },
}
</script>
