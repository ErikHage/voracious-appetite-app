<template>
  <v-dialog v-model="showDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-date-picker
              v-model="selectedDate"
              label="Select Date"
              required
              locale="en"
              full-width
          ></v-date-picker>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="handleOnCancel">Cancel</v-btn>
        <v-btn color="primary" text @click="handleOnSubmit">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DatePickerDialog',

  props: {
    show: Boolean,
    title: String,
    date: Date,
    onSubmit: Function,
    onCancel: Function,
  },

  data() {
    return {
      selectedDate: this.date || null,
    }
  },

  computed: {
    showDialog() {
      return this.show;
    },
  },

  methods: {
    handleOnCancel() {
      this.onCancel();
    },

    handleOnSubmit() {
      this.onSubmit(this.selectedDate);
    },
  },
}
</script>