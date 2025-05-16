<template>
  <transition name="fade">
    <v-alert
        v-if="isVisible"
        :type="alertType"
        class="mt-3">{{ message }}
    </v-alert>
  </transition>
</template>

<script>
export default {
  name: "FadeOutAlert",

  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    alertType: {
      type: String,
    },
    message: {
      type: String,
    },
  }
}
</script>

<style scoped>

</style>