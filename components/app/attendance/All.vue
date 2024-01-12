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
    <!-- body -->
    <div
      v-if="data.length > 0 && !loading"
      v-for="(item, index) in data"
      :key="index"
      :class="
        item.key !== 'leave'
          ? `grid-cols-${headers.length} grid-rows-${data.length} px-2`
          : item.approval_status === 'pending'
          ? `grid-cols-8 lg:grid-cols-6 grid-rows-${data.length} bg-[#F7F7F6]  !py-0 border-l-warning border-l-4`
          : item.approval_status === 'rejected'
          ? `grid-cols-8 lg:grid-cols-6 grid-rows-${data.length} bg-[#F7F7F6]  !py-0 !border-l-danger border-l-4`
          : `grid-cols-8 lg:grid-cols-6 grid-rows-${data.length} bg-[#F7F7F6]  !py-0 !border-l-primary border-l-4 lg:py-0`
      "
      class="lg:grid items-center rounded-lg lg:rounded-none gap-10 ml-3 lg:ml-0 border lg:border-t-0 lg:border-r-0 lg:border-l-0 border-b my-4 lg:my-0 font-primary font-normal text-sm py-2 text-[#9D9B97]"
    >
      <div
        class="flex justify-between items-center gap-1 w-full px-2 lg:px-0 py-4"
        v-if="item.key !== 'leave'"
      >
        <div class="flex gap-2 ">
          <div class="border rounded-[20px] px-1 border-[#171106] h-fit">
            <p class="text-[#171106] text-xs font-normal font-primary mx-[2px]">
              {{
                moment(item.clock_in.replace(/-/g, "/"))
                  .format("dddd")
                  .slice(0, 3)
              }}
            </p>
          </div>

          <div class="block">
            <p class="text-[#171106] text-[13px] font-primary">
              {{
                moment(item.clock_in.replace(/-/g, "/")).format("MMM Do YYYY")
              }}
            </p>
          </div>
        </div>

        <svg
          @click="emit('clockinDetails', item)"
          class="ml-20 lg:hidden"
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
      <!--  -->
      <div class="block" v-if="item.key == 'leave'">
        <div
          class="flex items-center gap-2 border-b-2 w-full border-r lg:h-16 lg:border-l-4 pl-1 border-l-primary lg:border-solid border-none lg:border-b-[#eeeeeb]"
          :class="
            item.approval_status === 'pending'
              ? 'border-l-warning'
              : item.approval_status == 'rejected'
              ? '!border-l-danger'
              : 'border-l-primary'
          "
        >
          <div class="border rounded-[20px] px-1 border-[#171106] mx-1">
            <p class="text-[#171106] text-xs font-normal font-primary mx-[2px]">
              {{ moment(item.choosed_date).format("dddd").slice(0, 3) }}
            </p>
          </div>

          <div class="block">
            <p class="text-[#171106] text-[13px] font-primary">
              {{ moment(item.choosed_date).format("MMM Do YYYY") }}
            </p>
          </div>

          <svg
            @click="emit('timeoffDetails', item.id)"
            class="ml-20 mt-4 lg:hidden"
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
        <div
          class="lg:flex hidden items-center gap-2 w-full border-r lg:h-16 lg:border-l-4 pl-1 border-l-primary border-gray-300 py-1 border-b-[#F7F7F6]"
          :class="
            item.approval_status === 'pending'
              ? 'border-l-warning'
              : item.approval_status == 'rejected'
              ? '!border-l-danger'
              : 'border-l-primary'
          "
          v-if="item.key == 'leave' && item.status !== 'hours'"
        >
          <div class="border rounded-[20px] px-1 border-[#171106] mx-1">
            <p class="text-[#171106] text-xs font-normal font-primary mx-[2px]">
              {{ moment(item.end_date).format("dddd").slice(0, 3) }}
            </p>
          </div>

          <div class="block">
            <p class="text-[#171106] text-[13px] font-primary">
              {{ moment(item.end_date).format("MMM Do YYYY") }}
            </p>
          </div>

          <svg
            class="ml-20 lg:hidden"
            width="16"
            height="21"
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
      </div>

      <div class="lg:hidden block px-4">
        <svg
          v-if="item.key == 'leave'"
          class="my-2"
          width="10"
          height="16"
          viewBox="0 0 10 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.00032 1.33331L4.33365 1.33331L4.33365 14.118L1.46699 11.2513C1.34125 11.1299 1.17285 11.0627 0.998051 11.0642C0.823254 11.0657 0.656045 11.1358 0.53244 11.2594C0.408834 11.383 0.338721 11.5502 0.337202 11.725C0.335683 11.8998 0.402879 12.0682 0.524318 12.194L3.82165 15.4913C3.97642 15.6461 4.16017 15.7689 4.36241 15.8527C4.56465 15.9365 4.78141 15.9796 5.00032 15.9796C5.21923 15.9796 5.43599 15.9365 5.63823 15.8527C5.84046 15.7689 6.02422 15.6461 6.17899 15.4913L9.47899 12.1913C9.60399 12.0659 9.67408 11.8961 9.67383 11.719C9.67358 11.542 9.60301 11.3723 9.47765 11.2473C9.35229 11.1223 9.18241 11.0522 9.00538 11.0525C8.82834 11.0527 8.65866 11.1233 8.53365 11.2486L5.66699 14.1153L5.66699 1.33331L9.00032 1.33331C9.17713 1.33331 9.3467 1.26308 9.47172 1.13805C9.59675 1.01303 9.66699 0.843457 9.66699 0.666647C9.66699 0.489836 9.59675 0.320266 9.47172 0.195242C9.3467 0.0702181 9.17713 -2.00706e-05 9.00032 -2.0086e-05L1.00032 -2.07854e-05C0.823509 -2.08009e-05 0.653939 0.0702173 0.528915 0.195241C0.40389 0.320265 0.333653 0.489835 0.333653 0.666646C0.333653 0.843456 0.40389 1.01303 0.528915 1.13805C0.653939 1.26308 0.823509 1.33331 1.00032 1.33331Z"
            fill="#AEACA8"
          />
        </svg>
      </div>

      <div
        class="lg:hidden flex items-center gap-2 w-full border-r lg:border-l-4 pl-1 border-l-primary border-gray-300"
        v-if="item.key == 'leave'"
      >
        <div class="border rounded-[20px] px-1 border-[#171106]">
          <p class="text-[#171106] text-xs font-normal font-primary mb-1">
            {{ moment(item.end_date).format("dddd").slice(0, 3) }}
          </p>
        </div>

        <div class="block">
          <p class="text-[#171106] text-[13px] font-primary">
            {{ moment(item.end_date).format("MMM Do YYYY") }}
          </p>
        </div>
      </div>

      <div class="lg:flex hidden items-start gap-1" v-if="item.key == 'leave'">
        <svg
          class="mt-1"
          width="12"
          height="15"
          viewBox="0 0 12 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 7.5C0 7.69891 0.0790178 7.88968 0.21967 8.03033C0.360322 8.17098 0.551088 8.25 0.75 8.25H6.4425L4.7175 9.9675C4.6472 10.0372 4.59141 10.1202 4.55333 10.2116C4.51525 10.303 4.49565 10.401 4.49565 10.5C4.49565 10.599 4.51525 10.697 4.55333 10.7884C4.59141 10.8798 4.6472 10.9628 4.7175 11.0325C4.78722 11.1028 4.87017 11.1586 4.96157 11.1967C5.05296 11.2347 5.15099 11.2543 5.25 11.2543C5.34901 11.2543 5.44704 11.2347 5.53843 11.1967C5.62983 11.1586 5.71278 11.1028 5.7825 11.0325L8.7825 8.0325C8.85078 7.96117 8.9043 7.87706 8.94 7.785C9.01501 7.6024 9.01501 7.3976 8.94 7.215C8.9043 7.12294 8.85078 7.03883 8.7825 6.9675L5.7825 3.9675C5.71257 3.89757 5.62955 3.8421 5.53819 3.80426C5.44682 3.76641 5.34889 3.74693 5.25 3.74693C5.15111 3.74693 5.05318 3.76641 4.96181 3.80426C4.87045 3.8421 4.78743 3.89757 4.7175 3.9675C4.64757 4.03743 4.5921 4.12045 4.55426 4.21181C4.51641 4.30318 4.49693 4.40111 4.49693 4.5C4.49693 4.59889 4.51641 4.69682 4.55426 4.78819C4.5921 4.87955 4.64757 4.96257 4.7175 5.0325L6.4425 6.75H0.75C0.551088 6.75 0.360322 6.82902 0.21967 6.96967C0.0790178 7.11032 0 7.30109 0 7.5ZM9.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V4.5C0 4.69891 0.0790178 4.88968 0.21967 5.03033C0.360322 5.17098 0.551088 5.25 0.75 5.25C0.948912 5.25 1.13968 5.17098 1.28033 5.03033C1.42098 4.88968 1.5 4.69891 1.5 4.5V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H9.75C9.94891 1.5 10.1397 1.57902 10.2803 1.71967C10.421 1.86032 10.5 2.05109 10.5 2.25V12.75C10.5 12.9489 10.421 13.1397 10.2803 13.2803C10.1397 13.421 9.94891 13.5 9.75 13.5H2.25C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V10.5C1.5 10.3011 1.42098 10.1103 1.28033 9.96967C1.13968 9.82902 0.948912 9.75 0.75 9.75C0.551088 9.75 0.360322 9.82902 0.21967 9.96967C0.0790178 10.1103 0 10.3011 0 10.5V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H9.75C10.3467 15 10.919 14.7629 11.341 14.341C11.7629 13.919 12 13.3467 12 12.75V2.25C12 1.65326 11.7629 1.08097 11.341 0.65901C10.919 0.237053 10.3467 0 9.75 0Z"
            fill="#5E8CF8"
          />
        </svg>

        <div>
          <p class="text-[#9D9B97] text-[11px] font-normal">Time off</p>
          <p
            class="text-[11px] text-[#171106] font-normal capitalize"
            :class="
              item.approval_status == 'approved'
                ? 'text-success'
                : 'text-danger'
            "
            v-if="
              item.approval_status == 'approved' ||
              item.approval_status == 'rejected'
            "
          >
            {{ item.approval_status }} by {{ item.approved_by.first_name }}
            {{ item.approved_by.last_name }}
          </p>

          <p class="text-[11px] text-[#171106] font-normal capitalize" v-else>
            {{ item.approval_status }}
          </p>
        </div>
      </div>
      <!-- mobile view break-->
      <hr class="lg:hidden mt-2" v-if="item.key == 'leave'" />
      <div
        class="flex items-center justify-between lg:hidden py-4 w-full px-4"
        v-if="item.key == 'leave'"
      >
        <div class="w-1/2 flex gap-1">
          <svg
            class="mt-1"
            width="12"
            height="15"
            viewBox="0 0 12 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 7.5C0 7.69891 0.0790178 7.88968 0.21967 8.03033C0.360322 8.17098 0.551088 8.25 0.75 8.25H6.4425L4.7175 9.9675C4.6472 10.0372 4.59141 10.1202 4.55333 10.2116C4.51525 10.303 4.49565 10.401 4.49565 10.5C4.49565 10.599 4.51525 10.697 4.55333 10.7884C4.59141 10.8798 4.6472 10.9628 4.7175 11.0325C4.78722 11.1028 4.87017 11.1586 4.96157 11.1967C5.05296 11.2347 5.15099 11.2543 5.25 11.2543C5.34901 11.2543 5.44704 11.2347 5.53843 11.1967C5.62983 11.1586 5.71278 11.1028 5.7825 11.0325L8.7825 8.0325C8.85078 7.96117 8.9043 7.87706 8.94 7.785C9.01501 7.6024 9.01501 7.3976 8.94 7.215C8.9043 7.12294 8.85078 7.03883 8.7825 6.9675L5.7825 3.9675C5.71257 3.89757 5.62955 3.8421 5.53819 3.80426C5.44682 3.76641 5.34889 3.74693 5.25 3.74693C5.15111 3.74693 5.05318 3.76641 4.96181 3.80426C4.87045 3.8421 4.78743 3.89757 4.7175 3.9675C4.64757 4.03743 4.5921 4.12045 4.55426 4.21181C4.51641 4.30318 4.49693 4.40111 4.49693 4.5C4.49693 4.59889 4.51641 4.69682 4.55426 4.78819C4.5921 4.87955 4.64757 4.96257 4.7175 5.0325L6.4425 6.75H0.75C0.551088 6.75 0.360322 6.82902 0.21967 6.96967C0.0790178 7.11032 0 7.30109 0 7.5ZM9.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V4.5C0 4.69891 0.0790178 4.88968 0.21967 5.03033C0.360322 5.17098 0.551088 5.25 0.75 5.25C0.948912 5.25 1.13968 5.17098 1.28033 5.03033C1.42098 4.88968 1.5 4.69891 1.5 4.5V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H9.75C9.94891 1.5 10.1397 1.57902 10.2803 1.71967C10.421 1.86032 10.5 2.05109 10.5 2.25V12.75C10.5 12.9489 10.421 13.1397 10.2803 13.2803C10.1397 13.421 9.94891 13.5 9.75 13.5H2.25C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V10.5C1.5 10.3011 1.42098 10.1103 1.28033 9.96967C1.13968 9.82902 0.948912 9.75 0.75 9.75C0.551088 9.75 0.360322 9.82902 0.21967 9.96967C0.0790178 10.1103 0 10.3011 0 10.5V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H9.75C10.3467 15 10.919 14.7629 11.341 14.341C11.7629 13.919 12 13.3467 12 12.75V2.25C12 1.65326 11.7629 1.08097 11.341 0.65901C10.919 0.237053 10.3467 0 9.75 0Z"
              fill="#5E8CF8"
            />
          </svg>
          <div>
            <p class="text-[11px]">Time off</p>
            <div class="py-2 text-[#171106] font-primary font-medium text-sm">
              <p
                class="text-[11px] text-[#171106] font-normal"
                v-if="item.approval_status == 'approved'"
              >
                {{ item.approval_status }} by
                {{ item.approved_by.first_name }}
                {{ item.approved_by.last_name }}
              </p>
              <p
                class="text-[11px] text-[#171106] font-normal"
                v-else="item.approval_status == 'approved'"
              >
                {{ item.approval_status }}
              </p>
            </div>
          </div>
        </div>

        <div class="w-1/2 px-4">
          <p class="text-[11px]">Type</p>
          <div class="py-2 text-[#171106] font-primary font-medium text-[11px]">
            {{ item.status }}
          </div>
        </div>
      </div>

      <!-- mobile view break-->
      <div
        class="flex items-center justify-between lg:hidden py-2 w-full px-4"
        v-if="item.key == 'leave'"
      >
        <div class="w-1/2">
          <p class="text-[11px]">Approved on</p>
          <p class="text-[#171106] font-primary font-medium text-[11px]">
            {{
              item.approve_date === null
                ? "-"
                : moment(item.approve_date).format("MMM Do YYYY")
            }}
          </p>
        </div>

        <div class="w-1/2 px-4">
          <p class="text-[11px]">Duration</p>
          <p
            class="text-[11px] text-[#171106] font-normal"
            v-if="item.status == 'hours'"
          >
            {{ item.hours === 0 ? "-" : item.hours + " hours" }}
          </p>
          <div
            class="py-2 text-[#171106] font-primary font-medium text-[11px]"
            v-else
          >
            {{ item.duration === 0 ? "-" : item.duration + " days" }}
          </div>
        </div>
      </div>
      <div v-if="item.key == 'leave'" class="lg:block hidden">
        <div>
          <p class="text-[#9D9B97] text-[11px] font-normal">Type</p>
          <p class="text-[11px] text-[#171106] font-normal">
            {{ item.status }}
          </p>
        </div>
      </div>
      <div v-if="item.key == 'leave'" class="lg:block hidden">
        <div>
          <p class="text-[#9D9B97] text-[11px] font-normal">Approved on</p>
          <p class="text-[11px] text-[#171106] font-normal">
            {{
              item.approve_date === null
                ? "-"
                : moment(item.approve_date).format("MMM Do YYYY")
            }}
          </p>
        </div>
      </div>

      <div v-if="item.key == 'leave'" class="lg:block hidden">
        <div>
          <p class="text-[#9D9B97] text-[11px] font-normal">Duration</p>
          <p class="text-[11px] text-[#171106] font-normal">
            {{
              item.duration === 0
                ? item.hours + (item.hours > 1 ? " hours" : " hour")
                : item.duration + (item.duration > 1 ? " days" : " day")
            }}
          </p>
        </div>
      </div>

      <div
        class="lg:flex items-center gap-1 cursor-pointer hidden"
        v-if="item.key == 'leave'"
        @click="emit('timeoffDetails', item.id)"
      >
        <svg
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

        <div>
          <p
            class="text-[#171106] text-[13px] font-normal border-b border-black border-dotted"
          >
            View note
          </p>
        </div>
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
            <p class="text-start text-[11px]">
              {{ section.clock_in }} - {{ section.clock_out }}
            </p>
          </div>
          <div v-else>
            <p class="text-[#171106] text-[13px] font-normal">
              No breaks added
            </p>
          </div>
        </div>

        <div class="w-1/2">
          <p class="text-[11px]">Work hours</p>
          <div class="py-2 text-[#171106] font-primary font-medium text-sm">
            {{ item.total_hours === 0 ? "-" : item.total_hours + " Hours" }}
          </div>
        </div>
      </div>

      <!-- web view -->
      <div
        class="hidden lg:flex gap-8 items-center"
        v-if="item.key !== 'leave'"
      >
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

        <p class="text-black font-bold">..........</p>
      </div>

      <div class="hidden lg:flex items-center" v-if="item.key !== 'leave'">
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

      <div class="hidden lg:block" v-if="item.key !== 'leave'">
        <div
          class="flex items-center gap-1"
          :class="item?.breaks?.length > 1 ? 'border-b' : ''"
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
          {{ item.overtime === '0' ? "-" : item.overtime + " Hours" }}
        </p>
      </div>
      <div class="hidden lg:flex" v-if="item.key !== 'leave'">
        <svg
          @click="emit('clockinDetails', item)"
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
      class="lg:flex md:flex flex gap-8 items-center mb-10 pr-12"
      v-if="data.length > 0"
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
              ' bg-transparent !text-gray-400  ': pagination.currentPage == 1,
            }"
            href="#"
            class="inline-flex h-10 w-10 text-base hover:bg-slate-200 items-center justify-center rounded-lg bg-transparent text-black rtl:rotate-180"
            @click="
              pagination.currentPage == 1
                ? null
                : emit('paginate', {
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
                : emit('paginate', {
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
