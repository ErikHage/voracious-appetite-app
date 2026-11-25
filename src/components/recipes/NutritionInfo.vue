<template>
  <fr-card title="Nutritional Information">
    <fr-table>
      <tbody >
      <tr>
        <th>Serving Size</th>
        <td>{{ servingSize }}</td>
      </tr>
      <tr>
        <th>Calories</th>
        <td>{{ calories }}</td>
      </tr>
      <tr>
        <th>Fats (g)</th>
        <td>{{ fats }}</td>
      </tr>
      <tr>
        <th>Carbs (g)</th>
        <td>{{ carbs }}</td>
      </tr>
      <tr>
        <th>Sugars (g)</th>
        <td>{{ sugars }}</td>
      </tr>
      <tr>
        <th>Protein (g)</th>
        <td>{{ protein }}</td>
      </tr>
      </tbody>
    </fr-table>
  </fr-card>
</template>

<script>
import {FrCard, FrTable} from "@feral-auth/vue-components";

export default {
  name: "NutritionInfo",

  components: {
    FrCard,
    FrTable,
  },

  props: {
    nutrition: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    servingSize() {
      const servingSize = this.nutrition.servingSize;

      if (servingSize?.value == null) {
        return '---';
      }

      return `${servingSize.value} ${servingSize.type ?? ''}`.trim();
    },

    calories() {
      return this.nutrition.calories ?? '---';
    },

    fats() {
      return this.nutrition.fats ?? '---';
    },

    carbs() {
      return this.nutrition.carbohydrates ?? '---';
    },

    sugars() {
      return this.nutrition.sugars ?? '---';
    },

    protein() {
      return this.nutrition.protein ?? '---';
    },

  },
}
</script>
