export default defineNuxtRouteMiddleware((to, from) => {
   if (to.path == "/") {
     return navigateTo("/login");
   }
   if (to.path == "/app") {
    return navigateTo("/login");
  }
 });