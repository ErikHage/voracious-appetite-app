<template>
  <fr-card class="fill-height" title="Ingredients">
    <fr-table>
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
    </fr-table>
  </fr-card>
</template>

<script>
import {FrCard, FrTable} from "@feral-auth/vue-components";
import measurements from "@/utils/measurements";

export default {
  name: "IngredientsList",

  components: {
    FrCard,
    FrTable,
  },

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
