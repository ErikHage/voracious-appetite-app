<template>
  <v-card class="elevation-4">
    <v-card-title class="d-flex justify-start">Ingredients</v-card-title>
    <v-card-text>
      <div v-for="(ingredient, index) in ingredients" :key="index">
        {{ ingredient }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "IngredientsList",

  props: {
    ingredients: {
      type: Array,
      default: () => [],
    }
  },
}
</script>
