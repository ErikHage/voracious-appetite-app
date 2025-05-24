<template>
  <v-app-bar app>
    <template v-if="$vuetify.display.smAndDown">
      <v-btn :to="dashboardPath" icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </template>

    <template v-else>
      <v-toolbar-title>Voracious Appetite</v-toolbar-title>
    </template>

    <v-spacer></v-spacer>

    <v-btn class="mr-2" :to="recipesPath">Recipes</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",

  data: () => ({
    dashboardPath: '/',
    recipesPath: '/recipes',
  }),
}
</script>
