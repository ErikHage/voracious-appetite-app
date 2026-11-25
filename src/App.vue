<template>
  <!-- FrAppShell on every page: the side drawer, and the toolbar with the
       command palette and the theme menu. There's no login, so no user menu.
       The palette finds recipes too -->
  <fr-app-shell
      title="Voracious Appetite"
      storage-prefix="voracious-appetite"
      :sections="sections"
      :active-view="activeView"
      :search-sources="searchSources"
  >
    <router-view/>
  </fr-app-shell>
</template>

<script>
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
    activeView() {
      return activeViewFor(this.$route.path);
    },
  },
}
</script>
