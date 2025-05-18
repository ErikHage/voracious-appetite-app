<template>
  <v-card class="elevation-4">
    <v-card-title class="d-flex justify-start">Ingredients</v-card-title>
    <v-card-text>
      <ul class="ml-6">
        <li v-for="(ingredient, index) in ingredients" :key="ingredient.name + index">
          <span class="ingredient-quantity-value pr-2">
            {{ ingredient.quantity.value }}
          </span>
          <span class="ingredient-quantity-kind pr-2">
            {{ ingredient.quantity.kind }}
          </span>
          <span class="ingredient-name pr-2">
            {{ ingredient.name }}
          </span>
          <span v-if="ingredient.notes" class="ingredient-notes">
            {{ ingredient.notes  }}
          </span>
        </li>
      </ul>
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

<style scoped>
.ingredient-quantity-value {
  display: inline-block;
  width: 40px;
  text-align: right;
}
.ingredient-quantity-kind {
  display: inline-block;
  width: 100px;
  text-align: left;
}
.ingredient-name {
  text-align: left;
}
.ingredient-notes {
  color: grey;
  text-align: left;
  font-style: italic;
}
</style>
