<template>
  <v-container>
    <div class="text-center">
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
  </v-container>
</template>

<script>

import { getAssetPath } from "@/utils/assets";

export default {
  name: 'Dashboard',

  data: () => ({}),

  computed: {},

  methods: {
    getAssetPath,
  },
}
</script>
