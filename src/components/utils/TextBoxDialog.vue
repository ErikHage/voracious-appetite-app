<template>
  <v-dialog v-model="show" max-width="50vw" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          v-bind="activatorProps"
          v-if="buttonText !== null"
          size="small"
          color="black"
          :text="buttonText"
          @click="show = true"
      ></v-btn>
      <v-btn
          v-bind="activatorProps"
          v-else
          class="py-1 px-2"
          size="xs"
          color="black"
          :text="buttonText"
          @click="show = true"
      ><v-icon>mdi-pencil</v-icon></v-btn>
    </template>

    <v-card>
      <v-card-title v-if="title">
        {{ title }}
      </v-card-title>

      <v-card-subtitle v-if="subtitle">
        <span>{{ subtitle }}</span>
      </v-card-subtitle>

      <v-card-text>
        <v-textarea
            v-model="textValue"
            variant="solo"
            rows="5"
            auto-grow
            counter
        ></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="handleCancel">Cancel</v-btn>
        <v-btn color="primary" @click="handleSubmit">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TextBoxDialog",

  props: {
    buttonText: {
      type: String,
      default: () => null,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    value: {
      type: String,
      default: () => null,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      textValue: null,
      show: false,
    };
  },

  methods: {
    handleSubmit() {
      this.onSubmit(this.textValue);
      this.show = false;
    },

    handleCancel() {
      this.show = false;
    },
  },

  mounted() {
    this.textValue = this.value;
  },

  watch: {
    value: {
      immediate: true,
      handler(newTextValue) {
        this.textValue = newTextValue;
      },
    },
  },
}
</script>

<style scoped>

</style>