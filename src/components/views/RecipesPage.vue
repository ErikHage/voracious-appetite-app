<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-center">
          <h1>Recipes</h1>
          <fade-out-alert :is-visible="alert.isVisible" :alert-type="alert.type" :message="alert.message"/>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-text-field
                id="filter-recipes"
                class="mb-4 mt-2"
                v-model="recipeFilter"
                placeholder="Search..."
                clearable
                dense
                outlined
                hide-details
            />
          </v-card-title>
          <v-card-text>
            <v-table density="compact" class="elevation-1">
              <tbody>
              <tr v-for="recipe in filteredRecipes" :key="recipe.recipeId">
                <td>
                  <v-btn
                      variant="text"
                      color="primary"
                      @click="onRecipeClick(recipe.recipeId)"
                  >
                    {{ recipe.recipeName }}
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "pinia";
import {useCommonStore} from "@/store";
import FadeOutAlert from "@/components/utils/FadeOutAlert.vue";

export default {
  name: 'RecipesPage',

  components: {
    FadeOutAlert,
  },

  data() {
    return {
      recipeFilter: '',
    };
  },

  computed: {
    ...mapState(useCommonStore, {
      recipes: 'recipes',
      alertType: 'alertType',
      alertMessage: 'alertMessage',
      alertVisible: 'alertVisible',
    }),

    alert() {
      return {
        isVisible: this.alertVisible,
        type: this.alertType,
        message: this.alertMessage,
      };
    },

    filteredRecipes() {
      if (!this.recipeFilter) {
        return this.recipes;
      }
      return this.recipes.filter(recipe => recipe.filterMatchString.includes(this.recipeFilter));
    },
  },

  methods: {
    ...mapActions(useCommonStore, [
      'loadRecipes',
    ]),

    onRecipeClick(recipeId) {
      this.$router.push(`/recipes/${recipeId}`)
    },
  },

  async mounted() {
    await this.loadRecipes();
  },
}
</script>
