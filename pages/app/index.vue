<script setup>
const googleUrl = useRuntimeConfig().public.google;
definePageMeta({
  layout: "employee",
  middleware: ["auth"],
});
useHead({
  script: [
    {
      src: googleUrl,
    },
  ],
});

import { useUserStore } from "~/stores/auth";
import moment from "moment/moment";
import { Field, Form, defineRule, ErrorMessage } from "vee-validate";
import { required, email, regex, min_value } from "@vee-validate/rules";
import { useToast } from "vue-toastification";
import {
  endOfMonth,
  startOfMonth,
  subMonths,
  subDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";

defineRule("required", required);
defineRule("email", email);
defineRule("regex", regex);
defineRule("min_value", min_value);
const { user, token } = useUserStore();
const toast = useToast();
let baseURL = useRuntimeConfig().public.apiBase;
const employeeLoading = ref(false);
const attendanceLoading = ref(false);
const leavesLoading = ref(false);
const sheetsLoading = ref(false);
const clockinData = ref({});
const clockinDetailsModal = ref(false);
const timeoffDetailsModal = ref(false);
const clockinActionModal = ref(false);
const clockoutActionModal = ref(false);
const timeoffDetailsLoading = ref(false);
const timeoffModal = ref(false);
const addLoading = ref(false);
const checkData = ref({});
const employeeData = ref({});
const attendance = ref([]);
const leavesAttendance = ref([]);
const sheetAttendance = ref([]);
const date = ref();
const timeoffDate = ref();
const timeofftime = ref("");
const formSubmit = ref(null);
const selectedType = ref(false);
const actionLoading = ref(false);
const latitude = ref(null);
const longitude = ref(null);
const address = ref(null);
var elapsedTime = ref(0);
var clockDate = ref(null);
var breakTimeInMin = ref(0);
var overTimeInMin = ref(0);
var workTimeInMin = ref(0);
function updateTimer() {
  elapsedTime.value++;
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

let timer;

onMounted(async () => {
  timer = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
const leavesPagination = reactive({
  currentPage: 1,
  total: "",
  lastPage: 1,
  perPage: "",
});
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
  page: "",
});
const headers = reactive([
  { text: "Date" },
  { text: "Clockin" },
  { text: "Clockout" },
  { text: "Break" },
  { text: "Work hours" },
  { text: "Over time" },
  { text: "Note" },
]);
let form = reactive({
  choosed_date: "",
  end_date: "",
  status: "",
  reason: "",
  hours: "",
});
function resetForm() {
  form = {
    choosed_date: "",
    end_date: "",
    status: "",
    reason: "",
    hours: "",
  };

  /*  selectedType.value = "";
  viewEmployee.value = false;
  timeofftime.value = "";
  timeoffDate.value = ""; */
}

const requestData = ref({});
const tabs = ["All", "Leaves", "Timesheets"];
const activeTab = ref("All");
const types = ref([
  {
    id: 1,
    name: "Pto",
    value: "pto",
  },
  {
    id: 2,
    name: "Sick Leave",
    value: "sick",
  },
  {
    id: 3,
    name: "Vacation",
    value: "vacation",
  },
  {
    id: 4,
    name: "Hours",
    value: "hours",
  },
]);
async function getLocation() {
  try {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(async (result) => {
        if (result.state === "granted") {
          locationStatus.value = result.state;
          localStorage.setItem("state", result.state);
          const position = await getCurrentPosition();
          latitude.value = position.coords.latitude;
          longitude.value = position.coords.longitude;
          getAddressFromLatLng(latitude.value, longitude.value);
        } else {
          locationStatus.value = result.state;
          localStorage.setItem("state", result.state);
          const position = await getCurrentPosition();
          latitude.value = position.coords.latitude;
          longitude.value = position.coords.longitude;
          getAddressFromLatLng(latitude.value, longitude.value);
        }
      });
  } catch (error) {
    /*   console.error("Error getting location:", error.message); */
    toast.error(error.message);
  }
}
/* getLocation(); */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function getAddressFromLatLng(lat, lng) {
  const geocoder = new google.maps.Geocoder();
  const latLng = new google.maps.LatLng(lat, lng);
  address.value = null;

  geocoder.geocode({ location: latLng }, (results, status) => {
    console.log("address", results);
    if (status === "OK") {
      if (results[0]) {
        address.value = results[1].formatted_address;
      } else {
        address.value = "No results found";
      }
    } else {
      console.error("Geocoder failed due to:", status);
    }
  });
}
var locationStatus = ref(null);
/* navigator.permissions.query({ name: "geolocation" }).then((result) => {
  locationStatus.value = result.state;
  localStorage.setItem("state", result.state);
}); */
function openDialog() {
  if (locationStatus.value === "granted") {
    clockinActionModal.value = true;
    getLocation();
  } else if (address.value == null) {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        toast.error("Please allow location in browser settings");
      } else {
        locationStatus.value = result.state;
        localStorage.setItem("state", result.state);
        getLocation();
        clockinActionModal.value = true;
      }
    });
  } else {
    clockinActionModal.value = true;
  }
}
function selectType(item) {
  selectedType.value = item.id;
  form.status = item.value;
}
function showClockinNoteHandler(item) {
  clockinDetailsModal.value = true;
  clockinData.value = item;
}
async function getUserInfo() {
  employeeLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  formData.append("id", user.id);
  const res = await fetch(baseURL + "users/show", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const employeesData = await res.json();
  if (res.ok) {
    employeeLoading.value = false;
    employeeData.value = employeesData.model;
  } else {
    employeeLoading.value = false;
  }
}
getUserInfo();

async function listAllAttendance(body) {
  attendanceLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  if (user.role.title === "Employee") {
    formData.append("employee_id", user.id);
  }

  for (let key in body) {
    formData.append(key, body[key]);
  }
  const res = await fetch(baseURL + "attendances/list-sheet-leaves-mix", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const attendanceData = await res.json();
  if (res.ok) {
    attendanceLoading.value = false;
    attendance.value = attendanceData.data.attendance_leave_days.data;

    pagination.currentPage =
      attendanceData.data.attendance_leave_days.current_page;
    pagination.lastPage = attendanceData.data.attendance_leave_days.last_page;
    pagination.perPage = attendanceData.data.attendance_leave_days.per_page;
    pagination.total = attendanceData.data.attendance_leave_days.total;

    return res;
  } else {
    attendanceLoading.value = false;
    throw {
      status: res.ok,
      code: res.status,
      message: attendanceData.msg,
    };
  }
}
listAllAttendance(filterAttendance);

async function listAllLeaves(body) {
  leavesLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  if (user.role.title === "Employee") {
    formData.append("employee_id", user.id);
    formData.append("created_to_id", user.id);
  }

  for (let key in body) {
    formData.append(key, body[key]);
  }
  const res = await fetch(baseURL + "times_off/index", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const leavesData = await res.json();
  if (res.ok) {
    leavesLoading.value = false;
    leavesAttendance.value = leavesData.data.data;
    leavesPagination.currentPage = leavesData.data.current_page;
    leavesPagination.lastPage = leavesData.data.last_page;
    leavesPagination.perPage = leavesData.data.per_page;
    leavesPagination.total = leavesData.data.total;

    return res;
  } else {
    leavesLoading.value = false;
    throw {
      status: res.ok,
      code: res.status,
      message: leavesData.msg,
    };
  }
}
listAllLeaves(filterAttendance);

async function listTimeSheetAttendance(body) {
  sheetsLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  if (user.role.title === "Employee") {
    formData.append("employee_id", user.id);
  }

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

async function clockHandler(type) {
  attendanceLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  formData.append("type", type);
  formData.append("location", address.value);

  formData.append("longitude", longitude.value);
  formData.append("latitude", latitude.value);

  const res = await fetch(baseURL + "attendances/store", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const attendanceData = await res.json();
  if (res.ok) {
    if (type == "in") {
      checkAction().then(() => {
        clockDate.value = checkData.value.clock_in;
        elapsedTime.value = 0;
      });
      toast.success("clocked in successfully");
    }
    listAllLeaves(filterAttendance);
    listAllAttendance(filterAttendance);
    listTimeSheetAttendance(filterAttendance);
    return res;
  } else {
    attendanceLoading.value = false;
    throw {
      status: res.ok,
      code: res.status,
      message: attendanceData.msg,
    };
  }
}

async function checkAction() {
  actionLoading.value = true;
  let formData = new FormData();
  formData.append("user_id", user.id);
  const res = await fetch(baseURL + "attendances/check-in-out", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const response = await res.json();
  if (res.ok) {
    actionLoading.value = false;
    checkData.value = response.data;
    return res;
  } else {
    actionLoading.value = false;
    throw {
      status: res.ok,
      code: res.status,
      message: response.msg,
    };
  }
}
checkAction();
const onRangeStart = (value) => {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formattedDate = formatDate(value);
  filterAttendance.date_from = formattedDate;
  form.choosed_date = formattedDate;
};
const onRangeEnd = (value) => {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formattedDate = formatDate(value);
  filterAttendance.date_to = formattedDate;
  listAllLeaves(filterAttendance);
  listAllAttendance(filterAttendance);
  listTimeSheetAttendance(filterAttendance);
};
function ClearFilter() {
  filterAttendance = {
    per_page: "10",
    date_from: "",
    date_to: "",
  };
  listAllLeaves(filterAttendance);
  listAllAttendance(filterAttendance);
  listTimeSheetAttendance(filterAttendance);
}
const onRangeEndRequest = (value) => {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formattedDate = formatDate(value);
  filterAttendance.date_to = formattedDate;
  form.end_date = formattedDate;
};

const formatTimeRequest = (date) => {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formattedDate = formatDate(date);
  form.choosed_date = formattedDate;
};
const selectedRequestTime = (value) => {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const formattedDate = formatDate(value);
  form.choosed_date = formattedDate;
};
async function addTimeOffHandler() {
  if (form.status === "") {
    toast.error("please choose a type");
  } else if (selectedType.value === 4 && form.hours === "") {
    toast.error("please add the number of the hours");
  } else if (form.choosed_date === "") {
    toast.error("please select the date");
  } else if (selectedType.value !== 4 && form.end_date === "") {
    toast.error("please select the end date date");
  } else if (form.reason === "") {
    toast.error("please add the reason");
  } else {
    addLoading.value = true;
    let formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("created_to_id", user.id);

    for (let key in form) {
      formData.append(key, form[key]);
    }
    const res = await fetch(baseURL + "times_off/store", {
      method: "POST",
      headers: {
        "Auth-Token": token,
      },
      body: formData,
      redirect: "follow",
    });
    const response = await res.json();
    if (res.ok) {
      addLoading.value = false;
      timeoffModal.value = false;
      requestData.value = response.model;
      listAllLeaves(filterAttendance);
      listAllAttendance(filterAttendance);
      listTimeSheetAttendance(filterAttendance);
      return res;
    } else {
      addLoading.value = false;
      throw {
        status: res.ok,
        code: res.status,
        message: response.msg,
      };
    }
  }
}
async function showTimeOff(id) {
  timeoffDetailsModal.value = true;
  timeoffDetailsLoading.value = true;

  let formData = new FormData();
  formData.append("user_id", user.id);
  formData.append("id", id);

  const res = await fetch(baseURL + "times_off/show", {
    method: "POST",
    headers: {
      "Auth-Token": token,
    },
    body: formData,
    redirect: "follow",
  });
  const response = await res.json();
  if (res.ok) {
    requestData.value = response.model;
    timeoffDetailsLoading.value = false;
    return res;
  } else {
    throw {
      status: res.ok,
      code: res.status,
      message: response.msg,
    };
  }
}

const presetDates = ref([
  { label: "Today", value: [new Date(), new Date()] },
  {
    label: "Yesterday",
    value: [subDays(new Date(), 1), new Date()],
  },
  {
    label: "This Week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
  },
  {
    label: "Last Week",
    value: [
      startOfWeek(subWeeks(new Date(), 1)),
      endOfWeek(subWeeks(new Date(), 1)),
    ],
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), endOfMonth(new Date())],
  },

  {
    label: "Last month",
    value: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  {
    label: "Reset",
    slot: "preset-date-range-button",
  },
]);
function filterViaDate() {
  onRangeStart(date.value[0]);
  onRangeEnd(date.value[1]);
}
function clearValue(v) {
  date.value = null;
}
var currentDate = new Date();

// Get the time string with AM/PM information
var timeString = currentDate.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});

// Extract the AM/PM part
var amOrPm = timeString.slice(-2);
</script>
<template>
  <div
    class="grid grid-cols-12 w-full items-start justify-center h-screen overflow-x-auto lg:overflow-x-clip"
  >
    <AppUserInfo :employeeData="employeeData" :loading="employeeLoading" />

    <div class="dashboard">
      <div
        v-if="
          checkData.clock_in === null ||
          (checkData.clock_in !== null && checkData.clock_out !== null)
        "
      >
        <p class="text-start font-semibold text-xl mt-4 mx-8">
          Good {{ amOrPm === "PM" ? "evening" : "morning" }}
          {{ employeeData.first_name }},
        </p>
        <p class="text-start font-normal text-sm mx-8 text-[#9D9B97] mb-3">
          Let's start a productive day!
        </p>
      </div>
      <div class="block lg:flex justify-between items-center mx-8 my-2">
        <div>
          <vue-date-picker
            v-model="date"
            range
            :preset-dates="presetDates"
            placeholder="Time period:"
            :enable-time-picker="false"
            ignore-time-validation
            auto-apply
            required
            :month-change-on-scroll="false"
            @range-start="onRangeStart"
            @range-end="onRangeEnd"
            @closed="filterViaDate"
            @cleared="ClearFilter"
          >
            <template #preset-date-range-button="{ label, value, presetDate }">
              <span
                class="text-primary font-primary font-medium lg:absolute bottom-0 my-4 mx-2"
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
        <!-- BUTTONS -->
        <div class="block lg:flex gap-2">
          <button
            v-if="
              (checkData.break_in === null ||
                (checkData.break_in !== null &&
                  checkData.break_out !== null)) &&
              checkData.clock_out === null &&
              checkData.clock_in !== null
            "
            class="bg-primary hover:bg-primary/90 whitespace-nowrap w-full my-5 lg:h-10 lg:my-0 text-white rounded-lg py-2 lg:px-9 font-primary font-medium text-base"
          >
            Break in
          </button>
          <button
            v-if="
              checkData.break_out === null &&
              checkData.break_in !== null &&
              checkData.clock_in !== null &&
              checkData.clock_out == null
            "
            class="bg-transparent hover:bg-transparent/5 whitespace-nowrap w-full my-5 lg:h-10 lg:my-0 text-white rounded-lg py-2 lg:px-9 font-primary font-medium text-base"
          >
            Break out
          </button>
          <button
            @click="openDialog"
            v-if="
              checkData.clock_in === null ||
              (checkData.clock_in !== null && checkData.clock_out !== null)
            "
            class="bg-primary hover:bg-primary/90 w-full whitespace-nowrap my-5 lg:h-10 lg:my-0 text-white rounded-lg py-2 lg:px-9 font-primary font-medium text-base"
          >
            Clock in
          </button>
          <button
            @click="clockoutActionModal = true"
            v-if="checkData.clock_out === null && checkData.clock_in !== null"
            class="bg-transparent hover:bg-transparent/5 whitespace-nowrap border border-[#444443] w-full my-5 lg:h-10 lg:my-0 text-[#171106] rounded-lg py-2 lg:px-9 font-primary font-medium text-base"
          >
            Clock out
          </button>
        </div>
      </div>
      <!-- user  timeline  details-->
      <div class="lg:flex justify-between items-center mx-8 my-2 mt-4">
        <div
          class="flex gap-2 py-2 lg:py-0 justify-center"
          v-if="checkData.clock_in !== null && checkData.clock_out === null"
        >
          <p
            class="font-normal text-base text-warning font-primary"
            v-if="
              checkData.break_out === null &&
              checkData.break_in !== null &&
              checkData.clock_in !== null &&
              checkData.clock_out == null
            "
          >
            You are in a break
          </p>
          <p
            class="font-normal text-base text-success font-primary"
            v-else-if="
              checkData.clock_out === null && checkData.clock_in !== null
            "
          >
            You are clocked in
          </p>

          <p class="font-normal text-base text-success" v-else>
            Clock in to start
          </p>

          <div class="border-l border-l-[#AEACA8] h-4 my-1"></div>
          <p class="font-medium text-xl text-[#171106]">
            {{
              checkData.clock_out === null && checkData.clock_in !== null
                ? formatTime(elapsedTime)
                : "00:00:00"
            }}
          </p>
        </div>
        <!--         <span
            class="sk-loader w-[20%] rounded-md"
            style="height: 20px"
         v-if="actionLoading"
          ></span> -->
        <div v-if="checkData.clock_in !== null && !actionLoading">
          <p class="text-sm font-primary text-[#9D9B97]">
            You've clocked in today at :
            {{
              new Date(checkData.clock_in)?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </p>
        </div>
        <div
          class="flex gap-2 items-center py-2 lg:py-0"
          v-if="checkData.clock_in !== null && !actionLoading"
        >
          <div class="w-2 h-2 bg-success rounded-sm"></div>
          <p
            class="font-normal text-[13px] lg:text-sm text-[#171106]"
            v-if="checkData.clock_out !== null"
          >
            Worktime:<span
              class="sk-loader w-4"
              style="height: 20px"
              v-if="sheetsLoading"
            ></span>
            {{ sheetAttendance[0].total_hours?sheetAttendance[0].total_hours + ' hrs':'0hrs' }}
          </p>
          <p class="font-normal text-[13px] lg:text-sm text-[#171106]" v-else>
            Worktime: {{ Math.floor(workTimeInMin / 60) }} hrs
          </p>
          <div class="border-l border-l-gray-500 h-4"></div>
          <div class="w-2 h-2 bg-warning rounded-sm"></div>
          <p
            class="font-normal text-[13px] lg:text-sm text-[#171106]"
            v-if="checkData.clock_in === null && checkData.clock_out === null"
          >
            Breaktime: 0 hrs
          </p>
          <p class="font-normal text-[13px] lg:text-sm text-[#171106]" v-else>
            Breaktime: {{ sheetAttendance[0]?.breaks_total_hours }} hrs
          </p>
          <div class="border-l border-l-gray-500 h-4"></div>
          <div class="w-2 h-2 bg-primary rounded-sm"></div>
          <p class="font-normal text-[13px] lg:text-sm text-[#171106]">
            Overtime: {{ Number((overTimeInMin / 60).toFixed(1)) }} hrs
          </p>
        </div>
      </div>

      <!-- user  progressbar -->
      <div
        v-if="checkData.clock_in !== null && checkData.clock_out === null"
        class="singleLog h-3 bg-success rounded-[2px] mx-8 mb-4"
      ></div>

      <div class="flex"></div>
      <div class="block lg:flex justify-between items-center mx-8 my-2">
        <div>
          <nav
            class="bg-[#E6E5E4] lg:h-10 lg:w-full items-center block lg:flex w-full rounded-lg px-[2px] py-[2px] my-2 gap-3"
          >
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              @click="activeTab = tab"
              :class="{
                'w-full border-transparent text-[#9D9B97] hover:text-gray-700 lg:w-[120px] ':
                  activeTab !== tab,
                'bg-white text-black font-normal text-sm lg:w-[120px] rounded-lg w-full':
                  activeTab === tab,
              }"
              class="w-1/4 py-2 px-1 text-center font-medium text-sm"
            >
              {{ tab }}
            </button>
          </nav>
        </div>
        <div>
          <button
            @click="
              resetForm();
              timeoffModal = true;
            "
            class="bg-transparent hover:bg-transparent/5 w-full my-5 lg:h-10 lg:my-0 border border-[#444443] text-[#171106] rounded-lg py-2 lg:px-9 font-primary font-medium text-base"
          >
            Add time off
          </button>
        </div>
      </div>

      <AppAttendanceAll
        v-if="activeTab === 'All'"
        :headers="headers"
        :data="attendance"
        :loading="attendanceLoading"
        :filterData="filterAttendance"
        @paginate="listAllAttendance"
        @clockinDetails="showClockinNoteHandler"
        @timeoffDetails="showTimeOff"
        :pagination="pagination"
        :perPageList="[5, 10, 15, 20, 30, 50]"
      />
      <AppAttendanceLeaves
        v-if="activeTab === 'Leaves'"
        :headers="headers"
        :data="leavesAttendance"
        :loading="leavesLoading"
        :filterData="filterAttendance"
        @paginate="listAllLeaves"
        @clockinDetails="showClockinNoteHandler"
        @timeoffDetails="showTimeOff"
        :pagination="leavesPagination"
        :perPageList="[5, 10, 15, 20, 30, 50]"
      />
      <AppAttendanceTimeSheet
        v-if="activeTab === 'Timesheets'"
        :headers="headers"
        :data="sheetAttendance"
        :loading="sheetsLoading"
        :filterData="filterAttendance"
        @paginate="listTimeSheetAttendance"
        @clockinDetails="showClockinNoteHandler"
        @timeoffDetails="showTimeOff"
        :pagination="pagination"
        :perPageList="[5, 10, 15, 20, 30, 50]"
      />
      <!-- Add time off -->
      <AppModal
        :is-open="timeoffModal"
        @close="timeoffModal = false"
        title="Add time off"
        confirm-text="Save"
        @confirm="addTimeOffHandler()"
        :loading="addLoading"
        :showActions="true"
      >
        <Form @submit="addTimeOffHandler" v-slot="{ errors }">
          <div class="info-section">
            <div class="flex gap-2">
              <div class="w-[30%]">
                <div class="flex gap-1 items-center">
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 7.5C0 7.69891 0.0790178 7.88968 0.21967 8.03033C0.360322 8.17098 0.551088 8.25 0.75 8.25H6.4425L4.7175 9.9675C4.6472 10.0372 4.59141 10.1202 4.55333 10.2116C4.51525 10.303 4.49565 10.401 4.49565 10.5C4.49565 10.599 4.51525 10.697 4.55333 10.7884C4.59141 10.8798 4.6472 10.9628 4.7175 11.0325C4.78722 11.1028 4.87017 11.1586 4.96157 11.1967C5.05296 11.2347 5.15099 11.2543 5.25 11.2543C5.34901 11.2543 5.44704 11.2347 5.53843 11.1967C5.62983 11.1586 5.71278 11.1028 5.7825 11.0325L8.7825 8.0325C8.85078 7.96117 8.9043 7.87706 8.94 7.785C9.01501 7.6024 9.01501 7.3976 8.94 7.215C8.9043 7.12294 8.85078 7.03883 8.7825 6.9675L5.7825 3.9675C5.71257 3.89757 5.62955 3.8421 5.53819 3.80426C5.44682 3.76641 5.34889 3.74693 5.25 3.74693C5.15111 3.74693 5.05318 3.76641 4.96181 3.80426C4.87045 3.8421 4.78743 3.89757 4.7175 3.9675C4.64757 4.03743 4.5921 4.12045 4.55426 4.21181C4.51641 4.30318 4.49693 4.40111 4.49693 4.5C4.49693 4.59889 4.51641 4.69682 4.55426 4.78819C4.5921 4.87955 4.64757 4.96257 4.7175 5.0325L6.4425 6.75H0.75C0.551088 6.75 0.360322 6.82902 0.21967 6.96967C0.0790178 7.11032 0 7.30109 0 7.5ZM9.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V4.5C0 4.69891 0.0790178 4.88968 0.21967 5.03033C0.360322 5.17098 0.551088 5.25 0.75 5.25C0.948912 5.25 1.13968 5.17098 1.28033 5.03033C1.42098 4.88968 1.5 4.69891 1.5 4.5V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H9.75C9.94891 1.5 10.1397 1.57902 10.2803 1.71967C10.421 1.86032 10.5 2.05109 10.5 2.25V12.75C10.5 12.9489 10.421 13.1397 10.2803 13.2803C10.1397 13.421 9.94891 13.5 9.75 13.5H2.25C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V10.5C1.5 10.3011 1.42098 10.1103 1.28033 9.96967C1.13968 9.82902 0.948912 9.75 0.75 9.75C0.551088 9.75 0.360322 9.82902 0.21967 9.96967C0.0790178 10.1103 0 10.3011 0 10.5V12.75C0 13.3467 0.237053 13.919 0.65901 14.341C1.08097 14.7629 1.65326 15 2.25 15H9.75C10.3467 15 10.919 14.7629 11.341 14.341C11.7629 13.919 12 13.3467 12 12.75V2.25C12 1.65326 11.7629 1.08097 11.341 0.65901C10.919 0.237053 10.3467 0 9.75 0Z"
                      fill="#9D9B97"
                    />
                  </svg>

                  <p class="label">Time off type</p>
                </div>
              </div>
              <div class="w-[70%]">
                <div class="grid grid-cols-2 gap-4 pb-4">
                  <div v-for="(item, index) in types">
                    <button
                      :key="index"
                      type="button"
                      class="types"
                      :class="
                        index + 1 === selectedType
                          ? '  border-primary !rounded-lg !bg-primary/10 !font-primary flex items-center gap-2'
                          : '!rounded-lg'
                      "
                      @click="selectType(item)"
                    >
                      {{ item.name }}
                      <svg
                        v-if="index + 1 === selectedType"
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.5348 11.8039C5.38472 11.8041 5.23609 11.7746 5.09745 11.7171C4.95881 11.6597 4.83289 11.5754 4.72693 11.4691L0.339283 7.0815C0.232192 6.97563 0.147087 6.84963 0.0888613 6.71075C0.0306355 6.57188 0.000437885 6.42286 4.72703e-06 6.27227C-0.000428431 6.12168 0.0289116 5.9725 0.0863375 5.83329C0.143763 5.69408 0.228142 5.56759 0.334622 5.46111C0.441101 5.35462 0.567581 5.27024 0.706787 5.21281C0.845994 5.15537 0.995181 5.12603 1.14577 5.12645C1.29636 5.12688 1.44538 5.15707 1.58425 5.21529C1.72313 5.27351 1.84913 5.3586 1.95501 5.46569L5.5348 9.04543L14.0513 0.529025C14.2657 0.315495 14.5561 0.195753 14.8587 0.196076C15.1613 0.196399 15.4514 0.316761 15.6654 0.530749C15.8794 0.744737 15.9997 1.03487 16 1.33748C16.0003 1.64009 15.8805 1.93047 15.667 2.14488L6.34267 11.4692C6.2367 11.5755 6.11078 11.6597 5.97214 11.7172C5.83349 11.7746 5.68487 11.8041 5.5348 11.8039Z"
                          fill="#0095FF"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-2" v-if="selectedType === 4">
              <div class="w-[30%]">
                <div class="flex gap-1 items-center">
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2.9C5.9212 2.89998 5.84317 2.91548 5.77037 2.94563C5.69756 2.97578 5.63141 3.01997 5.57569 3.07569C5.51997 3.13141 5.47578 3.19756 5.44563 3.27037C5.41549 3.34317 5.39998 3.4212 5.4 3.5V6.13027L3.94161 6.86416C3.87124 6.89955 3.80853 6.94846 3.75706 7.00809C3.7056 7.06772 3.66638 7.1369 3.64165 7.21169C3.61692 7.28647 3.60717 7.3654 3.61294 7.44395C3.61871 7.52251 3.6399 7.59916 3.67529 7.66953C3.71069 7.7399 3.7596 7.8026 3.81923 7.85407C3.87885 7.90554 3.94804 7.94475 4.02282 7.96948C4.09761 7.99421 4.17653 8.00397 4.25509 7.9982C4.33365 7.99242 4.4103 7.97124 4.48066 7.93584L6.26953 7.03584C6.3689 6.98597 6.45244 6.90944 6.5108 6.81481C6.56916 6.72018 6.60005 6.61118 6.6 6.5V3.5C6.60002 3.4212 6.58452 3.34317 6.55437 3.27037C6.52423 3.19756 6.48003 3.13141 6.42431 3.07569C6.36859 3.01997 6.30244 2.97578 6.22964 2.94563C6.15683 2.91548 6.0788 2.89998 6 2.9ZM6 0.5C4.81331 0.5 3.65328 0.851894 2.66658 1.51118C1.67989 2.17047 0.910851 3.10754 0.456725 4.2039C0.0025997 5.30026 -0.11622 6.50665 0.115291 7.67054C0.346802 8.83443 0.918247 9.90352 1.75736 10.7426C2.59648 11.5818 3.66557 12.1532 4.82946 12.3847C5.99335 12.6162 7.19975 12.4974 8.2961 12.0433C9.39246 11.5892 10.3295 10.8201 10.9888 9.83342C11.6481 8.84673 12 7.68669 12 6.5C11.9982 4.90926 11.3655 3.38419 10.2406 2.25937C9.11581 1.13455 7.59074 0.50182 6 0.5ZM6 11.3C5.05065 11.3 4.12262 11.0185 3.33326 10.4911C2.54391 9.96362 1.92868 9.21396 1.56538 8.33688C1.20208 7.45979 1.10702 6.49467 1.29223 5.56357C1.47744 4.63246 1.9346 3.77718 2.60589 3.10589C3.27718 2.4346 4.13246 1.97744 5.06357 1.79223C5.99468 1.60702 6.9598 1.70208 7.83688 2.06538C8.71397 2.42868 9.46362 3.04391 9.99105 3.83326C10.5185 4.62262 10.8 5.55065 10.8 6.5C10.7985 7.77259 10.2924 8.99264 9.3925 9.8925C8.49265 10.7924 7.27259 11.2985 6 11.3Z"
                      fill="#9D9B97"
                    />
                  </svg>

                  <p class="label">Time off Hours*</p>
                </div>
              </div>
              <div class="w-[70%]">
                <div
                  class="input-div"
                  :class="{ '!border-red-500 !mb-0': errors.hours }"
                >
                  <Field
                    type="number"
                    class="add-input"
                    placeholder="Enter number of hours"
                    v-model.trim="form.hours"
                    rules="required"
                    name="hours"
                    inputmode="numeric"
                    maxlength="4"
                  />
                </div>
                <ErrorMessage
                  class="text-sm text-red-600 capitalize"
                  name="hours"
                />
              </div>
            </div>
            <hr />
            <div class="flex gap-2 py-4 w-full">
              <div class="w-[30%]">
                <div class="flex gap-1 items-center">
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 7.70006C6.11867 7.70006 6.23467 7.66487 6.33334 7.59894C6.43201 7.53301 6.50892 7.43931 6.55433 7.32967C6.59974 7.22004 6.61162 7.0994 6.58847 6.98301C6.56532 6.86662 6.50818 6.75971 6.42426 6.6758C6.34035 6.59189 6.23344 6.53474 6.11705 6.51159C6.00067 6.48844 5.88003 6.50032 5.77039 6.54573C5.66075 6.59115 5.56705 6.66805 5.50112 6.76672C5.43519 6.86539 5.4 6.98139 5.4 7.10006C5.4 7.25919 5.46321 7.4118 5.57574 7.52433C5.68826 7.63685 5.84087 7.70006 6 7.70006ZM9 7.70006C9.11867 7.70006 9.23467 7.66487 9.33334 7.59894C9.43201 7.53301 9.50892 7.43931 9.55433 7.32967C9.59974 7.22004 9.61162 7.0994 9.58847 6.98301C9.56532 6.86662 9.50818 6.75971 9.42426 6.6758C9.34035 6.59189 9.23344 6.53474 9.11705 6.51159C9.00067 6.48844 8.88003 6.50032 8.77039 6.54573C8.66076 6.59115 8.56705 6.66805 8.50112 6.76672C8.43519 6.86539 8.4 6.98139 8.4 7.10006C8.4 7.25919 8.46321 7.4118 8.57574 7.52433C8.68826 7.63685 8.84087 7.70006 9 7.70006ZM6 10.1001C6.11867 10.1001 6.23467 10.0649 6.33334 9.99894C6.43201 9.93301 6.50892 9.83931 6.55433 9.72967C6.59974 9.62004 6.61162 9.4994 6.58847 9.38301C6.56532 9.26662 6.50818 9.15971 6.42426 9.0758C6.34035 8.99189 6.23344 8.93474 6.11705 8.91159C6.00067 8.88844 5.88003 8.90032 5.77039 8.94573C5.66075 8.99115 5.56705 9.06805 5.50112 9.16672C5.43519 9.26539 5.4 9.38139 5.4 9.50006C5.4 9.65919 5.46321 9.8118 5.57574 9.92433C5.68826 10.0368 5.84087 10.1001 6 10.1001ZM9 10.1001C9.11867 10.1001 9.23467 10.0649 9.33334 9.99894C9.43201 9.93301 9.50892 9.83931 9.55433 9.72967C9.59974 9.62004 9.61162 9.4994 9.58847 9.38301C9.56532 9.26662 9.50818 9.15971 9.42426 9.0758C9.34035 8.99189 9.23344 8.93474 9.11705 8.91159C9.00067 8.88844 8.88003 8.90032 8.77039 8.94573C8.66076 8.99115 8.56705 9.06805 8.50112 9.16672C8.43519 9.26539 8.4 9.38139 8.4 9.50006C8.4 9.65919 8.46321 9.8118 8.57574 9.92433C8.68826 10.0368 8.84087 10.1001 9 10.1001ZM3 7.70006C3.11867 7.70006 3.23467 7.66487 3.33334 7.59894C3.43201 7.53301 3.50892 7.43931 3.55433 7.32967C3.59974 7.22004 3.61162 7.0994 3.58847 6.98301C3.56532 6.86662 3.50818 6.75971 3.42426 6.6758C3.34035 6.59189 3.23344 6.53474 3.11705 6.51159C3.00067 6.48844 2.88003 6.50032 2.77039 6.54573C2.66075 6.59115 2.56705 6.66805 2.50112 6.76672C2.43519 6.86539 2.4 6.98139 2.4 7.10006C2.4 7.25919 2.46321 7.4118 2.57574 7.52433C2.68826 7.63685 2.84087 7.70006 3 7.70006ZM10.2 1.70006H9.6V1.10006C9.6 0.940931 9.53679 0.788319 9.42426 0.675797C9.31174 0.563275 9.15913 0.500061 9 0.500061C8.84087 0.500061 8.68826 0.563275 8.57574 0.675797C8.46321 0.788319 8.4 0.940931 8.4 1.10006V1.70006H3.6V1.10006C3.6 0.940931 3.53679 0.788319 3.42426 0.675797C3.31174 0.563275 3.15913 0.500061 3 0.500061C2.84087 0.500061 2.68826 0.563275 2.57574 0.675797C2.46321 0.788319 2.4 0.940931 2.4 1.10006V1.70006H1.8C1.32261 1.70006 0.864773 1.8897 0.527208 2.22727C0.189642 2.56483 0 3.02267 0 3.50006V10.7001C0 11.1775 0.189642 11.6353 0.527208 11.9729C0.864773 12.3104 1.32261 12.5001 1.8 12.5001H10.2C10.6774 12.5001 11.1352 12.3104 11.4728 11.9729C11.8104 11.6353 12 11.1775 12 10.7001V3.50006C12 3.02267 11.8104 2.56483 11.4728 2.22727C11.1352 1.8897 10.6774 1.70006 10.2 1.70006ZM10.8 10.7001C10.8 10.8592 10.7368 11.0118 10.6243 11.1243C10.5117 11.2368 10.3591 11.3001 10.2 11.3001H1.8C1.64087 11.3001 1.48826 11.2368 1.37574 11.1243C1.26321 11.0118 1.2 10.8592 1.2 10.7001V5.30006H10.8V10.7001ZM10.8 4.10006H1.2V3.50006C1.2 3.34093 1.26321 3.18832 1.37574 3.0758C1.48826 2.96328 1.64087 2.90006 1.8 2.90006H10.2C10.3591 2.90006 10.5117 2.96328 10.6243 3.0758C10.7368 3.18832 10.8 3.34093 10.8 3.50006V4.10006ZM3 10.1001C3.11867 10.1001 3.23467 10.0649 3.33334 9.99894C3.43201 9.93301 3.50892 9.83931 3.55433 9.72967C3.59974 9.62004 3.61162 9.4994 3.58847 9.38301C3.56532 9.26662 3.50818 9.15971 3.42426 9.0758C3.34035 8.99189 3.23344 8.93474 3.11705 8.91159C3.00067 8.88844 2.88003 8.90032 2.77039 8.94573C2.66075 8.99115 2.56705 9.06805 2.50112 9.16672C2.43519 9.26539 2.4 9.38139 2.4 9.50006C2.4 9.65919 2.46321 9.8118 2.57574 9.92433C2.68826 10.0368 2.84087 10.1001 3 10.1001Z"
                      fill="#9D9B97"
                    />
                  </svg>

                  <p class="label">Start - time off</p>
                </div>
              </div>
              <div class="w-[70%]">
                <div v-if="selectedType !== 4">
                  <vue-date-picker
                    v-model="timeoffDate"
                    :enable-time-picker="false"
                    ignore-time-validation
                    inline
                    auto-apply
                    :month-change-on-scroll="false"
                    range
                    @range-start="onRangeStart"
                    @range-end="onRangeEndRequest"
                    disable-time-range-validation
                  />
                </div>
                <div v-else>
                  <vue-date-picker
                    v-model="timeofftime"
                    :enable-time-picker="false"
                    ignore-time-validation
                    inline
                    auto-apply
                    :format="formatTimeRequest"
                    @range-start="selectedRequestTime"
                    :month-change-on-scroll="false"
                  />
                </div>
                <div class="w-full pt-3" v-if="selectedType !== 4">
                  <div class="flex w-full items-center">
                    <div class="w-full pb-2">
                      <div
                        class="border border-primary w-8 rounded-full mt-2"
                      ></div>
                      <p
                        class="font-primary font-light text-[#6E7A84] text-[13px]"
                      >
                        Time off date
                      </p>
                      <div v-if="selectedType !== 4">
                        <p v-if="form.end_date > form.choosed_date">
                          {{ form.choosed_date }} To {{ form.end_date }}
                        </p>
                        <p v-else>
                          {{ form.end_date }} {{ form.end_date ? "To" : "-" }}
                          {{ form.choosed_date }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="w-full">
                    <div
                      class="border border-primary w-8 rounded-full mt-2"
                    ></div>
                    <p
                      class="font-primary font-light text-[#6E7A84] text-[13px]"
                    >
                      Duration
                    </p>
                    <div>
                      <p
                        v-if="
                          Math.floor(
                            (new Date(form.end_date) -
                              new Date(form.choosed_date)) /
                              (24 * 60 * 60 * 1000) +
                              1
                          ) >= 0
                        "
                      >
                        {{
                          form.end_date
                            ? Math.floor(
                                (new Date(form.end_date) -
                                  new Date(form.choosed_date)) /
                                  (24 * 60 * 60 * 1000) +
                                  1
                              ) + " days"
                            : "-"
                        }}
                      </p>
                      <p v-else>
                        {{
                          form.end_date
                            ? Math.abs(
                                Math.floor(
                                  (new Date(form.end_date) -
                                    new Date(form.choosed_date)) /
                                    (24 * 60 * 60 * 1000) -
                                    1
                                )
                              ) + " days"
                            : "-"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="w-full pb-2" v-else>
                  <div
                    class="border border-primary w-8 rounded-full mt-2"
                  ></div>
                  <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                    Time off date
                  </p>
                  <div>
                    <p>
                      {{
                        timeofftime === ""
                          ? moment(Date.now()).format("L")
                          : moment(timeofftime).format("L")
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div class="flex gap-2 py-4">
              <div class="w-[30%]">
                <div class="flex gap-1 items-center">
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 9.00012H3.75C3.55109 9.00012 3.36032 9.07914 3.21967 9.21979C3.07902 9.36044 3 9.55121 3 9.75012C3 9.94903 3.07902 10.1398 3.21967 10.2805C3.36032 10.4211 3.55109 10.5001 3.75 10.5001H8.25C8.44891 10.5001 8.63968 10.4211 8.78033 10.2805C8.92098 10.1398 9 9.94903 9 9.75012C9 9.55121 8.92098 9.36044 8.78033 9.21979C8.63968 9.07914 8.44891 9.00012 8.25 9.00012ZM8.25 6.00012H5.25C5.05109 6.00012 4.86032 6.07914 4.71967 6.21979C4.57902 6.36044 4.5 6.55121 4.5 6.75012C4.5 6.94903 4.57902 7.1398 4.71967 7.28045C4.86032 7.4211 5.05109 7.50012 5.25 7.50012H8.25C8.44891 7.50012 8.63968 7.4211 8.78033 7.28045C8.92098 7.1398 9 6.94903 9 6.75012C9 6.55121 8.92098 6.36044 8.78033 6.21979C8.63968 6.07914 8.44891 6.00012 8.25 6.00012ZM9.75 1.50012H8.865C8.71027 1.06246 8.42395 0.683371 8.0453 0.414826C7.66665 0.146281 7.21421 0.0014267 6.75 0.00012207H5.25C4.78579 0.0014267 4.33335 0.146281 3.9547 0.414826C3.57605 0.683371 3.28974 1.06246 3.135 1.50012H2.25C1.65326 1.50012 1.08097 1.73717 0.65901 2.15913C0.237053 2.58109 0 3.15338 0 3.75012V12.7501C0 13.3469 0.237053 13.9192 0.65901 14.3411C1.08097 14.7631 1.65326 15.0001 2.25 15.0001H9.75C10.3467 15.0001 10.919 14.7631 11.341 14.3411C11.7629 13.9192 12 13.3469 12 12.7501V3.75012C12 3.15338 11.7629 2.58109 11.341 2.15913C10.919 1.73717 10.3467 1.50012 9.75 1.50012ZM4.5 2.25012C4.5 2.05121 4.57902 1.86044 4.71967 1.71979C4.86032 1.57914 5.05109 1.50012 5.25 1.50012H6.75C6.94891 1.50012 7.13968 1.57914 7.28033 1.71979C7.42098 1.86044 7.5 2.05121 7.5 2.25012V3.00012H4.5V2.25012ZM10.5 12.7501C10.5 12.949 10.421 13.1398 10.2803 13.2805C10.1397 13.4211 9.94891 13.5001 9.75 13.5001H2.25C2.05109 13.5001 1.86032 13.4211 1.71967 13.2805C1.57902 13.1398 1.5 12.949 1.5 12.7501V3.75012C1.5 3.55121 1.57902 3.36044 1.71967 3.21979C1.86032 3.07914 2.05109 3.00012 2.25 3.00012H3V3.75012C3 3.94903 3.07902 4.1398 3.21967 4.28045C3.36032 4.4211 3.55109 4.50012 3.75 4.50012H8.25C8.44891 4.50012 8.63968 4.4211 8.78033 4.28045C8.92098 4.1398 9 3.94903 9 3.75012V3.00012H9.75C9.94891 3.00012 10.1397 3.07914 10.2803 3.21979C10.421 3.36044 10.5 3.55121 10.5 3.75012V12.7501Z"
                      fill="#9D9B97"
                    />
                  </svg>

                  <p class="label">Time off Reason</p>
                </div>
              </div>
              <div class="w-[70%]">
                <div
                  class="input-div"
                  :class="{ '!border-red-500 !mb-0': errors.reason }"
                >
                  <Field name="reason" rules="required">
                    <textarea
                      v-model.trim="form.reason"
                      placeholder="Enter Time off reason"
                      rows="4"
                      cols="30"
                      class="add-input !h-24 p-3 outline-none"
                      name="reason"
                    />
                  </Field>
                </div>
                <ErrorMessage
                  class="text-sm text-red-600 capitalize"
                  name="reason"
                />
              </div>
            </div>
          </div>
          <button ref="formSubmit" class="hidden"></button>
        </Form>
      </AppModal>
      <!-- Clock in details -->
      <AppModal
        :is-open="clockinDetailsModal"
        @close="clockinDetailsModal = false"
        title="Clock in details"
        :hideActions="true"
      >
        <Form>
          <div class="info-section">
            <div
              class="flex justify-between bg-[#F7F7F6] px-4 py-4 items-center mt-5 rounded-lg"
            >
              <div class="flex gap-2 items-center">
                <img
                  :src="clockinData.user?.image"
                  alt=""
                  class="w-12 h-12 rounded-full"
                />
                <div>
                  <p class="font-primary text-base font-medium text-[#171106]">
                    {{ clockinData.user?.first_name }}
                    {{ clockinData.user?.last_name }}
                  </p>
                  <p class="font-primary text-[13px] font-light text-[#6E7A84]">
                    {{ clockinData.user?.job_title }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex w-full items-start px-2 pt-5">
              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Date
                </p>
                <div class="">
                  <p class="font-medium font-primary text-sm text-[#171106]">
                    {{ moment(clockinData.clock_in).format("MMM Do YYYY") }}
                  </p>
                </div>

                <div class="border border-primary w-8 rounded-full mt-6"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Location
                </p>
                <div>
                  <p class="font-medium font-primary text-sm text-[#171106]">
                    {{
                      clockinData.location === "null"
                        ? "-"
                        : clockinData.location
                    }}
                  </p>
                </div>
              </div>

              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Time
                </p>
                <p class="font-medium font-primary text-sm text-[#171106]">
                  {{ moment(clockinData.clock_in).format("LT") }}
                </p>
              </div>
            </div>
          </div>
          <button ref="formSubmit" class="hidden"></button>
        </Form>
      </AppModal>
      <!-- Time off details -->
      <AppModal
        :is-open="timeoffDetailsModal"
        @close="timeoffDetailsModal = false"
        title="Time off details"
      >
        <Form>
          <div class="info-section">
            <div
              class="flex justify-between -2 px-4 bg-[#F7F7F6] rounded-lg py-4 items-center mt-5"
            >
              <div class="flex gap-2 items-center">
                <span
                  class="sk-loader w-12 h-12 !rounded-full"
                  v-if="timeoffDetailsLoading"
                ></span>
                <img
                  v-if="!timeoffDetailsLoading"
                  :src="requestData.created_by?.image"
                  alt=""
                  class="w-12 h-12 rounded-full"
                />

                <div>
                  <span
                    v-if="timeoffDetailsLoading"
                    class="sk-loader w-full rounded-md h-5"
                  ></span>
                  <span
                    v-if="timeoffDetailsLoading"
                    class="sk-loader w-full rounded-md h-5"
                  ></span>
                  <p
                    v-if="!timeoffDetailsLoading"
                    class="font-primary text-base font-medium text-[#171106]"
                  >
                    {{ requestData.created_by?.first_name }}
                    {{ requestData.created_by?.last_name }}
                  </p>
                  <p
                    v-if="!timeoffDetailsLoading"
                    class="font-primary text-[13px] font-light text-[#6E7A84]"
                  >
                    {{ requestData.created_by?.job_title }}
                  </p>
                </div>
              </div>
              <div
                class="flex gap-2 items-center rounded-full bg-warning/10 px-4 h-8"
              >
                <div
                  :class="
                    requestData.approval_status == 'approved'
                      ? 'bg-primary'
                      : requestData.approval_status === 'rejected'
                      ? 'bg-danger'
                      : requestData.approval_status == 'pending'
                      ? 'bg-warning'
                      : null
                  "
                  class="w-2 h-2 rounded-full"
                ></div>
                <p class="text-warning text-sm capitalize font-semibold">
                  {{ requestData.approval_status }}
                </p>
              </div>
            </div>
            <div class="flex w-full items-start px-2 pt-5">
              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Time off type
                </p>
                <div class="">
                  <span
                    class="sk-loader w-20 !h-5"
                    v-if="timeoffDetailsLoading"
                  ></span>
                  <p
                    v-if="!timeoffDetailsLoading"
                    class="font-medium font-primary text-sm text-[#171106]"
                  >
                    {{ requestData.status }}
                  </p>
                </div>

                <div class="border border-primary w-8 rounded-full mt-6"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Duration
                </p>
                <div>
                  <span
                    class="sk-loader w-20 !h-5"
                    v-if="timeoffDetailsLoading"
                  ></span>
                  <p
                    class="font-medium font-primary text-sm text-[#171106]"
                    v-if="
                      requestData.status !== 'hours' && !timeoffDetailsLoading
                    "
                  >
                    {{ requestData.duration }} days
                  </p>
                  <p
                    class="font-medium font-primary text-sm text-[#171106]"
                    v-if="
                      requestData.status === 'hours' && !timeoffDetailsLoading
                    "
                  >
                    {{ requestData.hours }} hours
                  </p>
                </div>
              </div>

              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Time off date
                </p>
                <span
                  class="sk-loader w-20 !h-5"
                  v-if="timeoffDetailsLoading"
                ></span>
                <p
                  v-if="!timeoffDetailsLoading"
                  class="font-medium font-primary text-sm text-[#171106]"
                >
                  {{
                    requestData.choosed_date === null
                      ? "-"
                      : moment(requestData.choosed_date).format("MMM Do YYYY")
                  }}
                  {{ requestData.status !== "hours" ? "-" : null }}
                  {{
                    requestData.end_date === null
                      ? ""
                      : moment(requestData.end_date).format("MMM Do YYYY")
                  }}
                </p>

                <template v-if="requestData.status == 'hours'">
                  <div
                    class="border border-primary w-8 rounded-full mt-6"
                  ></div>
                  <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                    Remaining hours
                  </p>
                  <span
                    class="sk-loader w-20 !h-5"
                    v-if="timeoffDetailsLoading"
                  ></span>
                  <p
                    v-if="!timeoffDetailsLoading"
                    class="font-medium font-primary text-sm text-[#171106]"
                  >
                    {{ requestData.used_hours_this_month }} hours
                  </p>
                </template>
              </div>
            </div>

            <div class="block bg-[#F7F7F6] rounded-lg px-4 py-4 mt-8">
              <p class="font-primary text-base font-medium text-[#171106]">
                Time off reason
              </p>
              <span
                class="sk-loader w-20 !h-5"
                v-if="timeoffDetailsLoading"
              ></span>
              <p
                v-if="!timeoffDetailsLoading"
                class="font-primary text-[13px] font-light text-[#6E7A84]"
              >
                {{ requestData.reason }}
              </p>
            </div>
          </div>
          <button ref="formSubmit" class="hidden"></button>
        </Form>
      </AppModal>
      <!-- Clock in action -->
      <AppModal
        :is-open="clockinActionModal"
        @close="clockinActionModal = false"
        title="Clock in"
        confirm-text="Clock in"
        :loading="addLoading"
        @confirm="clockHandler('in')"
        :showActions="true"
      >
        <Form>
          <div class="info-section">
            <div
              class="flex justify-between bg-[#F7F7F6] px-4 py-4 items-center mt-5 rounded-lg"
            >
              <div class="flex gap-2 items-center">
                <img
                  :src="employeeData?.image"
                  alt=""
                  class="w-12 h-12 rounded-full"
                />
                <div>
                  <p class="font-primary text-base font-medium text-[#171106]">
                    {{ employeeData?.first_name }}
                    {{ employeeData?.last_name }}
                  </p>
                  <p class="font-primary text-[13px] font-light text-[#6E7A84]">
                    {{ employeeData?.job_title }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex w-full items-start px-2 pt-5">
              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Date
                </p>
                <div class="">
                  <p class="font-primary text-sm text-[#171106] font-medium">
                    {{ moment(Date.now()).format("MMM Do YYYY") }}
                  </p>
                </div>
              </div>

              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Time
                </p>
                <p class="font-medium font-primary text-sm text-[#171106]">
                  {{ moment(clockinData.clock_in).format("LT") }}
                </p>
              </div>
            </div>
            <div class="px-2 pt-5">
              <div class="border border-primary w-8 rounded-full mt-6"></div>
              <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                Location
              </p>
              <div class="!w-full">
                <p class="font-medium font-primary text-sm text-[#171106]">
                  {{ address }}
                </p>
              </div>
            </div>
          </div>
          <button ref="formSubmit" class="hidden"></button>
        </Form>
      </AppModal>
      <!-- Clock out action -->
      <AppModal
        :is-open="clockoutActionModal"
        @close="clockoutActionModal = false"
        title="Clock out"
        confirm-text="Clock out"
        :loading="addLoading"
        @confirm="clockHandler('out')"
        :showActions="true"
      >
        <Form>
          <div class="info-section">
            <div
              class="flex justify-between bg-[#F7F7F6] px-2 py-4 items-center mt-5 rounded-lg"
            >
              <div class="flex gap-2 items-center">
                <img
                  :src="employeeData?.image"
                  alt=""
                  class="w-12 h-12 rounded-full"
                />
                <div>
                  <p class="font-primary text-base font-medium text-[#171106]">
                    {{ employeeData?.first_name }}
                    {{ employeeData?.last_name }}
                  </p>
                  <p class="font-primary text-[13px] font-light text-[#6E7A84]">
                    {{ employeeData?.job_title }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex w-full items-start px-2 pt-5">
              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Date
                </p>
                <div class="">
                  <p class="font-medium font-primary text-sm text-[#171106]">
                    {{ moment(Date.now()).format("MMM Do YYYY") }}
                  </p>
                </div>

                <div class="border border-primary w-8 rounded-full mt-6"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Location
                </p>
                <div>
                  <p class="font-medium font-primary text-sm text-[#171106]">
                    {{ address }}
                  </p>
                </div>
              </div>

              <div class="w-1/2">
                <div class="border border-primary w-8 rounded-full mt-2"></div>
                <p class="font-primary font-light text-[#6E7A84] text-[13px]">
                  Time
                </p>
                <p class="font-medium font-primary text-sm text-[#171106]">
                  {{ moment(clockinData.clock_in).format("LT") }}
                </p>
              </div>
            </div>
            <div
              class="rounded-sm bg-[#FCEDE9] pt-4 pb-10 w-full items-start px-2 mt-7"
            >
              <p class="text-[#CB4321] font-medium text-base px-2">Warning</p>
              <p class="text-[#CB4321] font-normal text-[13px] px-2">
                Once you Clock out you won't be able to Clock in today again, if
                you already want to Clock out click the Clock out button below.
              </p>
            </div>
          </div>
          <button ref="formSubmit" class="hidden"></button>
        </Form>
      </AppModal>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  @apply col-span-12 lg:col-span-10 bg-white  lg:h-screen pt-7 !justify-center px-6 lg:px-0;
}
.info-section {
  @apply bg-white   h-fit py-4 mb-5 w-full;
}

.add-input {
  @apply w-full bg-transparent pl-0 outline-none border-none h-8 !rounded-lg;
}
.input-div {
  @apply bg-white  flex items-center border  px-3 rounded-lg border-[#E6E5E4] mb-4;
}
.date-input {
  @apply w-full bg-[#F3F3F2] pl-0 outline-none border-none h-7;
}
.types {
  @apply flex justify-center border w-full py-1 hover:bg-transparent/5 bg-white;
}
.label {
  @apply font-primary text-[#171106] text-sm my-1 font-normal;
}
.date-div {
  @apply bg-[#F3F3F2] border-l-primary border-l-2 flex gap-2 items-center border  px-3 w-full rounded-lg border-[#E6E5E4] mb-4;
}
</style>
