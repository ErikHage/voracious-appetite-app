<template>
  <v-card class="elevation-4 fill-height d-flex flex-column">
    <v-card-title class="d-flex justify-start">Ingredients</v-card-title>
    <v-card-text class="flex-grow-1 overflow-auto">
      <v-table density="compact">
        <tbody>
        <tr v-for="(ingredient, index) in ingredients"
            :key="ingredient.name + index">
          <td class="quantity-col">
            <span class="ingredient-quantity-value">{{ ingredient.quantity.value }}</span>
            {{ toDisplayUnit(ingredient.quantity.kind) }}
          </td>
          <td class="name-col">
            {{ ingredient.name }}
            <span v-if="ingredient.notes" class="ingredient-notes">
              {{ ingredient.notes }}
            </span>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script>
import measurements from "@/utils/measurements";

export default {
  name: "IngredientsList",

  props: {
    ingredients: {
      type: Array,
      default: () => [],
    }
  },

  methods: {
    toDisplayUnit(measurementKind) {
      return measurements.mapMeasurementKind(measurementKind);
    }
  },
}
</script>

<style scoped>
.quantity-col {
  width: 1%;
  white-space: nowrap;
  text-align: right;
}

.ingredient-quantity-value {
  font-weight: bold;
}

.name-col {
  width: 99%;
  text-align: left;
}

.ingredient-notes {
  color: grey;
  text-align: left;
  font-style: italic;
}
</style>
