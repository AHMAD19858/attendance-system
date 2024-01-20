<template>
  <nav class="fixed w-[calc(100%)] pe-2 z-20 bg-white">
    <div class="flex h-20 border-b border-[#E6E5E4]">
      <div class="aside-nav bg-white transition-all h-full border-r">
        <!-- logo -->
        <div class="relative flex justify-between px-3 items-center py-2">
          <svg
            @click="toggleSidebar()"
            v-if="sidebarOpen"
            class="w-auto max-w-full cursor-pointer"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="#000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9646 49.1987C14.9646 42.2524 14.9646 35.3681 14.9646 28.3391C15.5321 28.8146 16.0575 29.2281 16.5409 29.6622C18.7266 31.5642 18.7266 31.5642 18.7266 34.4585C18.7266 37.8283 18.7266 41.2187 18.7266 44.5885C18.7266 44.8366 18.7266 45.0847 18.7266 45.3534C18.9368 45.3948 19.0629 45.4154 19.189 45.4154C24.4852 45.4154 29.7814 45.4981 35.0776 45.3534C40.2687 45.2087 44.7663 40.9086 45.1446 36.009C45.586 30.3445 42.0551 25.5896 36.6118 24.5145C35.7501 24.3491 34.8464 24.3078 33.9637 24.2871C30.8532 24.2665 27.7217 24.2871 24.6113 24.2665C23.2662 24.2665 22.4045 23.5842 22.3205 22.5299C22.2364 21.5169 22.8669 20.7106 23.8757 20.5452C24.1909 20.4832 24.5062 20.4832 24.8214 20.4832C28.2892 20.4832 31.7359 20.4212 35.2037 20.5246C42.0762 20.752 48.0239 26.0857 48.9276 32.7219C49.8944 39.7509 45.7751 46.3457 39.0498 48.4131C37.6416 48.8472 36.1284 49.1367 34.6573 49.1367C28.2682 49.2194 21.8581 49.178 15.469 49.178C15.3009 49.2194 15.1748 49.1987 14.9646 49.1987Z"
              fill="#0095FF"
            />
            <path
              d="M42.7696 18.1264C41.8659 18.1264 41.1934 18.1264 40.5208 18.1264C35.2456 18.1264 29.9915 18.1264 24.7163 18.1264C22.2153 18.1264 20.5339 19.4082 20.0926 21.5789C19.5672 24.1217 21.5848 26.5819 24.2119 26.6025C27.5745 26.6232 30.9162 26.6025 34.2789 26.6025C38.8185 26.6025 42.3913 29.7449 42.7066 34.231C43.0428 38.6758 40.1425 42.149 35.75 42.9759C35.5189 43.0173 35.2877 43.0379 35.0565 43.0379C30.6009 43.0379 26.1454 43.0379 21.6899 43.0379C21.5217 43.0379 21.3326 43.0173 21.1224 43.0173C21.1224 41.7148 21.1224 40.4538 21.1224 39.11C21.4377 39.11 21.7529 39.11 22.0682 39.11C26.0193 39.11 29.9915 39.11 33.9426 39.11C36.4226 39.11 38.0829 37.9316 38.6083 35.8849C39.2388 33.4248 37.4944 30.8199 34.9304 30.6959C32.0511 30.5512 29.1718 30.6545 26.2925 30.5925C25.0315 30.5718 23.7495 30.6132 22.5305 30.3651C18.6634 29.6002 15.9523 26.2304 15.9313 22.3851C15.9103 18.6639 18.6214 15.2528 22.3414 14.3845C22.9929 14.2398 23.6864 14.1571 24.359 14.1571C29.0667 14.1157 33.7955 14.1157 38.5032 14.1364C38.8395 14.1364 39.3019 14.1984 39.512 14.4258C40.5839 15.5629 41.6137 16.7619 42.7696 18.1264Z"
              fill="#0095FF"
            />
          </svg>

          <svg
            v-else
            @click="toggleSidebar()"
            class="w-auto max-w-full cursor-pointer"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="#000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9646 49.1987C14.9646 42.2524 14.9646 35.3681 14.9646 28.3391C15.5321 28.8146 16.0575 29.2281 16.5409 29.6622C18.7266 31.5642 18.7266 31.5642 18.7266 34.4585C18.7266 37.8283 18.7266 41.2187 18.7266 44.5885C18.7266 44.8366 18.7266 45.0847 18.7266 45.3534C18.9368 45.3948 19.0629 45.4154 19.189 45.4154C24.4852 45.4154 29.7814 45.4981 35.0776 45.3534C40.2687 45.2087 44.7663 40.9086 45.1446 36.009C45.586 30.3445 42.0551 25.5896 36.6118 24.5145C35.7501 24.3491 34.8464 24.3078 33.9637 24.2871C30.8532 24.2665 27.7217 24.2871 24.6113 24.2665C23.2662 24.2665 22.4045 23.5842 22.3205 22.5299C22.2364 21.5169 22.8669 20.7106 23.8757 20.5452C24.1909 20.4832 24.5062 20.4832 24.8214 20.4832C28.2892 20.4832 31.7359 20.4212 35.2037 20.5246C42.0762 20.752 48.0239 26.0857 48.9276 32.7219C49.8944 39.7509 45.7751 46.3457 39.0498 48.4131C37.6416 48.8472 36.1284 49.1367 34.6573 49.1367C28.2682 49.2194 21.8581 49.178 15.469 49.178C15.3009 49.2194 15.1748 49.1987 14.9646 49.1987Z"
              fill="#0095FF"
            />
            <path
              d="M42.7696 18.1264C41.8659 18.1264 41.1934 18.1264 40.5208 18.1264C35.2456 18.1264 29.9915 18.1264 24.7163 18.1264C22.2153 18.1264 20.5339 19.4082 20.0926 21.5789C19.5672 24.1217 21.5848 26.5819 24.2119 26.6025C27.5745 26.6232 30.9162 26.6025 34.2789 26.6025C38.8185 26.6025 42.3913 29.7449 42.7066 34.231C43.0428 38.6758 40.1425 42.149 35.75 42.9759C35.5189 43.0173 35.2877 43.0379 35.0565 43.0379C30.6009 43.0379 26.1454 43.0379 21.6899 43.0379C21.5217 43.0379 21.3326 43.0173 21.1224 43.0173C21.1224 41.7148 21.1224 40.4538 21.1224 39.11C21.4377 39.11 21.7529 39.11 22.0682 39.11C26.0193 39.11 29.9915 39.11 33.9426 39.11C36.4226 39.11 38.0829 37.9316 38.6083 35.8849C39.2388 33.4248 37.4944 30.8199 34.9304 30.6959C32.0511 30.5512 29.1718 30.6545 26.2925 30.5925C25.0315 30.5718 23.7495 30.6132 22.5305 30.3651C18.6634 29.6002 15.9523 26.2304 15.9313 22.3851C15.9103 18.6639 18.6214 15.2528 22.3414 14.3845C22.9929 14.2398 23.6864 14.1571 24.359 14.1571C29.0667 14.1157 33.7955 14.1157 38.5032 14.1364C38.8395 14.1364 39.3019 14.1984 39.512 14.4258C40.5839 15.5629 41.6137 16.7619 42.7696 18.1264Z"
              fill="#0095FF"
            />
          </svg>
          <!--   <svg
             v-if="sidebarOpen"
             @click="toggleSidebar()"
             class="cursor-pointer"
             width="28"
             height="28"
             viewBox="0 0 28 28"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
           >
             <rect x="2" y="2" width="12" height="24" fill="#3CA60F" />
             <rect x="14" y="2" width="12" height="24" fill="white" />
             <rect
               x="1"
               y="1"
               width="26"
               height="26"
               stroke="#171106"
               stroke-width="2"
             />
           </svg> -->
        </div>
      </div>

      <div class="flex items-center justify-between flex-1 ps-6 h-full">
        <div class="breadcrumb">
          <ul class="text-sm">
            <i
              class="fi fi-rr-bars-sort text-xl cursor-pointer"
              @click="toggleSidebar()"
            ></i>
          </ul>
        </div>

    <!--     <div class="inline-flex items-center px-6" v-if="user">
          <slot />
          <NuxtLink>
            <img
              :src="user.image"
              class="lg:hidden md:hidden w-[30px] object-cover aspect-square rounded-full"
              alt=""
            />
          </NuxtLink>
        </div> -->
      </div>
      <HeadlessMenu
        as="div"
        class=" relative lg:inline-block text-left dropdown mx-2"
      >
        <HeadlessMenuButton
          type="button"
          class="flex items-center gap-1.5 xl:gap-2 mt-5"
        >
          <!--  <NuxtLink :to="'/dashboard/profile/' + user.id"> -->
          <img :src="user?.image" alt="" class="w-8 h-8 rounded-full" />
          <!--  </NuxtLink> -->
          <div>
            <p class="text-[#4C4C4C] hidden lg:block font-medium font-primary text-base">
              {{ user?.first_name }} {{ user?.last_name }}
            </p>
            <p class="font-primary font-light hidden lg:block text-[13px] text-[#6E7A84]">
              {{ user?.job_title }}
            </p>
          </div>
          <i class="fi fi-rr-angle-small-down"></i>
        </HeadlessMenuButton>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <HeadlessMenuItems
            as="ul"
            class="absolute right-0 mt-6 w-48 rounded-md bg-white dark:bg-[#282828] shadow-2xl shadow-zinc-300 ring-1 ring-black/5 dark:shadow-zinc-800 focus:outline-none dark:border dark:border-[#ffffff1a]"
          >
            <li class="dropdown-item !py-3 !pt-4">
              <div class="flex items-start">
                <div class="flex-none px-2">
                  <img :src="user?.image" alt="" class="w-7 h-7 rounded-full" />
                </div>
                <div class="pl-2">
                  <h4
                    class="text-sm text-black dark:text-white font-medium leading-none"
                  >
                    {{ user?.first_name }}
                  </h4>

                  <a
                    class="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white text-xs whitespace-nowrap text-ellipsis w-full overflow-hidden max-w-[140px] block"
                    :href="`mailto:${user?.job_title}`"
                    >{{ user?.job_title }}</a
                  >
                </div>
              </div>
            </li>
            <li class="h-px bg-black/5 block my-1"></li>
            <li class="flex items-center gap-1 justify-between px-2 border-b">
              <NuxtLink
                class="flex w-full p-2 i tems-center gap-2 transition-colors rounded-md"
                to="/app/profile"
              >
                <i class="fi fi-rr-user !text-sm pt-1"></i>
                <span> Profile </span>
              </NuxtLink>
            </li>
            <li class="flex items-center gap-1 justify-between px-2">
              <a
                @click="logOut"
                href="javaScript:;"
                class="text-danger flex w-full p-2 i tems-center gap-2 transition-colors rounded-md"
              >
                <i class="fi fi-rr-sign-out-alt !text-sm pt-1"></i>
                <span> Log Out </span>
              </a>
            </li>
          </HeadlessMenuItems>
        </transition>
      </HeadlessMenu>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from "~/stores/auth";
import { useSettingsStore } from "~/stores/settings";
const { user } = storeToRefs(useUserStore());
const { sidebarOpen } = storeToRefs(useSettingsStore());
const { toggleSidebar, closeSidebar } = useSettingsStore();
const { signOut } = useUserStore();
async function logOut() {
  signOut();
}
</script>
<style lang="scss">
.aside-nav {
  width: 180px;
}
</style>
