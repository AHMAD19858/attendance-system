<script setup>
import { useUserStore } from "~/stores/auth";
const { user } = storeToRefs(useUserStore());
defineProps({
  employeeData: Object,
  loading: Boolean,
});
</script>
<template>
  <div class="user-info">
    <div class="w-full flex justify-center mt-10">
      <img :src="user.image" alt="" class="w-20 h-20 rounded-full" />
    </div>
    <div class="pt-4">
      <p class="text-center text-[#4C4C4C] font-primary font-medium text-xl">
        {{ user.first_name }} {{ user.last_name }}
      </p>
      <p class="text-center text-[#6E7A84] font-light text-sm">
        {{ user.job_title }}
      </p>
    </div>

    <hr class="w-full border-[#f0ecec] border my-8" />
    <div class="flex gap-2 items-center justify-center">
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 3.7C7.89494 3.69997 7.7909 3.72065 7.69382 3.76084C7.59675 3.80103 7.50855 3.85996 7.43426 3.93425C7.35996 4.00855 7.30104 4.09675 7.26084 4.19382C7.22065 4.29089 7.19998 4.39493 7.2 4.5V8.00703L5.25547 8.98554C5.16165 9.03274 5.07804 9.09795 5.00942 9.17745C4.9408 9.25696 4.88851 9.3492 4.85554 9.44892C4.82256 9.54863 4.80955 9.65386 4.81725 9.75861C4.82495 9.86335 4.8532 9.96555 4.90039 10.0594C4.94758 10.1532 5.01279 10.2368 5.0923 10.3054C5.17181 10.374 5.26405 10.4263 5.36376 10.4593C5.46348 10.4923 5.56871 10.5053 5.67345 10.4976C5.77819 10.4899 5.88039 10.4616 5.97422 10.4145L8.35938 9.21445C8.49187 9.14797 8.60326 9.04593 8.68107 8.91975C8.75889 8.79358 8.80007 8.64824 8.8 8.5V4.5C8.80003 4.39493 8.77936 4.29089 8.73916 4.19382C8.69897 4.09675 8.64004 4.00855 8.56575 3.93425C8.49146 3.85996 8.40325 3.80103 8.30618 3.76084C8.20911 3.72065 8.10507 3.69997 8 3.7ZM8 0.5C6.41775 0.5 4.87103 0.969192 3.55544 1.84824C2.23985 2.72729 1.21447 3.97672 0.608967 5.43853C0.00346627 6.90034 -0.15496 8.50887 0.153721 10.0607C0.462403 11.6126 1.22433 13.038 2.34315 14.1569C3.46197 15.2757 4.88743 16.0376 6.43928 16.3463C7.99113 16.655 9.59966 16.4965 11.0615 15.891C12.5233 15.2855 13.7727 14.2602 14.6518 12.9446C15.5308 11.629 16 10.0822 16 8.5C15.9976 6.37901 15.1539 4.34559 13.6542 2.84583C12.1544 1.34606 10.121 0.502426 8 0.5ZM8 14.9C6.7342 14.9 5.49683 14.5246 4.44435 13.8214C3.39188 13.1182 2.57158 12.1186 2.08717 10.9492C1.60277 9.77973 1.47603 8.4929 1.72298 7.25142C1.96992 6.00994 2.57946 4.86957 3.47452 3.97452C4.36958 3.07946 5.50995 2.46992 6.75142 2.22297C7.9929 1.97603 9.27973 2.10277 10.4492 2.58717C11.6186 3.07157 12.6182 3.89188 13.3214 4.94435C14.0246 5.99682 14.4 7.2342 14.4 8.5C14.3981 10.1968 13.7232 11.8235 12.5233 13.0233C11.3235 14.2231 9.69679 14.8981 8 14.9Z"
          fill="#171106"
        />
      </svg>
      <div class="flex gap-1 items-center">
        <span
          class="sk-loader w-full rounded-md"
          style="height: 50px"
          v-if="loading"
        ></span>
        <p
          class="font-primary text-3xl font-medium text-[#4C4C4C] animate-fade"
          v-else
        >
          {{ Math.round(employeeData?.total_hours * 100.0) / 100.0 }}
        </p>
        <p class="font-primary font-light text-sm text-[#171106]">
          Total hours
        </p>
      </div>
    </div>

    <div class="flex w-full items-center justify-center gap-8 pt-5">
      <div class="">
        <div class="border border-primary w-4 rounded-full mt-2"></div>
        <div>
          <span
            class="sk-loader w-full rounded-md"
            style="height: 20px"
            v-if="loading"
          ></span>
          <p
            class="font-normal font-primary text-sm text-[#171106] animate-fade"
            v-else
          >
            {{
              employeeData.regular_hours === 0
                ? "0"
                : Math.floor(employeeData.regular_hours) + " hrs"
            }}
          </p>
          <p class="font-primary font-light text-[#6E7A84] text-xs">Regular</p>
        </div>

        <div class="border border-primary w-4 rounded-full mt-6"></div>
        <div>
          <span
            class="sk-loader w-full rounded-md"
            style="height: 20px"
            v-if="loading"
          ></span>
          <p
            class="font-normal font-primary text-sm text-[#171106] animate-fade"
            v-else
          >
            {{
              employeeData.used_sicks === "0"
                ? "0"
                : employeeData.used_sicks + " days"
            }}
            of
            {{
              employeeData.sicks === "0"
                ? "0 days"
                : employeeData.sicks + " days"
            }}
          </p>
          <p class="font-primary font-light text-[#6E7A84] text-xs">
            Sick leave
          </p>
        </div>
      </div>

      <div class="">
        <div class="border border-primary w-4 rounded-full mt-2"></div>
        <span
          class="sk-loader w-full rounded-md"
          style="height: 20px"
          v-if="loading"
        ></span>
        <p
          class="font-normal font-primary text-sm text-[#171106] animate-fade"
          v-else
        >
          {{
            Number(employeeData.overtime?.toFixed(1)) === 0
              ? "0"
              : Number(employeeData.overtime?.toFixed(1)) + " hrs"
          }}
        </p>
        <p class="font-primary font-light text-[#6E7A84] text-xs">Overtime</p>

        <div class="border border-primary w-4 rounded-full mt-6"></div>
        <span
          class="sk-loader w-full rounded-md"
          style="height: 20px"
          v-if="loading"
        ></span>
        <p class="font-normal font-primary text-sm text-[#171106] animate-fade" v-else>
          {{
            employeeData.used_vacations === "0"
              ? "0"
              : employeeData.used_vacations + " days"
          }}
          of
          {{
            employeeData.vacations === "0"
              ? "0 days"
              : employeeData.vacations + " days"
          }}
        </p>
        <p
          class="font-primary font-light text-[#6E7A84] text-xs whitespace-pre"
        >
          Annual leaves
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-info {
  @apply col-span-2 h-screen !bg-[#F7F7F6] pt-10 hidden md:hidden sm:hidden lg:block w-full;
}
</style>
