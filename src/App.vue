<template>
  <!-- FrAppShell on every page: the side drawer, and the toolbar with the
       command palette and the theme menu. There's no login, so no user menu.
       The palette finds recipes too, and a recipe's page titles the window -->
  <fr-app-shell
      title="Voracious Appetite"
      storage-prefix="voracious-appetite"
      :sections="sections"
      :active-view="activeView"
      :search-sources="searchSources"
      :view-title="viewTitle"
  >
    <router-view/>
  </fr-app-shell>
</template>

<script>
import { mapState } from "pinia";
import { FrAppShell } from "@feral-auth/vue-components";
import { useCommonStore } from "@/store";
import { activeViewFor, sections } from "@/utils/navigation";
import { recipeSearchSource } from "@/utils/recipe-search-source";

export default {
  name: 'App',

  components: { FrAppShell },

  data() {
    return {
      sections,
      searchSources: [recipeSearchSource(useCommonStore(), this.$router)],
    };
  },

  computed: {
    ...mapState(useCommonStore, ['selectedRecipe']),

    activeView() {
      return activeViewFor(this.$route.path);
    },

    // The recipe's name once its page has loaded it. Until then, or when it
    // can't be, and on every other page, the shell names the window after
    // the page's link. The store keeps the last recipe after its page is
    // left, so the path must be its page's
    viewTitle() {
      const recipe = this.selectedRecipe;
      return recipe && this.$route.path === `/recipes/${recipe.recipeId}` ? recipe.recipeName : '';
    },
  },
}
</script>
