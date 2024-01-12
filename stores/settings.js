export const useSettingsStore = defineStore("settings", () => {
   const sidebar = ref(useCookie("sidebar"));
   const sidebarOpen = computed(() => sidebar.value && sidebar.value);
   const sidebarOverlayed = ref(false);

   const pageTitle = ref("");

   function openSidebar() {
      sidebar.value = true;
   }
   function toggleSidebar() {
      sidebar.value = !sidebar.value;
   }
   function setSidebarStatus(status) {
      sidebar.value = status;
   }
   function closeSidebar() {
      sidebar.value = false;
   }

   async function setPageTitle(title) {
      pageTitle.value = title;
   }
   function setSidebarOverlay(status) {
      sidebarOverlayed.value = status;
   }
   return {
      sidebarOpen,
      setSidebarStatus,
      toggleSidebar,
      pageTitle,
      setPageTitle,
      sidebarOverlayed,
      setSidebarOverlay,
   };
});
