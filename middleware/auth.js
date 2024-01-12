import { useUserStore } from "~/stores/auth"
export default defineNuxtRouteMiddleware(() => {
   const { isAuthenticated } = storeToRefs(useUserStore());
   if (!isAuthenticated.value) {
      return abortNavigation()
   }
})
