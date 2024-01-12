

import moment from 'moment';

export default defineNuxtPlugin((nuxtApp) => {
   nuxtApp.vueApp.component("moment", moment);
});