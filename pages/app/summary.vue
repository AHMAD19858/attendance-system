<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
import { useUserStore } from "~/stores/auth";
import moment from "moment/moment";
import { subDays } from "date-fns";
let baseURL = useRuntimeConfig().public.apiBase;
const { user, token } = useUserStore();
const sheetsLoading = ref(false);
const sheetAttendance = ref([]);
const todayDate = ref("");
const today = new Date();
const year = today.getFullYear();
let month = today.getMonth() + 1; // Months are zero-based, so add 1
let day = today.getDate();
month = month < 10 ? `0${month}` : month;
day = day < 10 ? `0${day}` : day;

const formattedDate = `${year}-${month}-${day}`;
todayDate.value = formattedDate;
const pagination = reactive({
  currentPage: 1,
  total: "",
  lastPage: 1,
  perPage: "",
});
var filterAttendance = reactive({
  per_page: "10",
  date_from: "",
  date_to: "",
  date: todayDate.value,
});
const headers = reactive([
  { text: "Name" },
  { text: "Date" },
  { text: "Check in" },
  { text: "Check out" },
  { text: "Break" },
  { text: "Total hours" },
  { text: "Location" },
]);
async function listTimeSheetAttendance(body) {
  sheetsLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  for (let key in body) {
    formData.append(key, body[key]);
  }
  const res = await fetch(baseURL + "attendances/list-sheets", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const attendanceData = await res.json();
  if (res.ok) {
    sheetsLoading.value = false;
    sheetAttendance.value = attendanceData.data.attendance_days.data;
    pagination.currentPage = attendanceData.data.attendance_days.current_page;
    pagination.lastPage = attendanceData.data.attendance_days.last_page;
    pagination.perPage = attendanceData.data.attendance_days.per_page;
    pagination.total = attendanceData.data.attendance_days.total;

    return res;
  } else {
    sheetsLoading.value = false;
    throw {
      status: res.ok,
      code: res.status,
      message: attendanceData.msg,
    };
  }
}
listTimeSheetAttendance(filterAttendance);
const date = ref();
const presetDates = ref([
  { label: "Today", value: new Date() },
  {
    label: "Yesterday",
    value: subDays(new Date(), 1),
  },
]);
const formatedDate = ref("");
function filterViaDate() {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDate(date.value);

  formatedDate.value = formatDate(date.value);
  filterAttendance.date = formattedDate;
  listTimeSheetAttendance(filterAttendance);
}
function clearValue(v) {
  date.value = null;
}

function ClearFilter() {
  listTimeSheetAttendance({
    per_page: "10",
    date_from: "",
    date_to: "",
    date: todayDate.value,
  });
}
</script>
<template>
  <AppLoader class="py-24 " v-if="sheetsLoading" />
  <!-- body -->
  <div class="py-12 bg-white" v-else>
    <div
      class="lg:flex justify-between items-baseline w-full block md:flex px-8"
    >
      <div class="lg:flex md:flex flex gap-[10px] items-start w-full md:w-1/2">
        <!-- search -->
        <div>
          <vue-date-picker
            v-model="date"
            :preset-dates="presetDates"
            placeholder="Time period:"
            :enable-time-picker="false"
            ignore-time-validation
            auto-apply
            required
            :month-change-on-scroll="false"
            @closed="filterViaDate"
            @cleared="ClearFilter"
          >
            <template #preset-date-range-button="{ label, value, presetDate }">
              <span
                class="text-primary"
                role="button"
                :tabindex="0"
                @click="clearValue(value)"
                @keyup.enter.prevent="clearValue(value)"
                @keyup.space.prevent="clearValue(value)"
              >
                {{ label }}
              </span>
            </template>
          </vue-date-picker>
        </div>
      </div>
    </div>

    <!-- table -->
    <div
      class="my-10 overflow-scroll h-screen lg:h-auto lg:overflow-hidden mx-5 "
    >
      <!-- header -->
      <div
        :class="`grid-cols-${headers?.length}`"
        class="lg:grid  hidden gap-4 border-b py-2 border-t px-4"
      >
        <div
          v-for="(item, index) in headers"
          :key="index"
          class="font-primary font-normal text-sm text-[#9D9B97]"
        >
          {{ item.text }}
        </div>
      </div>

      <div
        v-for="(item, index) in sheetAttendance"
        v-if="sheetAttendance.length > 0"
        :key="index"
        :class="`grid-cols-${headers.length} grid-rows-${sheetAttendance.length}`"
        class="lg:grid items-center gap-4 px-4 ml-3 lg:ml-0 border lg:border-t-0 lg:border-r-0 lg:border-l-0 border-b my-4 lg:my-0 font-primary font-normal text-sm py-2 text-[#9D9B97]"
      >
        <div class="flex items-center gap-2 w-full">
          <div>
            <img :src="item.user.image" alt="" class="w-10 h-10 rounded-full" />
          </div>
          <NuxtLink>
            <div class="block">
              <p class="text-[#171106] text-sm font-primary">
                {{ item.user.first_name }} {{ item.user.last_name }}
              </p>
              <p class="text-[#6E7A84] text-sm font-primaryRegular">
                {{ item.user.job_title }}
              </p>
            </div>
          </NuxtLink>
        </div>
        <!-- mobile view  -->
        <hr class="lg:hidden mt-2" />
        <div class="flex items-center justify-between lg:hidden py-4 w-full">
          <div class="w-1/2">
            <p class="text-[11px]">title</p>
            <div class="py-2 text-[#171106] font-primary text-sm">
              {{ item.user.job_title }}
            </div>
          </div>

          <div class="w-1/2">
            <p class="text-[11px]">Check in</p>
            <div class="py-2 text-[#171106] font-primary text-sm">
              {{ moment(item.clock_in.replace(/-/g, "/")).format("LT") }}
            </div>
          </div>
        </div>

        <!-- mobile view  -->
        <div class="flex items-center justify-between lg:hidden py-2 w-full">
          <div class="w-1/2">
            <p class="text-[11px]">Check out</p>
            <p
              class="text-[#171106] font-primary text-sm"
              v-if="item.clock_out !== null"
            >
              {{ moment(item.clock_out.replace(/-/g, "/")).format("LT") }}
            </p>
            <p v-else class="py-2 text-[#171106] font-primary text-sm">
              Not Clockout
            </p>
          </div>

          <div class="w-1/2">
            <p class="text-[11px]">Total hour</p>
            <div class="py-2 text-[#171106] font-primary text-sm">
              {{
                item.total_hours === "0.00" ? "-" : item.total_hours + " Hours"
              }}
            </div>
          </div>
        </div>

        <!-- mobile view -->
        <div class="flex items-center justify-between lg:hidden py-2">
          <div>
            <p class="text-[11px] text-[#E6E5E4] font-light">
              Check in location
            </p>
            <p class="py-2 text-[#171106] font-primary text-sm">
              {{ item.location == "null" ? "- " : item.location }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between lg:hidden py-2">
          <div>
            <p class="text-[11px] text-[#E6E5E4] font-light">
              Check out location
            </p>
            <p class="py-2 text-[#171106] font-primary text-sm">
              {{
                item.location_out == null
                  ? "Not Clock out yet!! "
                  : item.location_out
              }}
            </p>
          </div>
        </div>
        <!-- web view -->
        <div class="hidden lg:flex">
          <p
            class="text-[#171106] font-primary text-sm whitespace-pre flex flex-col gap-y-1 justify-center item-center"
          >
            {{ moment(item.clock_in).format("MMM Do YYYY") }}
          </p>
        </div>
        <div class="hidden lg:flex">
          <p
            class="text-[#171106] font-primary text-sm whitespace-pre flex flex-col gap-y-1 justify-center item-center"
          >
            <span
              class="text-xs"
              :class="[
                item.attendance_status == 'Delayed' && 'text-[#E14A25]',
                item.attendance_status == 'Regular' && 'text-[#6851C7]',
                item.attendance_status == 'Early' && 'text-[#30850C]',
              ]"
              >{{ item.attendance_status }}</span
            >
            <span>
              {{ moment(item.clock_in.replace(/-/g, "/")).format("LT") }}
            </span>
          </p>
        </div>
        <div class="hidden lg:flex">
          <p
            class="text-[#171106] font-primary text-sm"
            v-if="item.clock_out !== null"
          >
            {{ moment(item.clock_out.replace(/-/g, "/")).format("LT") }}
          </p>
          <p v-else class="flex items-center gap-1 text-danger">
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.67993 0C3.36622 0 0.679932 2.68629 0.679932 6C0.679932 9.31371 3.36622 12 6.67993 12C9.99364 12 12.6799 9.31371 12.6799 6C12.6763 2.68777 9.99217 0.00358594 6.67993 0ZM6.67993 10.5C4.19464 10.5 2.17993 8.48529 2.17993 6C2.17993 3.51471 4.19464 1.5 6.67993 1.5C9.16522 1.5 11.1799 3.51471 11.1799 6C11.1772 8.48414 9.16407 10.4972 6.67993 10.5Z"
                fill="#E14A25"
              />
              <path
                d="M6.67993 7.54554C7.09414 7.54554 7.42993 7.20975 7.42993 6.79554V3.29555C7.42993 2.88134 7.09414 2.54555 6.67993 2.54555C6.26572 2.54555 5.92993 2.88134 5.92993 3.29555V6.79554C5.92993 7.20975 6.26572 7.54554 6.67993 7.54554Z"
                fill="#E14A25"
              />
              <path
                d="M6.6825 9.49999C7.09671 9.49999 7.4325 9.16421 7.4325 8.74999C7.4325 8.33578 7.09671 7.99999 6.6825 7.99999C6.26828 7.99999 5.9325 8.33578 5.9325 8.74999C5.9325 9.16421 6.26828 9.49999 6.6825 9.49999Z"
                fill="#E14A25"
              />
            </svg>
            Not Clockout
          </p>
        </div>

        <div class="hidden lg:block">
          <div
            class="flex items-center gap-1 py-1 border-b w-3/4"
            v-if="item.breaks.length > 0"
            v-for="(section, index) in item.breaks"
          >
            <svg
              width="13"
              height="15"
              viewBox="0 0 13 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.61 0C11.4111 0 11.2203 0.0790176 11.0797 0.21967C10.939 0.360322 10.86 0.551088 10.86 0.75V4.845L10.11 5.3475V0.75C10.11 0.551088 10.031 0.360322 9.89032 0.21967C9.74966 0.0790176 9.5589 0 9.35999 0C9.16107 0 8.97031 0.0790176 8.82966 0.21967C8.689 0.360322 8.60999 0.551088 8.60999 0.75V5.3475L7.85999 4.845V0.75C7.85999 0.551088 7.78097 0.360322 7.64032 0.21967C7.49966 0.0790176 7.3089 0 7.10999 0C6.91107 0 6.72031 0.0790176 6.57966 0.21967C6.439 0.360322 6.35999 0.551088 6.35999 0.75V5.25C6.36062 5.37353 6.39177 5.49499 6.45064 5.60359C6.50952 5.71219 6.59431 5.80456 6.69748 5.8725L8.60999 7.155V14.25C8.60999 14.4489 8.689 14.6397 8.82966 14.7803C8.97031 14.921 9.16107 15 9.35999 15C9.5589 15 9.74966 14.921 9.89032 14.7803C10.031 14.6397 10.11 14.4489 10.11 14.25V7.155L12.0225 5.8725C12.1257 5.80456 12.2104 5.71219 12.2693 5.60359C12.3282 5.49499 12.3593 5.37353 12.36 5.25V0.75C12.36 0.551088 12.281 0.360322 12.1403 0.21967C11.9997 0.0790176 11.8089 0 11.61 0ZM4.10999 0C3.11542 0 2.1616 0.395088 1.45833 1.09835C0.755073 1.80161 0.359985 2.75544 0.359985 3.75V8.25C0.359985 8.44891 0.439003 8.63968 0.579655 8.78033C0.720308 8.92098 0.911073 9 1.10999 9H3.35999V14.25C3.35999 14.4489 3.439 14.6397 3.57966 14.7803C3.72031 14.921 3.91107 15 4.10999 15C4.3089 15 4.49966 14.921 4.64032 14.7803C4.78097 14.6397 4.85999 14.4489 4.85999 14.25V0.75C4.85999 0.551088 4.78097 0.360322 4.64032 0.21967C4.49966 0.0790176 4.3089 0 4.10999 0ZM3.35999 7.5H1.85999V3.75C1.85974 3.28451 2.00388 2.8304 2.27253 2.45026C2.54118 2.07012 2.92112 1.78266 3.35999 1.6275V7.5Z"
                fill="#0095FF"
              />
            </svg>
            <div>
              <p class="text-[#171106] text-[13px] font-normal">
                {{ section.total_hours }} hrs
              </p>
              <p class="text-left text-[11px]">
                {{ section.clock_in }} - {{ section.clock_out }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1" v-if="item.breaks.length === 0">
            <div>
              <p class="text-[#171106] text-[13px] font-normal">
                No breaks added
              </p>
            </div>
          </div>
        </div>

        <div class="hidden lg:flex">
          <p class="text-[#171106] font-primary text-sm pl-2">
            {{
              item.total_hours === "0.00" ? "-" : item.total_hours + " Hours"
            }}
          </p>
        </div>
        <div class="hidden lg:flex">
          <div class="hover-text">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="cursor-pointer"
            >
              <g clip-path="url(#clip0_875_11057)">
                <path
                  d="M12 0C9.21628 0.00344012 6.54756 1.11079 4.57918 3.07918C2.61079 5.04756 1.50344 7.71628 1.5 10.5C1.5 13.326 3.7 17.266 8.041 22.209C8.53604 22.7715 9.14526 23.2222 9.82808 23.5308C10.5109 23.8395 11.2517 23.9992 12.001 23.9992C12.7503 23.9992 13.4911 23.8395 14.1739 23.5308C14.8567 23.2222 15.466 22.7715 15.961 22.209C20.3 17.267 22.5 13.327 22.5 10.5C22.4966 7.71628 21.3892 5.04756 19.4208 3.07918C17.4524 1.11079 14.7837 0.00344012 12 0V0ZM13.706 20.231C13.4879 20.4654 13.2239 20.6524 12.9304 20.7802C12.6369 20.9081 12.3202 20.974 12 20.974C11.6798 20.974 11.3631 20.9081 11.0696 20.7802C10.7761 20.6524 10.5121 20.4654 10.294 20.231C6.611 16.036 4.494 12.489 4.494 10.501C4.494 8.51188 5.28418 6.60422 6.6907 5.1977C8.09722 3.79118 10.0049 3.001 11.994 3.001C13.9831 3.001 15.8908 3.79118 17.2973 5.1977C18.7038 6.60422 19.494 8.51188 19.494 10.501C19.5 12.489 17.389 16.036 13.706 20.231Z"
                  fill="#AEACA8"
                />
                <path
                  d="M12 6.05545C11.1371 6.05545 10.2936 6.31134 9.57607 6.79075C8.85858 7.27016 8.29936 7.95157 7.96914 8.7488C7.63891 9.54604 7.55251 10.4233 7.72086 11.2696C7.88921 12.116 8.30474 12.8934 8.91492 13.5036C9.5251 14.1137 10.3025 14.5293 11.1488 14.6976C11.9952 14.866 12.8724 14.7796 13.6697 14.4493C14.4669 14.1191 15.1483 13.5599 15.6277 12.8424C16.1071 12.1249 16.363 11.2814 16.363 10.4185C16.3617 9.26172 15.9016 8.15274 15.0837 7.33481C14.2657 6.51687 13.1568 6.05677 12 6.05545ZM12 11.7815C11.7304 11.7815 11.4669 11.7015 11.2428 11.5517C11.0186 11.402 10.8439 11.1891 10.7408 10.94C10.6376 10.691 10.6106 10.4169 10.6632 10.1525C10.7158 9.88815 10.8456 9.64528 11.0362 9.45466C11.2269 9.26404 11.4697 9.13423 11.7341 9.08164C11.9985 9.02905 12.2726 9.05604 12.5216 9.1592C12.7707 9.26237 12.9836 9.43706 13.1333 9.66121C13.2831 9.88535 13.363 10.1489 13.363 10.4185C13.3628 10.7799 13.2191 11.1264 12.9635 11.3819C12.708 11.6375 12.3614 11.7812 12 11.7815Z"
                  fill="#AEACA8"
                />
              </g>
              <defs>
                <clipPath id="clip0_875_11057">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span class="tooltip-text" id="bottom">
              <div class="border border-primary w-8 rounded-full my-1"></div>
              <p
                class="text-left font-primary font-light text-[#6E7A84] text-[13px]"
              >
                Check in Location
              </p>
              <div>
                <p
                  class="text-left font-medium font-primary text-base text-white"
                >
                  {{ item.location == "null" ? "-" : item.location }}
                </p>
              </div>

              <div
                class="border border-primary w-8 rounded-full mt-6 mb-1"
              ></div>
              <p
                class="text-left font-primary font-light text-[#6E7A84] text-[13px]"
              >
                Check out Location
              </p>
              <div>
                <p
                  class="text-left font-medium font-primary text-base text-white"
                  v-if="item.location_out == 'null'"
                >
                  -
                </p>
                <p
                  v-else
                  class="text-left font-medium font-primary text-base text-white"
                >
                  {{
                    item.location_out == null
                      ? "Not Clock out yet!! "
                      : item.location_out
                  }}
                </p>
              </div>
            </span>
          </div>
        </div>
      </div>
      <!-- pagination -->
      <div class="lg:flex md:flex gap-8 items-center justify-end flex">
        <div class="lg:flex md:flex block items-baseline gap-4 w-full px-4">
          <p
            class="text-center hidden lg:block py-2 mt-3 text-[#93A3B0] text-sm font-normal font-primary"
          >
            Show rows per page
          </p>

          <p
            class="text-center lg:hidden py-2 mt-3 text-[#93A3B0] text-sm font-normal font-primary"
          >
            rows per page
          </p>
          <div class="select-number">
            <select
              v-model="filterAttendance.per_page"
              @change="listTimeSheetAttendance(filterAttendance)"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
        </div>
{{ date }}
        <p class="whitespace-nowrap text-center font-primary">
          Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
        </p>
        <ol
          class="lg:flex md:flex justify-center text-xs font-medium my-6 flex"
          v-if="pagination.lastPage > 1"
        >
          <li>
            <a
              :class="{
                ' bg-transparent !text-gray-400  ': pagination.currentPage == 1,
              }"
              href="#"
              class="inline-flex h-10 w-10 text-base hover:bg-slate-200 items-center justify-center rounded-lg bg-transparent text-black rtl:rotate-180"
              @click="
                pagination.currentPage == 1
                  ? null
                  : listTimeSheetAttendance({
                      page: pagination.currentPage - 1,
                      per_page: filterAttendance.per_page,
                      date: formatedDate?formatedDate:date,
                    })
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </li>

          <li>
            <a
              :class="{
                ' !bg-primary-color/30 !text-gray-400':
                  pagination.currentPage == pagination.lastPage,
              }"
              @click="
                pagination.currentPage == pagination.lastPage
                  ? null
                  : listTimeSheetAttendance({
                      page: pagination.currentPage + 1,
                      per_page: filterAttendance.per_page,
                      date: formatedDate?formatedDate:date,
                    })
              "
              href="#"
              class="inline-flex h-10 w-10 hover:bg-slate-200 text-base items-center justify-center rounded-lg bg-transparent text-gray-900 rtl:rotate-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltip-text {
  visibility: hidden;
  position: absolute;
  z-index: 2;
  width: 265px;
  color: white;
  font-size: 12px;
  background-color: #3d3c3b;
  border-radius: 4px;
  padding: 10px 15px 10px 15px;
}

.tooltip-text::before {
  content: "";
  position: absolute;
  transform: rotate(45deg);
  background-color: #3d3c3b;
  padding: 5px;
  z-index: 1;
}

.hover-text:hover .tooltip-text {
  visibility: visible;
  margin-top: 5px;
}

#bottom {
  top: 25px;
  left: -400%;
}

#bottom::before {
  top: -2%;
  left: 39%;
}

.hover-text {
  position: relative;
  display: inline-block;
  font-family: Arial;
  text-align: center;
}
</style>
