import { useUserStore } from "~/stores/auth";
export const useDropdownsStore = defineStore("dropdowns", () => {
   let baseURL = useRuntimeConfig().public.apiBase;
   const { user, token } = useUserStore();
   const rolesDropdowns = ref([]);
   const departmentsDropdowns = ref([]);
   const jobTypesDropdowns = ref([]);
   const avatarsDropdowns = ref([]);
   const employeesDropdown = ref([]);


   async function getDepartmentsDropdown() {
      let formData = new FormData();
      formData.append("user_id", user.id);
      const res = await fetch(baseURL + "dropdowns/departments", {
         method: "POST",
         headers: {
            "Auth-Token": token,
         },
         body: formData,
         redirect: "follow",
      });
      const departmentsData = await res.json();
      if (res.ok) {
         departmentsDropdowns.value = departmentsData;
         return res;
      } else {
         throw {
            status: res.ok,
            code: res.status,
            message: departmentsData.msg,
         };
      }
   }

   async function getRolesDropdown() {
      let formData = new FormData();
      formData.append("user_id", user.id);
      const res = await fetch(baseURL + "dropdowns/roles", {
         method: "POST",
         headers: {
            "Auth-Token": token,
         },
         body: formData,
         redirect: "follow",
      });
      const rolesData = await res.json();
      if (res.ok) {
         rolesDropdowns.value = rolesData;
         return res;
      } else {
         throw {
            status: res.ok,
            code: res.status,
            message: rolesData.msg,
         };
      }
   }

   async function getJobTypesDropdown() {
      let formData = new FormData();
      formData.append("user_id", user.id);
      const res = await fetch(baseURL + "dropdowns/job_types", {
         method: "POST",
         headers: {
            "Auth-Token": token,
         },
         body: formData,
         redirect: "follow",
      });
      const typesData = await res.json();
      if (res.ok) {
         jobTypesDropdowns.value = typesData;
         return res;
      } else {
         throw {
            status: res.ok,
            code: res.status,
            message: typesData.msg,
         };
      }
   }

   async function getAvatarsDropdown() {
      let formData = new FormData();
      formData.append("user_id", user.id);
      const res = await fetch(baseURL + "dropdowns/avatars", {
         method: "POST",
         headers: {
            "Auth-Token": token,
         },
         body: formData,
         redirect: "follow",
      });
      const avatarsData = await res.json();
      if (res.ok) {
         avatarsDropdowns.value = avatarsData;
         return res;
      } else {
         throw {
            status: res.ok,
            code: res.status,
            message: avatarsData.msg,
         };
      }
   }

   async function getEmployeesDropdown() {
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
         employeesDropdown.value = employeesData;
         return res;
      } else {
         throw {
            status: res.ok,
            code: res.status,
            message: employeesData.msg,
         };
      }
   }

   return {
      getDepartmentsDropdown,
      departmentsDropdowns,
      getJobTypesDropdown,
      jobTypesDropdowns,
      getRolesDropdown,
      rolesDropdowns,
      avatarsDropdowns,
      getAvatarsDropdown,
      getEmployeesDropdown,
      employeesDropdown
   };
});
