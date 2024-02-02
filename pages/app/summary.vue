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
const perPageList = ref([5, 10, 15, 20, 30, 50]);
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
  <p class="pt-4 px-11 text-2xl">Summary</p>
  <!-- body -->
  <div
    class="pt-4 bg-white"
    :class="
      sheetAttendance.length > 0 ? '' : ' overflow-x-auto lg:overflow-x-clip'
    "
  >
    <div
      class="lg:flex justify-between items-baseline w-full block md:flex px-11"
    >
      <div
        class="flex-col md:flex-row lg:flex-row justify-between items-baseline w-full block md:flex"
      >
        <!-- search -->
        <div class="w-full lg:w-[20%]">
          <vue-date-picker
            v-model="date"
            :preset-dates="presetDates"
            placeholder="Time period"
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
    <AppLoader class="py-24" v-if="sheetsLoading" />
    <!-- table -->
    <div
      v-else
      class="my-4 overflow-scroll !h-screen lg:h-auto lg:overflow-hidden mx-5"
    >
      <!-- header -->
      <div
        :class="`grid-cols-${headers?.length}`"
        class="lg:grid hidden gap-4 border-b py-2 border-t px-4"
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
        class="lg:grid items-center gap-2 px-1 ml-3 lg:ml-0 border lg:border-t-0 lg:border-r-0 lg:border-l-0 border-b my-4 lg:my-0 font-primary font-normal text-sm py-2 text-[#9D9B97]"
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
            <i class="fi fi-rr-info pt-1 !text-xs"></i>
            Not Clockout
          </p>
        </div>

        <div class="hidden lg:block">
          <div
            class="flex items-center gap-1 py-1 w-3/4"
            :class="item?.breaks?.length > 1 ? 'border-b' : ''"
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
            <i
              class="fi fi-rr-marker cursor-pointer text-2xl hover:text-primary"
            ></i>
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

              <div class="dd">
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
              </div>
            </span>
          </div>
        </div>
      </div>

      <div v-if="sheetAttendance.length === 0 && !sheetsLoading">
        <div class="flex py-8 justify-center">
          <img src="~/assets/images/envelop.svg" class="object-contain" />
        </div>

        <div>
          <p class="text-center text-xl font-primary text-black">
            No result found
          </p>
          <p class="text-center font-primary text-base text-black">
            No logs available
          </p>
        </div>
      </div>
      <!-- pagination -->
      <div
        v-if="sheetAttendance.length > 0 && !sheetsLoading"
        class="lg:flex md:flex gap-8 items-center justify-end flex"
      >
        <div class="lg:flex md:flex block items-baseline gap-4 w-full px-4">
          <p
            class="text-center hidden lg:block py-2 mt-3 text-[#93A3B0] text-sm font-normal font-primary"
          >
            Show rows per page
          </p>
          <div class="select-number">
            <select
              class="text-dark dark:text-light px-3.5 py-2.5 rounded-md text-sm md:text-base outline-none w-[60px]"
              v-model="filterAttendance.per_page"
              @change="listTimeSheetAttendance(filterAttendance)"
            >
              <option
                v-for="item in perPageList"
                :key="item"
                :value="item"
                class="text-sm !p-0"
              >
                <span
                  >{{ Number(item) }}
                  <i class="fi fi-rr-angle-small-down !text-red-500"></i
                ></span>
              </option>
            </select>
          </div>
        </div>
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
                      date: formatedDate ? formatedDate : date,
                    })
              "
            >
              <i class="fi fi-rr-angle-left !text-xs"></i>
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
                      date: formatedDate ? formatedDate : date,
                    })
              "
              href="#"
              class="inline-flex h-10 w-10 hover:bg-slate-200 text-base items-center justify-center rounded-lg bg-transparent text-gray-900 rtl:rotate-180"
            >
              <i class="fi fi-rr-angle-right !text-xs"></i>
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
  z-index: 9999;
  width: 265px;
  color: white;
  font-size: 12px;
  background-color: #3d3c3b;
  border-radius: 8px;
  padding: 10px 15px 45px 15px;
  height: 170px;
  overflow: auto;
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
