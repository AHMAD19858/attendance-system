import { defineNuxtPlugin } from '#app'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin(nuxtApp => {
   nuxtApp.vueApp.use(Toast, { timeout: 2500, position: POSITION.TOP_RIGHT, })
})