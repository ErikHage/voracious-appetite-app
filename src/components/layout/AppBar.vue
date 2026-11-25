<template>
  <!-- No Fr* app bar or toolbar title yet -->
  <v-app-bar app>
    <template v-if="$vuetify.display.smAndDown">
      <!-- color="default": FrBtn makes every other button primary -->
      <fr-btn :to="dashboardPath" icon aria-label="Home" color="default">
        <fr-icon>mdi-home</fr-icon>
      </fr-btn>
    </template>

    <template v-else>
      <v-toolbar-title>Voracious Appetite</v-toolbar-title>
    </template>

    <fr-spacer/>

    <fr-btn class="mr-2" :to="recipesPath" color="default">Recipes</fr-btn>
  </v-app-bar>
</template>

<script>
import {FrBtn, FrIcon, FrSpacer} from "@feral-auth/vue-components";

export default {
  name: "AppBar",

  components: {
    FrBtn,
    FrIcon,
    FrSpacer,
  },

  data: () => ({
    dashboardPath: '/',
    recipesPath: '/recipes',
  }),
}
</script>
