<template>
  <v-container>
    <v-app-bar app v-if="!showAppBar">
      <v-btn :to="loginPath" color="primary">Login</v-btn>
    </v-app-bar>
    <div class="text-center mb-4">
      <v-img
          :src="getAssetPath('ai-owl.jpg')"
          alt="Logo"
          contain
          max-width="500"
          class="mx-auto"
      ></v-img>
    </div>
  </v-container>
</template>

<script>

import { views } from "@/utils/constants";
import { mapState } from "pinia";
import { useAuthenticationStore } from "@/store";
import { getAssetPath } from "@/utils/assets";

export default {
  name: 'PublicPage',

  data: () => ({
    loginPath: views.login.path,
  }),

  computed: {
    ...mapState(useAuthenticationStore, {
      showAppBar: 'showAppBar',
    }),
  },

  methods: {
    getAssetPath,
  },
}
</script>
