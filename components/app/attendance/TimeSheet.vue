<script setup>
import moment from "moment/moment";
const emit = defineEmits([
  "paginate",
  "confirm",
  "reject",
  "showclockinDetails",
  "timeoffDetails",
]);
defineProps({
  headers: Array,
  data: Array,
  loading: Boolean,
  pagination: Object,
  filterData: Object,
  perPageList: Array,
});
</script>
<template>
   <div class="bg-white">
        <!-- header -->
        <div
          :class="`grid-cols-${headers?.length}`"
          class="lg:grid grid-cols-7 hidden gap-8 border-b py-2 border-t px-4"
        >
          <div
            v-for="(item, index) in headers"
            :key="index"
            class="font-primary font-normal text-sm text-[#9D9B97]"
          >
            {{ item.text }}
          </div>
        </div>
        <AppLoader v-if="loading" />
        <!-- table -->
        <div
          v-if="data.length > 0 && !loading"
          v-for="(item, index) in data"
          :key="index"
          :class="
            item.key !== 'leave'
              ? `grid-cols-${headers.length} grid-rows-${data.length} px-2`
              : `grid-cols-8 lg:grid-cols-6 grid-rows-7 bg-[#F7F7F6]  py-0 border-l-primary border-l-4 lg:py-0`
          "
          class="lg:grid items-center gap-10 ml-3 lg:ml-0 border lg:border-t-0 lg:border-r-0 lg:border-l-0 border-b my-4 lg:my-0 font-primary font-normal text-sm py-2 text-[#9D9B97]"
        
          >
          <div
            class="flex items-center gap-2 w-full px-2 lg:px-0 py-4"
            v-if="item.key !== 'leave'"
          >
            <div class="border rounded-[20px] px-1 border-[#171106]">
              <p
                class="text-[#171106] text-xs font-normal font-primary mx-[2px]"
              >
                {{ moment(item.clock_in.replace(/-/g, "/")).format("dddd").slice(0, 3) }}
              </p>
            </div>

            <div class="block">
              <p class="text-[#171106] text-[13px]  font-primary">
                {{ moment(item.clock_in.replace(/-/g, "/")).format("MMM Do YYYY") }}
              </p>
            </div>

            <svg
            @click="emit('clockinDetails',item)"
              class="ml-5 lg:hidden"
              width="16"
              height="16"
              viewBox="0 0 16 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 12.5H5C4.73478 12.5 4.48043 12.6054 4.29289 12.7929C4.10536 12.9804 4 13.2348 4 13.5C4 13.7652 4.10536 14.0196 4.29289 14.2071C4.48043 14.3946 4.73478 14.5 5 14.5H11C11.2652 14.5 11.5196 14.3946 11.7071 14.2071C11.8946 14.0196 12 13.7652 12 13.5C12 13.2348 11.8946 12.9804 11.7071 12.7929C11.5196 12.6054 11.2652 12.5 11 12.5ZM11 8.5H7C6.73478 8.5 6.48043 8.60536 6.29289 8.79289C6.10536 8.98043 6 9.23478 6 9.5C6 9.76522 6.10536 10.0196 6.29289 10.2071C6.48043 10.3946 6.73478 10.5 7 10.5H11C11.2652 10.5 11.5196 10.3946 11.7071 10.2071C11.8946 10.0196 12 9.76522 12 9.5C12 9.23478 11.8946 8.98043 11.7071 8.79289C11.5196 8.60536 11.2652 8.5 11 8.5ZM13 2.5H11.82C11.6137 1.91645 11.2319 1.411 10.7271 1.05294C10.2222 0.694879 9.61894 0.50174 9 0.5H7C6.38106 0.50174 5.7778 0.694879 5.27293 1.05294C4.76807 1.411 4.38631 1.91645 4.18 2.5H3C2.20435 2.5 1.44129 2.81607 0.87868 3.37868C0.316071 3.94129 0 4.70435 0 5.5V17.5C0 18.2956 0.316071 19.0587 0.87868 19.6213C1.44129 20.1839 2.20435 20.5 3 20.5H13C13.7956 20.5 14.5587 20.1839 15.1213 19.6213C15.6839 19.0587 16 18.2956 16 17.5V5.5C16 4.70435 15.6839 3.94129 15.1213 3.37868C14.5587 2.81607 13.7956 2.5 13 2.5ZM6 3.5C6 3.23478 6.10536 2.98043 6.29289 2.79289C6.48043 2.60536 6.73478 2.5 7 2.5H9C9.26522 2.5 9.51957 2.60536 9.70711 2.79289C9.89464 2.98043 10 3.23478 10 3.5V4.5H6V3.5ZM14 17.5C14 17.7652 13.8946 18.0196 13.7071 18.2071C13.5196 18.3946 13.2652 18.5 13 18.5H3C2.73478 18.5 2.48043 18.3946 2.29289 18.2071C2.10536 18.0196 2 17.7652 2 17.5V5.5C2 5.23478 2.10536 4.98043 2.29289 4.79289C2.48043 4.60536 2.73478 4.5 3 4.5H4V5.5C4 5.76522 4.10536 6.01957 4.29289 6.20711C4.48043 6.39464 4.73478 6.5 5 6.5H11C11.2652 6.5 11.5196 6.39464 11.7071 6.20711C11.8946 6.01957 12 5.76522 12 5.5V4.5H13C13.2652 4.5 13.5196 4.60536 13.7071 4.79289C13.8946 4.98043 14 5.23478 14 5.5V17.5Z"
                fill="#AEACA8"
              />
            </svg>
          </div>

          <!-- mobile view -->
          <hr class="lg:hidden mt-2" />
          <div
            class="flex items-center justify-between lg:hidden py-4 w-full px-4"
            v-if="item.key !== 'leave'"
          >
            <div class="w-1/2">
              <p class="text-[11px]">Clock in</p>
              <div class="py-2 text-[#171106] font-primary font-medium text-sm">
                
                {{ moment(item.clock_in.replace(/-/g, "/")).format("LT") }}
              </div>
            </div>

            <div class="w-1/2">
              <p class="text-[11px]">Clock out</p>
              <div class="py-2 text-[#171106] font-primary font-medium text-sm">
                <p class="text-[#171106] font-primary text-sm" v-if="item.clock_out !== null">
              {{  moment(item.clock_out.replace(/-/g, "/")).format("LT") }}
            </p>
            <p v-else class="flex items-center gap-1 text-danger "> <i class="fi fi-rr-info pt-1  !text-xs"></i>
Not Clockout</p>
              </div>
            </div>
          </div>

          <!-- mobile view -->
          <div
            class="flex items-center justify-between lg:hidden py-2 w-full px-4"
            v-if="item.key !== 'leave'"
          >
            <div class="w-1/2">
              <p class="text-[11px]">Break</p>
              <div
                v-for="(section, index) in item.breaks"
                v-if="item.breaks.length > 0"
              >
                <p class="text-[#171106] text-[13px] font-normal">
                  {{ section.total_hours }} hrs
                </p>
                <p class="text-center text-[11px]">
                  {{ section.clock_in }} - {{ section.clock_out}}
                </p>
              </div>
              <div v-else>
                <p class="text-[#171106] text-[13px] font-normal">
                  No breaks added
                </p>
              </div>
            </div>

            <div class="w-1/2 px-4">
              <p class="text-[11px]">Work hours</p>
              <div class="py-2 text-[#171106] font-primary font-medium text-sm">
                {{ item.total_hours === 0 ? "-" : item.total_hours + " Hours" }}
              </div>
            </div>
          </div>

          <!-- web view -->
          <div class="hidden lg:flex gap-8 items-center" v-if="item.key !== 'leave'">
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
            <p class=" text-black font-bold">..........</p>
          </div>
          <div class="hidden lg:flex" v-if="item.key !== 'leave'">
            <p class="text-[#171106] font-primary text-sm">
              <p class="text-[#171106] font-primary text-sm" v-if="item.clock_out !== null">
              {{  moment(item.clock_out.replace(/-/g, "/")).format("LT") }}
            </p>
            <p v-else class="flex items-center gap-1 text-danger "> 

<i class="fi fi-rr-info pt-1  !text-xs"></i>
Not Clockout
</p>
            </p>
          </div>

          <div class="hidden lg:block" v-if="item.key !== 'leave'">
            <div
              class="flex items-center gap-1 py-1"
              :class="item?.breaks?.length >1?'border-b':''"
              v-if="item.key !== 'leave' && item.breaks.length > 0"
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
            <div
              class="flex items-center gap-1"
              v-if="item.key !== 'leave' && item.breaks.length === 0"
            >
              <div>
                <p class="text-[#171106] text-[13px] font-normal">
                  No breaks added
                </p>
              </div>
            </div>
          </div>
          <div class="hidden lg:flex" v-if="item.key !== 'leave'">
            <p class="text-[#171106] font-primary text-sm whitespace-pre">
              {{ item.total_hours === 0 ? "-" : item.total_hours + " Hours" }}
            </p>
          </div>
          <div class="hidden lg:flex" v-if="item.key !== 'leave'">
            <p class="text-[#171106] font-primary text-sm whitespace-pre">
              {{ item.overtime === 0 ? "-" : item.overtime + " Hours" }}
            </p>
          </div>
          <div class="hidden lg:flex" v-if="item.key !== 'leave'">
            <svg
            @click="emit('clockinDetails',item)"
              class="cursor-pointer"
              width="17"
              height="20"
              viewBox="0 0 17 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.72 12H5.71997C5.45475 12 5.2004 12.1054 5.01286 12.2929C4.82533 12.4804 4.71997 12.7348 4.71997 13C4.71997 13.2652 4.82533 13.5196 5.01286 13.7071C5.2004 13.8946 5.45475 14 5.71997 14H11.72C11.9852 14 12.2395 13.8946 12.4271 13.7071C12.6146 13.5196 12.72 13.2652 12.72 13C12.72 12.7348 12.6146 12.4804 12.4271 12.2929C12.2395 12.1054 11.9852 12 11.72 12ZM11.72 8H7.71997C7.45475 8 7.2004 8.10536 7.01286 8.29289C6.82533 8.48043 6.71997 8.73478 6.71997 9C6.71997 9.26522 6.82533 9.51957 7.01286 9.70711C7.2004 9.89464 7.45475 10 7.71997 10H11.72C11.9852 10 12.2395 9.89464 12.4271 9.70711C12.6146 9.51957 12.72 9.26522 12.72 9C12.72 8.73478 12.6146 8.48043 12.4271 8.29289C12.2395 8.10536 11.9852 8 11.72 8ZM13.72 2H12.54C12.3337 1.41645 11.9519 0.910998 11.447 0.552938C10.9422 0.194879 10.3389 0.00173951 9.71997 0H7.71997C7.10103 0.00173951 6.49777 0.194879 5.99291 0.552938C5.48804 0.910998 5.10628 1.41645 4.89997 2H3.71997C2.92432 2 2.16126 2.31607 1.59865 2.87868C1.03604 3.44129 0.719971 4.20435 0.719971 5V17C0.719971 17.7956 1.03604 18.5587 1.59865 19.1213C2.16126 19.6839 2.92432 20 3.71997 20H13.72C14.5156 20 15.2787 19.6839 15.8413 19.1213C16.4039 18.5587 16.72 17.7956 16.72 17V5C16.72 4.20435 16.4039 3.44129 15.8413 2.87868C15.2787 2.31607 14.5156 2 13.72 2ZM6.71997 3C6.71997 2.73478 6.82533 2.48043 7.01286 2.29289C7.2004 2.10536 7.45475 2 7.71997 2H9.71997C9.98519 2 10.2395 2.10536 10.4271 2.29289C10.6146 2.48043 10.72 2.73478 10.72 3V4H6.71997V3ZM14.72 17C14.72 17.2652 14.6146 17.5196 14.4271 17.7071C14.2395 17.8946 13.9852 18 13.72 18H3.71997C3.45475 18 3.2004 17.8946 3.01286 17.7071C2.82533 17.5196 2.71997 17.2652 2.71997 17V5C2.71997 4.73478 2.82533 4.48043 3.01286 4.29289C3.2004 4.10536 3.45475 4 3.71997 4H4.71997V5C4.71997 5.26522 4.82533 5.51957 5.01286 5.70711C5.2004 5.89464 5.45475 6 5.71997 6H11.72C11.9852 6 12.2395 5.89464 12.4271 5.70711C12.6146 5.51957 12.72 5.26522 12.72 5V4H13.72C13.9852 4 14.2395 4.10536 14.4271 4.29289C14.6146 4.48043 14.72 4.73478 14.72 5V17Z"
                fill="#AEACA8"
              />
            </svg>
          </div>
        </div>
        <div v-if="data.length === 0 && !loading">
         
          <div class="flex py-8 justify-center">
            <img
        src="~/assets/images/envelop.svg"
        class=" object-contain"
      />
          </div>

          <div>
            <p class="text-center text-xl font-primary text-black">
              No result found
            </p>
            <p class="text-center font-primary text-base text-black ">
              No logs available
            </p>
          </div>
        </div>
        <!-- pagination -->
        <div
          class="lg:flex md:flex block gap-8 items-center mb-10 pr-12"
          v-if="data.length > 0 && !loading"
        >
          <div class="lg:flex md:flex block items-baseline gap-4 w-full px-4">
            <p
              class="text-center py-2 mt-3 text-[#93A3B0] text-sm font-normal font-primary"
            >
              Show rows per page
            </p>
            <div class="select-number">
              <select
            class="text-dark dark:text-light px-3.5 py-2.5 rounded-md text-sm md:text-base outline-none w-[60px]"
            v-model="filterData.per_page"
            @change="
              emit('paginate', {
                per_page: filterData.per_page,
              })
            "
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

          <p class="whitespace-nowrap text-center font-primary font-medium">
            Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
          </p>
          <ol
            class="lg:flex md:flex block justify-center text-xs font-medium my-6"
            v-if="pagination.lastPage > 1"
          >
            <li>
              <a
                :class="{
                  ' bg-transparent !text-gray-400  ':
                    pagination.currentPage == 1,
                }"
                href="#"
                class="inline-flex h-10 w-10 text-base hover:bg-slate-200 items-center justify-center rounded-lg bg-transparent text-black rtl:rotate-180"
                @click="
                  pagination.currentPage == 1
                    ? null
                    :  emit('paginate', {
                    page: pagination.currentPage - 1,
                    per_page: filterData.per_page,
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
                    :  emit('paginate', {
                    page: pagination.currentPage + 1,
                    per_page: filterData.per_page,
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
</template>

