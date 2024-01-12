<template>
  <link
    rel="stylesheet"
    href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
  />

  <div class="main-layout">
    <AppNav />
    <main class="flex flex-col main-wrapper transition-all">
      <div class="bg-white">
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.main-layout {
  .main-wrapper {
    width: calc(100vw);
    @apply pt-[50px];
  }
}
</style>

<script setup>
useHead({
  title: "Dashboard | Attendance",
});
</script>
