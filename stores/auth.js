export const useUserStore = defineStore("auth", () => {
  const baseURL = useRuntimeConfig().public.apiBase;
  const user = ref(useCookie("user"));
  const userInformation = ref({});
  const showMessage = ref("");
  const userLoading = ref(false);
  const dataLoading = ref(false);
  const token = computed(() => user.value && user.value.token);
  const isAuthenticated = computed(() => (user.value ? true : false));

  async function signIn(email, password) {
    userLoading.value = true;
    let formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await fetch(baseURL + "auth/login", {
      method: "POST",
      body: formData,
      redirect: 'follow'
    });
    const userData = await res.json();
    if (res.ok) {
      userLoading.value = false;
      user.value = userData.model;
      return res;
    } else {
      userLoading.value = false;
      throw {
        status: res.ok,
        code: res.code,
        message: userData.msg,
      };
    }
  }

  async function forgotPassword(email) {
    userLoading.value = true;
    showMessage.value = false;
    let formData = new FormData();
    formData.append("email", email);

    const res = await fetch(baseURL + "auth/password_reset_request", {
      method: "POST",
      body: formData,
      redirect: 'follow'
    });
    const responseData = await res.json();

    if (res.ok) {
      userLoading.value = false;
      showMessage.value = true;
      user.value = responseData;
      return res;
    } else {
      userLoading.value = false;
      showMessage.value = false;
      throw {
        status: res.ok,
        code: res.status,
        message: responseData.msg,
      };
    }
  }

  async function resetPassword(password, token) {
    userLoading.value = true;
    showMessage.value = false;
    let formData = new FormData();
    formData.append("password", password);
    formData.append("token", token);
    const res = await fetch(baseURL + "auth/password_reset", {
      method: "POST",
      redirect: 'follow',
      body: formData
    });
    const responseData = await res.json();
    if (res.ok) {
      userLoading.value = false;
      showMessage.value = true;
      user.value = responseData;
      return res;
    } else {
      userLoading.value = false;
      showMessage.value = false;
      throw {
        status: res.ok,
        code: res.status,
        message: responseData.msg,
      };
    }
  }



  async function userInfo() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token.value);
    const res = await fetch(baseURL + "oauth/me", {
      method: "GET",
      headers: myHeaders,
    });

    const responseData = await res.json();
    if (res.ok) {
      userInformation.value = responseData.data.account;
      return res;
    } else {
      userLoading.value = false;
      throw {
        status: res.ok,
        code: res.status,
        message: responseData.message,
      };
    }
  }

  async function signOut() {
    //isAuthenticated.value = false
    user.value = undefined;
    token.value = undefined
    location.href = "/login";
  }
  return {
    user,
    token,
    isAuthenticated,
    userInformation,
    userLoading,
    dataLoading,
    signIn,
    signOut,
    showMessage,
    forgotPassword,
    resetPassword,
    userInfo,
  };
});
