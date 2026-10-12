<template>
  <v-card class="elevation-4">
    <v-card-title class="d-flex justify-start">Time and Yield</v-card-title>
    <v-card-text>
      <v-table density="compact">
        <tbody>
        <tr v-if="prep">
          <th>Prep Time</th>
          <td>{{ prep.value }} {{ prep.kind }}</td>
        </tr>
        <tr v-if="cook">
          <th>Cook Time</th>
          <td>{{ cook.value }} {{ cook.kind }}</td>
        </tr>
        <!-- `yield` is a reserved word in strict-mode JS, but works as a prop name -->
        <!-- eslint-disable vue/no-parsing-error -->
        <tr v-if="yield">
          <th>Yield</th>
          <td>{{ yield.value }} {{ yield.kind }}</td>
        </tr>
        <!-- eslint-enable vue/no-parsing-error -->
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TimeAndYield",

  props: {
    prep: {
      type: Object,
      default: null,
    },
    cook: {
      type: Object,
      default: null,
    },
    yield: {
      type: Object,
      default: null,
    },
  },
}
</script>

