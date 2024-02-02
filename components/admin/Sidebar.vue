<script setup>
import { useUserStore } from "~/stores/auth";
import { useSettingsStore } from "~/stores/settings";
const { sidebarOpen } = storeToRefs(useSettingsStore());
const { user } = storeToRefs(useUserStore());
const sections = [
  {
    title: "dashboard",
    links: [
      {
        iconClass: `fi fi-rr-apps`,
        name: "Dashboard",
        path: "/app/dashboard",
      },
      {
        iconClass: `fi fi-rr-users `,
        name: "Employees",
        path: "/app/employees",
      },
      {
        iconClass: `fi fi-rr-chart-histogram`,
        name: "Reports",
        path: "/app/report",
      },
      {
        iconClass: `fi fi-rr-document`,
        name: "Summary",
        path: "/app/summary",
      },
    ],
  },
];

const employeeSections = [
  {
    title: "dashboard",
    links: [
      {
        iconClass: `fi fi-rr-apps`,
        name: "Home",
        path: "/dashboard",
      },
    ],
  },
];
async function Logout() {
  user.value = undefined;
  location.href = "/login";
}
</script>

<template>
  <aside
    class=" sidebar border-r border-[#e0e0e0] transition-all bg-white fixed px-4 lg:flex xl:flex md:flex flex-col justify-between"
  >
    <div v-if="user.role.title === 'Manager'" class="sections flex-1 mt-[50px]">
      <section
        v-for="(section, index) in sections"
        :key="index"
        class="sidebar-section py-4"
      >
        <ul>
          <li
            v-for="(link, linkIndex) in section.links"
            :key="linkIndex"
            class="relative"
          >
            <HeadlessDisclosure v-slot="{ open }">
              <HeadlessDisclosureButton as="template">
                <nuxt-link
                  :to="link.path"
                  class="flex items-center  py-3 gap-5 transition-all mb-2 rounded-full cursor-pointer w-full menu-link"
                  active-class="active-link-cl"
                  v-tippy="{content: !sidebarOpen?link.name:'',placement: 'right'}" 
                >
                  <div class="svg-container">
                    <i  :class="link.iconClass"></i>
                  </div>

                  <div
                  :class="!sidebarOpen?'hidden':flex "
                    class="flex justify-between items-center flex-1 menu-group text-white !bg-white "
                  >
                    <span
                      class="pathName tracking-wider text-sm font-primaryRegular font-medium capitalize text-[#3D3C3B] whitespace-nowrap"
                      >{{ link.name }}</span
                    >
                  </div>
                </nuxt-link>
              </HeadlessDisclosureButton>
            </HeadlessDisclosure>
          </li>
        </ul>
      </section>
    </div>

 <!--    <div v-else class="sections flex-1 mt-[70px]">
      <section
        v-for="(section, index) in employeeSections"
        :key="index"
        class="sidebar-section py-4"
      >
        <ul>
          <li
            v-for="(link, linkIndex) in section.links"
            :key="linkIndex"
            class="relative"
          >
            <HeadlessDisclosure v-slot="{ open }">
              <HeadlessDisclosureButton as="template">
                <nuxt-link
                  :to="link.path"
                  class="flex items-center px-2 py-3 gap-5 transition-all mb-2 rounded-full cursor-pointer w-full menu-link"
                  active-class="active-link-cl"
                >
                  <div class="svg-container">
                    <i :class="link.iconClass"></i>
                  </div>

                  <div
                    class="flex justify-between items-center flex-1 menu-group text-white z-20"
                    :class="!sidebarOpen?'hidden':flex "
                  >
                    <span
                      class="pathName tracking-wider text-sm font-primaryRegular font-medium capitalize text-[#3D3C3B] whitespace-nowrap"
                      >{{ link.name }}</span
                    >
                  </div>
                </nuxt-link>
              </HeadlessDisclosureButton>
            </HeadlessDisclosure>
          </li>
        </ul>
      </section>
    </div> -->
 </aside>
</template>

<style lang="scss">
.sidebar {
  height: 100vh;
  width: 180px;
  @apply shadow-lg;
  &-section {
    &:not(:last-child) {
      @apply border-b border-zinc-400;
    }
  }
}
</style>

<style scoped lang="scss">
.svg-container {
  @apply ml-1 pl-3;
}
.active-link-cl {
  @apply gap-2;
  .svg-container {
    @apply bg-primary rounded-xl  text-white fill-white px-3 pt-2 pb-[5px] text-base w-[40px];
  }
  .pathName {
    @apply text-[#3D3C3B] font-primary font-semibold text-base gap-5;
  }
}
</style>
