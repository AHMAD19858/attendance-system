<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
import { useUserStore } from "~/stores/auth";
import moment from "moment/moment";
import { subDays } from "date-fns";
import { useExport } from "~/composables/useExport";
import { Field, Form, defineRule, ErrorMessage } from "vee-validate";
import { required, email, regex, min_value } from "@vee-validate/rules";
import { useToast } from "vue-toastification";
defineRule("required", required);
defineRule("email", email);
defineRule("regex", regex);
defineRule("min_value", min_value);
let baseURL = useRuntimeConfig().public.apiBase;
const { exportExcel } = useExport();
const { user, token } = useUserStore();
const perPageList = ref([5, 10, 15, 20, 30, 50]);
const todayDate = ref("");
const employees = ref([]);
const employeeLoading = ref(false);
const reportModal = ref(false);
const reportData = ref([]);
const reportLoading = ref(false);
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
var filterEmployees = reactive({
  per_page: "10",
  date_from: "",
  date_to: "",
});
const headers = reactive([
  // { text: "Name" },
  { text: "Total hours" },
  { text: "Actual hours" },
  { text: "Overtime" },
  { text: "Number of leaves" },
  { text: "Number of approved leaves" },
]);

async function listAllEmployees() {
  employeeLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  const res = await fetch(baseURL + "dropdowns/users", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const employeesData = await res.json();
  if (res.ok) {
    employees.value = employeesData;
    return res;
  } else {
    employeeLoading.value = false;
    throw {
      status: res.ok,
      code: res.status,
      message: employeesData.msg,
    };
  }
}
async function getReportData(body) {
  reportLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  /*   formData.append("start_date", sDate);
  formData.append("end_date", eDate); */
  const res = await fetch(baseURL + "users/report/index/download", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const response = await res.json();
  if (res.ok) {
    reportLoading.value = false;
    reportData.value = response.data;
    if (reportData) {
      return response.data.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          job_title: employee.job_title,
          actual_hours: employee.regular_hours,
          overtime: employee.overtime,
          total_hours: employee.total_hours,
          no_leaves: employee.leaves,
          no_approved_leaves: employee.approved_leaves,
          image: employee.image,
        };
      });
    }
    return res;
  } else {
    employeeLoading.value = false;
    throw {
      status: res.ok,
      code: res.status,
      message: response.msg,
    };
  }
}
getReportData(filterEmployees);

function downloadHandler() {
  const downloadedItems = computed(() => {
    if (reportData) {
      return reportData.value.map((item) => {
        return {
          name: item.first_name + " " + item.last_name,
          job_title: item.job_title,
          actual_hours: item.regular_hours,
          overtime: item.overtime,
          total_hours: item.total_hours,
          no_leaves: item.leaves,
          no_approved_leaves: item.approved_leaves,
          // image:item.image,
        };
      });
    }
  });

  let dataObj = {
    sheet_name: "Employees Data",
    sheet_tabs: [
      {
        data: downloadedItems.value,
        execluded_columns: ["image"],
        tab_name: "Employees",
      },
    ],
  };
  exportExcel(dataObj);
}
</script>
<template>
  <p class="pt-4 px-11 text-2xl">Reports</p>
  <div
    class="pt-4 bg-white"
    :class="employees.length > 0 ? '' : 'overflow-x-auto lg:overflow-x-clip'"
  >
    <div
      class="flex-col md:flex-row lg:flex-row justify-between items-baseline w-full block md:flex px-6 pl-8 lg:px-8"
    >
      <div class="px-0 lg:px-3 w-full lg:w-[20%]">
        <vue-date-picker
          class="cursor-pointer"
          v-model="date"
          :model-value="date"
          range
          :enable-time-picker="false"
          input-class-name="dp-custom-input cursor-pointer"
          placeholder="Time Period"
          :clearable="true"
          :textInput="true"
          @update:model-value="getFilteredData()"
          :preset-dates="presetDates"
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

      <!-- buttons -->
      <div class="flex gap-4 px-0 lg:px-4 mt-2 lg:mt-0">
        <div class="text-center w-1/2">
          <button
            @click="downloadHandler()"
            class="w-full bg-transparent border hover:bg-transparent/5 border-[#171106] md:w-[160px] rounded-lg text-[#171106] lg:font-semibold lg:text-base font-normal text-sm lg:text-[16px] h-10 px-2 py-2 lg:h-12 lg:px-6"
          >
            Download
          </button>
        </div>

        <div class="text-center w-1/2">
          <button
            @click="
              reportModal = true;
              listAllEmployees();
            "
            class="w-full hover:bg-primary/90 bg-primary border-[#171106] rounded-lg text-white lg:font-semibold lg:text-base font-normal text-sm lg:text-[16px] h-10 px-2 py-2 lg:h-12 lg:px-6"
          >
            Send To Email
          </button>
        </div>
      </div>
    </div>
    <AppLoader class="py-24" v-if="reportLoading" />
    <!-- table -->
    <div v-else class="my-10" :class="sidebarOpen ? 'px-3' : 'px-5'">
      <!-- table header -->
      <div
        :class="`grid-cols-${headers?.length}`"
        class="lg:grid grid-cols-6 hidden gap-4 border-b py-2 border-t px-4 items-center"
      >
        <div class="flex items-center gap-2 w-full">
          <div class="ml-2 font-primary font-normal text-sm text-[#9D9B97]">
            Name
          </div>
        </div>
        <div
          v-for="(item, index) in headers"
          :key="index"
          class="ml-6 font-primary font-normal text-[13px] text-[#9D9B97]"
        >
          {{ item.text }}
        </div>
      </div>
      <!-- table body -->
      <div v-if="reportData.length > 0">
        <div
          v-for="(item, index) in reportData"
          x
          :key="index"
          :class="`grid-cols-${headers.length + 1} grid-rows-${
            reportData.length + 1
          }`"
          class="lg:grid items-center ml-3 lg:ml-0 border lg:border-t-0 lg:border-r-0 lg:border-l-0 border-b my-4 lg:my-0 font-primary font-normal text-sm py-2 text-[#9D9B97]"
        >
          <!-- checkbox, image and name -->
          <div class="flex items-center gap-2 w-full">
            <div>
              <!-- <input
                  type="checkbox"
                  class="text-base ml-2 cursor-pointer accent-success"
                  :checked="selectAll"
                /> -->
            </div>

            <div class="">
              <img :src="item.image" alt="" class="w-10 h-10 rounded-full" />
            </div>

            <div class="block">
              <p class="text-[#171106] text-sm font-primary font-medium">
                {{ item.first_name }} {{ item.last_name }}
              </p>
              <p class="text-[#6E7A84] text-sm font-primaryRegular">
                {{ item.job_title }}
              </p>
            </div>
          </div>

          <!-- mobile view -------------------------------------------------------->
          <hr class="lg:hidden mt-2" />
          <!-- total and actual hours -->
          <div class="flex items-center justify-between lg:hidden py-4 w-full">
            <div class="w-1/2">
              <p class="text-[11px]">Total hours</p>
              <div class="py-2 text-[#171106] font-primary font-medium text-sm">
                {{
                  item.total_hours == 0
                    ? "-"
                    : Math.round(item.total_hours * 100.0) / 100.0 + " Hours"
                }}
              </div>
            </div>

            <div class="w-1/2">
              <p class="text-[11px]">Actual hours</p>
              <div class="py-2 text-[#171106] font-primary font-medium text-sm">
                {{
                  item.regular_hours == 0
                    ? "-"
                    : Math.floor(item.regular_hours) + " Hours"
                }}
              </div>
            </div>
          </div>

          <!-- overtime and no.leaves -->
          <div class="flex items-center justify-between lg:hidden py-2 w-full">
            <div class="w-1/2">
              <p class="text-[11px]">Overtime</p>
              <p class="py-2 text-[#171106] font-primary font-medium text-sm">
                {{
                  item.overtime === 0
                    ? "-"
                    : Math.round(item.overtime * 100.0) / 100.0 + " Hours"
                }}
              </p>
            </div>

            <div class="w-1/2">
              <p class="text-[11px]">Number of leaves</p>
              <div class="py-2 text-[#171106] font-primary font-medium text-sm">
                {{ item.leaves === 0 ? "-" : item.leaves }}
              </div>
            </div>
          </div>

          <!-- no.approved leaves -->
          <div class="flex items-center justify-between lg:hidden py-2 w-full">
            <div class="w-1/2">
              <p class="text-[11px]">Number of approved leaves</p>
              <div class="py-2 text-[#171106] font-primary font-medium text-sm">
                {{ item.approved_leaves === 0 ? "-" : item.approved_leaves }}
              </div>
            </div>
          </div>

          <!-- desktop view ------------------------------------------------------------->
          <!-- total hours -->
          <div class="hidden lg:flex ml-6">
            <p class="text-[#171106] text-sm">
              {{
                item.total_hours == 0
                  ? "-"
                  : Math.round(item.total_hours * 100.0) / 100.0 + " Hours"
              }}
            </p>
          </div>

          <!-- actual hours -->
          <div class="hidden lg:flex ml-6">
            <p class="text-[#171106] text-sm">
              {{
                item.regular_hours == 0
                  ? "-"
                  : Math.floor(item.regular_hours) + " Hours"
              }}
            </p>
          </div>

          <!-- overtime -->
          <div class="hidden lg:flex ml-6">
            <p class="text-[#171106] text-sm">
              {{
                item.overtime == 0
                  ? "-"
                  : Math.round(item.overtime * 100.0) / 100.0 + " Hours"
              }}
            </p>
          </div>

          <!-- leaves -->
          <div class="hidden lg:flex ml-6 justify-center">
            <p class="text-[#171106] text-sm">
              {{ item.leaves == 0 ? "-" : item.leaves }}
            </p>
          </div>

          <!-- approved leaves -->
          <div class="hidden lg:flex ml-6 justify-center">
            <p class="text-[#171106] text-sm">
              {{ item.approved_leaves == 0 ? "-" : item.approved_leaves }}
            </p>
          </div>
        </div>
      </div>

      <!-- in case there is no data -->
      <div v-else>
        <div class="flex py-8 justify-center">
          <svg
            width="127"
            height="97"
            viewBox="0 0 127 97"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <rect
              x="0.5"
              width="126"
              height="97"
              fill="url(#pattern0)"
              fill-opacity="0.5"
            />
            <defs>
              <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlink:href="#image0_99_3128"
                  transform="matrix(0.00168067 0 0 0.00218314 0 0.00224378)"
                />
              </pattern>
              <image
                id="image0_99_3128"
                width="595"
                height="456"
                xlink:href="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div>

        <div>
          <p class="text-center text-xl font-primary text-black">
            No result found
          </p>
          <p class="text-center font-primary text-base text-black">
            no log available on the date range selected
          </p>
        </div>
      </div>

      <!-- pagination -->
      <!--   <div class="lg:flex md:flex block gap-8 items-center justify-end">
          <div class="lg:flex md:flex block items-baseline gap-4 w-full px-4">
            <p
              class="text-center py-2 mt-3 text-[#93A3B0] text-sm font-normal font-primary"
            >
              Show rows per page
            </p>
            <div class="select-number">
              <select
                v-model="filterEmployees.per_page"
                @change="getReportData(filterEmployees)"
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
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
                    : getReportData({
                        page: pagination.currentPage - 1,
                        per_page: filterEmployees.per_page,
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
                    : getReportData({
                        page: pagination.currentPage + 1,
                        per_page: filterEmployees.per_page,
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
        </div> -->
      <!-- send email modal -->
    </div>

    <AppModal
      :is-open="reportModal"
      @close="reportModal = false"
      title="Send Report"
      confirm-text="Send"
      hide-actions="false"
      :show-actions="showActions"
      @confirm="
        sendReportViaEmail(
          start_date ? start_date : '',
          end_date ? end_date : '',
          receiversEmails
        )
      "
      :loading="sendEmailLoading"
    >
      <Form @submit="sendReportViaEmail()" v-slot="{ errors }">
        <div class="">
          <label
            class="text-sm cursor-pointer py-8 flex gap-2 items-center"
            for="email"
          >
            <i class="bx bx-send text-light"></i>
            <span class="text-base text-[#171106]">Send Report to</span>
          </label>

          <Multiselect
            v-model="receiversEmails"
            mode="tags"
            placeholder="Enter Email"
            track-by="email"
            label="email"
            value-prop="email"
            :multiple="true"
            :close-on-select="false"
            :searchable="true"
            class="focus:outline-none"
            style="border: 1px solid #e6e5e4; min-height: 50px"
            :options="employees"
            :classes="{
              dropdown:
                'max-h-96 absolute -left-px -right-px  bottom-0 transform translate-y-full border border-[#f6f6f6] shadow -mt-px overflow-y-scroll z-50 bg-white flex flex-col rounded-b shadow',
              optionSelected: 'text-gray-600 bg-white',
              dropdownHidden: 'hidden',
              optionSelectedPointed: 'text-gray-600 bg-gray-100 opacity-90',
              containerActive: 'ring ring-white ring-opacity-30',
              options:
                'flex flex-col p-0 m-0 mt-2 list-none border border-[#E6E5E4]',
            }"
          >
            <template v-slot:tag="{ option, handleTagRemove, disabled }">
              <div
                class="multiselect-tag"
                :class="{
                  'is-disabled': disabled,
                }"
              >
                <img width="30" :src="option.image" />
                <span class="text-[#171106]"
                  >{{ option.first_name }} {{ option.last_name }}</span
                >
                <span
                  v-if="!disabled"
                  class="multiselect-tag-remove"
                  @click="handleTagRemove(option, $event)"
                >
                  <span class="multiselect-tag-remove-icon"></span>
                </span>
              </div>
            </template>

            <template v-slot:option="{ option }">
              <div
                class="w-full flex items-center gap-2 pb-1"
                style="border-bottom: 1px solid #e6e5e4"
              >
                <img
                  class="character-option-icon"
                  width="40"
                  :src="option.image"
                />
                <div>
                  <div class="text-base text-dark">
                    {{ option.first_name }} {{ option.last_name }}
                  </div>
                  <div class="text-sm text-light">{{ option.email }}</div>
                </div>
              </div>
            </template>
          </Multiselect>
        </div>
        <button ref="formSubmit"></button>
      </Form>
    </AppModal>
  </div>
</template>

<style>
.multiselect-tag {
  padding: 8px 3px 5px;
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid #171106;
}
.multiselect-tag-remove-icon {
  @apply text-primary;
}
</style>
