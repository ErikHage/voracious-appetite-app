<template>
  <fr-card class="fill-height" title="Steps">
    <ol class="ml-6">
      <li
          v-for="(step, index) in steps"
          :key="'prep-step-' + index"
          class="py-1">
        <span class="step-text">
          {{ step.text }}
        </span>
      </li>
    </ol>
  </fr-card>
</template>

<script>
import {FrCard} from "@feral-auth/vue-components";

export default {
  name: "PreparationStepsList",

  components: {
    FrCard,
  },

  props: {
    steps: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.prep-step-text {

}
</style>
