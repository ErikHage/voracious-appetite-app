<template>
  <!-- FrAppShell on every page: the side drawer, and the toolbar with the
       command palette and the theme menu. There's no login, so no user menu -->
  <fr-app-shell
      title="Voracious Appetite"
      storage-prefix="voracious-appetite"
      :sections="sections"
      :active-view="activeView"
  >
    <router-view/>
  </fr-app-shell>
</template>

<script>
import { FrAppShell } from "@feral-auth/vue-components";
import { activeViewFor, sections } from "@/utils/navigation";

export default {
  name: 'App',

  components: { FrAppShell },

  data: () => ({
    sections,
  }),

  computed: {
    activeView() {
      return activeViewFor(this.$route.path);
    },
  },
}
</script>
