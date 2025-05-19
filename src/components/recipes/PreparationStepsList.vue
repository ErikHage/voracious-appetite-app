<template>
  <v-card class="elevation-4 fill-height d-flex flex-column">
    <v-card-title class="d-flex justify-start">Steps</v-card-title>
    <v-card-text class="flex-grow-1 overflow-auto">
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
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "PreparationStepsList",

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
