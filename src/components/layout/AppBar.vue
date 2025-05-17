<template>
  <v-app-bar app>
    <v-toolbar-title>Voracious Appetite</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn :to="dashboardPath">Dashboard</v-btn>
    <v-btn :to="recipesPath">Recipes</v-btn>
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
