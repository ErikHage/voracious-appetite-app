import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
// import { aliases, mdi } from 'vuetify/iconsets/mdi' // Optional: for custom icon config
// import colors from 'vuetify/util/colors' // Optional: for custom themes

export default createVuetify({
    theme: {
        defaultTheme: 'dark',
        // themes: {
        //   dark: {
        //     dark: true,
        //     colors: {
        //       primary: colors.blue.darken2,
        //       secondary: colors.deepPurple.accent4,
        //     },
        //   },
        // },
    },
    // icons: {
    //   defaultSet: 'mdi',
    //   aliases,
    //   sets: { mdi },
    // },
})

