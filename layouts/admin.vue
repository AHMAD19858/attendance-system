<template>
  <link
    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    rel="stylesheet"
  />

  <link
    rel="stylesheet"
    href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
  />

  <div
    class="main-layout"
    :class="{
      'sidebar-open': sidebarOpen,
    }"
  >
    <AdminNav>
      <slot name="navbar-right"></slot>
    </AdminNav>
    <AdminNav/>
    <AdminSidebar/>
    <main class="flex flex-col main-wrapper transition-all">
      <div class="bg-white ">
        <slot />
       
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.main-layout {
  .main-wrapper {
    width: calc(100vw - 250px);
    margin-left: 250px;
    @apply pt-[50px];
  }
  &:not(.sidebar-open) {
    /* background: red; */
    .sidebar {
      width: 60px;
      padding-left: 0.5rem;
      padding-right: 0.5rem;

      .section-title {
        opacity: 0;
      }
      .menu-link {
        padding-left: 0;
        padding-right: 0;
        .menu-icon {
          margin: 0 auto;
        }
        &:hover {
          .menu-group {
            transform: scale(1);
            width: fit-content;
          }
        }
      }

      .menu-group {
        position: absolute;
        @apply bg-primary;
        left: 58px;
        padding: 7px 15px;
        border-radius: 7px;
        top: 0;
        width: 155px;
        transform: scale(0);
        transform-origin: 0 center;
        &.open {
          transform: scale(1);
        }
      }
      .sub {
        position: absolute;
        left: 58px;
        @apply bg-primary;
        width: 155px;
        border-radius: 7px;
        top: 36px;
      }
    }
    .aside-nav {
      width: 60px;
    }
    .main-wrapper {
      width: calc(100vw - 40px);
      margin-left: 40px;
    }
  }
  &.sidebar-open {
    .sidebar {
      @apply z-10;
    }

    .main-wrapper {
      width: calc(100vw - 40px);
      margin-left: 40px;
    }
  }
}
</style>

<script setup>
import { useSettingsStore } from "~/stores/settings";
const { sidebarOpen } = storeToRefs(useSettingsStore());
useHead({
  title: "Dashboard | Attendance",
});
</script>
