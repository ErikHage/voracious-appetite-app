<template>
  <fr-card title="Time and Yield">
    <fr-table>
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
    </fr-table>
  </fr-card>
</template>

<script>
import {FrCard, FrTable} from "@feral-auth/vue-components";

export default {
  name: "TimeAndYield",

  components: {
    FrCard,
    FrTable,
  },

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

