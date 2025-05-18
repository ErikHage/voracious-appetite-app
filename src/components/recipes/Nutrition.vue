<template>
  <v-card class="elevation-4">
    <v-card-title class="d-flex justify-start">Nutritional Information</v-card-title>
    <v-card-text>
      <v-table density="compact">
        <tbody >
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
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Nutrition",

  props: {
    nutrition: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
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
