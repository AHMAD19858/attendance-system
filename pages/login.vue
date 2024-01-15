<script setup>
import { Field, Form, defineRule, ErrorMessage, configure } from "vee-validate";
import { required, email } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import { useUserStore } from "~/stores/auth";
const { signIn, signOut } = useUserStore();
const { userLoading, user, isAuthenticated } = storeToRefs(useUserStore());

defineRule("required", required);
defineRule("email", email);

configure({
  generateMessage: localize("en", {
    messages: {
      required: "The {field} is required",
    },
  }),
});
const formErr = ref("");
const loginSuccess = ref(false);
const showPw = ref(false);
const logins = reactive({
  email: "",
  password: "",
});

async function loginHandler() {
  signIn(logins.email, logins.password)
    .then((res) => {
      loginSuccess.value = true;
      if (user.value.role.title == "Manager") {
        location.href = "/app/dashboard";
      } else {
        location.href = "/app";
      }
      formErr.value = "";
    })
    .catch((err) => {
      formErr.value = err.message;
      loginSuccess.value = false;
      userLoading.value = false;
    });
}

async function logOut() {
  await signOut();
}
</script>

<template>
  <div class="screen-container">
    <div class="left-side">
      <div class="flex justify-start px-12 py-10">
        <img src="~/assets/images/logo.svg" alt="" class="" />
      </div>
      <div class="flex justify-start px-12">
        <p class="welcome_slogan">Welcome to Devsolutions Attendance system</p>
      </div>
      <img src="~/assets/images/finger.svg" alt="" class="fingerprint" />
    </div>
    <div class="right-side">
      <Form class="form-section" @submit="loginHandler" v-slot="{ errors }">
        <div class="mobile_logo">
          <img src="../assets/images/colored_logo.svg" alt="" />
        </div>

        <div class="mt-12" v-if="isAuthenticated">
          <h1 class="welcome-auth">Welcome back!</h1>
          <p class="sub-text-auth">Welcome back! Please enter your details</p>
        </div>
        <div class="mt-12" v-else>
          <h1 class="welcome">Welcome back!</h1>
          <p class="sub-text">Welcome back! Please enter your details</p>
        </div>
        <section v-if="isAuthenticated && !userLoading">
          <div
            class="flex gap-2 items-center p-3.5 justify-start text-dark font-bold hover:text-white bg-white border hover:bg-primary transition-all rounded-lg w-3/4"
          >
            <img :src="user.image" alt="" class="w-10" />

            <nuxt-link
              :to="user.role.title == 'Manager' ? '/app/dashboard' : '/app'"
              class=""
            >
              <span class="block text-lg font-medium font-primary"
                >{{ user.first_name }} {{ user.last_name }}
              </span>
              <span class="text-sm block font-normal"
                >Continue to dashboard</span
              >
            </nuxt-link>
          </div>
          <div class="flex justify-end items-center gap-1 w-3/4">
            <a
              href="javascript:void()"
              class="text-center text-sm mt-2"
              @click="logOut()"
            >
              Not {{ user.first_name }}?
            </a>
            <a
              href="javascript:void()"
              class="text-center text-sm mt-2 underline flex justify-end"
              @click="logOut()"
            >
              Log into another account
            </a>
          </div>
        </section>
        <div v-if="!isAuthenticated">
          <transition name="bounce">
            <div v-if="formErr" class="form-error">
              <p class="error-text">{{ formErr }}</p>
            </div>
          </transition>
          <p class="label">Email address *</p>
          <div>
            <Field
              :class="{ error: errors.email }"
              type="text"
              class="login-input"
              placeholder="Email address"
              v-model.trim="logins.email"
              rules="required|email"
              name="email"
            />
          </div>
          <ErrorMessage class="error-message" name="email" />
          <p class="label !mt-8">Password *</p>
          <div class="relative !mt-0">
            <Field
              :class="{ error: errors.password }"
              class="login-input"
              autocomplete="off"
              :type="showPw ? 'text' : 'password'"
              placeholder="Password"
              name="password"
              rules="required"
              v-model.trim="logins.password"
            />
            <div class="mb-0">
              <button
                class="absolute top-0 bottom-0 right-4"
                type="button"
                @click="showPw = !showPw"
              >
                <svg
                  v-if="showPw"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_357_398)">
                    <path
                      d="M15.514 6.27935C14.48 4.59535 12.128 1.77002 8.00003 1.77002C3.87203 1.77002 1.52003 4.59535 0.486034 6.27935C0.166386 6.79636 -0.00292969 7.39218 -0.00292969 8.00002C-0.00292969 8.60786 0.166386 9.20368 0.486034 9.72069C1.52003 11.4047 3.87203 14.23 8.00003 14.23C12.128 14.23 14.48 11.4047 15.514 9.72069C15.8337 9.20368 16.003 8.60786 16.003 8.00002C16.003 7.39218 15.8337 6.79636 15.514 6.27935ZM14.3774 9.02269C13.4894 10.4667 11.4794 12.8967 8.00003 12.8967C4.5207 12.8967 2.5107 10.4667 1.6227 9.02269C1.43279 8.71538 1.3322 8.36127 1.3322 8.00002C1.3322 7.63877 1.43279 7.28466 1.6227 6.97735C2.5107 5.53335 4.5207 3.10335 8.00003 3.10335C11.4794 3.10335 13.4894 5.53069 14.3774 6.97735C14.5673 7.28466 14.6679 7.63877 14.6679 8.00002C14.6679 8.36127 14.5673 8.71538 14.3774 9.02269Z"
                      fill="#93A3B0"
                    />
                    <path
                      d="M7.99984 4.6665C7.34057 4.6665 6.6961 4.862 6.14794 5.22827C5.59977 5.59454 5.17253 6.11514 4.92024 6.72423C4.66795 7.33331 4.60194 8.00354 4.73055 8.65014C4.85917 9.29674 5.17664 9.89069 5.64282 10.3569C6.10899 10.823 6.70293 11.1405 7.34954 11.2691C7.99614 11.3977 8.66636 11.3317 9.27545 11.0794C9.88454 10.8271 10.4051 10.3999 10.7714 9.85174C11.1377 9.30357 11.3332 8.65911 11.3332 7.99984C11.3321 7.11611 10.9806 6.26888 10.3557 5.64398C9.7308 5.01909 8.88357 4.66756 7.99984 4.6665ZM7.99984 9.99984C7.60428 9.99984 7.2176 9.88254 6.8887 9.66278C6.5598 9.44301 6.30345 9.13066 6.15208 8.7652C6.0007 8.39975 5.9611 7.99762 6.03827 7.60966C6.11544 7.22169 6.30592 6.86533 6.58562 6.58562C6.86533 6.30592 7.2217 6.11544 7.60966 6.03827C7.99762 5.9611 8.39975 6.0007 8.76521 6.15208C9.13066 6.30345 9.44302 6.5598 9.66278 6.8887C9.88254 7.2176 9.99984 7.60427 9.99984 7.99984C9.99984 8.53027 9.78913 9.03898 9.41405 9.41405C9.03898 9.78912 8.53027 9.99984 7.99984 9.99984Z"
                      fill="#93A3B0"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_357_398">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.514 6.27923C14.9122 5.29372 14.153 4.4134 13.2667 3.67323L15.1333 1.80657C15.2548 1.68083 15.322 1.51243 15.3205 1.33763C15.3189 1.16283 15.2488 0.995625 15.1252 0.87202C15.0016 0.748415 14.8344 0.678302 14.6596 0.676783C14.4848 0.675264 14.3164 0.74246 14.1907 0.863899L12.1607 2.89657C10.9023 2.14911 9.46362 1.75954 8 1.7699C3.87267 1.7699 1.52067 4.59523 0.486004 6.27923C0.166356 6.79624 -0.00296021 7.39206 -0.00296021 7.9999C-0.00296021 8.60774 0.166356 9.20356 0.486004 9.72057C1.08784 10.7061 1.847 11.5864 2.73334 12.3266L0.86667 14.1932C0.802997 14.2547 0.752209 14.3283 0.717269 14.4096C0.68233 14.491 0.663939 14.5784 0.66317 14.667C0.662401 14.7555 0.679269 14.8433 0.712789 14.9252C0.74631 15.0071 0.795812 15.0816 0.858407 15.1442C0.921002 15.2068 0.995437 15.2563 1.07737 15.2898C1.1593 15.3233 1.24708 15.3402 1.3356 15.3394C1.42412 15.3386 1.5116 15.3202 1.59294 15.2853C1.67428 15.2504 1.74784 15.1996 1.80934 15.1359L3.844 13.1012C5.10085 13.8486 6.53778 14.2388 8 14.2299C12.1273 14.2299 14.4793 11.4046 15.514 9.72057C15.8337 9.20356 16.003 8.60774 16.003 7.9999C16.003 7.39206 15.8337 6.79624 15.514 6.27923ZM1.622 9.02257C1.43209 8.71526 1.3315 8.36115 1.3315 7.9999C1.3315 7.63865 1.43209 7.28454 1.622 6.97723C2.51134 5.53323 4.52134 3.10323 8 3.10323C9.10685 3.09703 10.1982 3.36379 11.1773 3.8799L9.83534 5.2219C9.19529 4.79697 8.42794 4.60656 7.66349 4.683C6.89904 4.75943 6.18458 5.09799 5.64134 5.64123C5.0981 6.18448 4.75953 6.89894 4.6831 7.66339C4.60667 8.42784 4.79707 9.19519 5.222 9.83523L3.682 11.3752C2.86541 10.715 2.16856 9.9192 1.622 9.02257ZM10 7.9999C10 8.53033 9.78929 9.03904 9.41422 9.41411C9.03915 9.78919 8.53044 9.9999 8 9.9999C7.70301 9.99875 7.41014 9.93037 7.14334 9.7999L9.8 7.14323C9.93048 7.41003 9.99885 7.70291 10 7.9999ZM6 7.9999C6 7.46947 6.21072 6.96076 6.58579 6.58569C6.96086 6.21061 7.46957 5.9999 8 5.9999C8.297 6.00105 8.58987 6.06943 8.85667 6.1999L6.2 8.85657C6.06953 8.58977 6.00115 8.29689 6 7.9999ZM14.378 9.02257C13.4887 10.4666 11.4787 12.8966 8 12.8966C6.89316 12.9028 5.80185 12.636 4.82267 12.1199L6.16467 10.7779C6.80472 11.2028 7.57207 11.3932 8.33652 11.3168C9.10097 11.2404 9.81543 10.9018 10.3587 10.3586C10.9019 9.81532 11.2405 9.10086 11.3169 8.33641C11.3933 7.57196 11.2029 6.80461 10.778 6.16457L12.318 4.62457C13.1346 5.28475 13.8314 6.0806 14.378 6.97723C14.5679 7.28454 14.6685 7.63865 14.6685 7.9999C14.6685 8.36115 14.5679 8.71526 14.378 9.02257Z"
                    fill="#93A3B0"
                  />
                </svg>
              </button>
            </div>
          </div>
          <ErrorMessage class="error-message" name="password" />
          <div class="flex justify-end mb-5 items-center">
            <NuxtLink to="/forgot-password">
              <span class="forgot-text">Forgot Password ?</span>
            </NuxtLink>
          </div>
          <button type="submit" class="login-btn" :disabled="userLoading">
            <transition name="v-btn-label" mode="out-in">
              <div
                v-if="userLoading"
                class="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
              <div v-else>Login</div>
            </transition>
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.welcome_slogan {
  @apply font-primaryRegular  font-normal text-white text-4xl lg:text-3xl;
}
.screen-container {
  @apply h-screen md:flex bg-white;
}
.mobile_logo {
  @apply lg:hidden xl:hidden 2xl:hidden flex justify-center pt-[160px] md:pt-0;
}
.fingerprint {
  @apply absolute bottom-0  right-0 lg:w-[80%] lg:h-[50%] xl:w-[80%] xl:h-[58%] 2xl:w-[80%] 2xl:h-[60%];
}

.left-side {
  @apply my-3 mx-2 rounded-lg relative overflow-hidden lg:block w-2/5  bg-primary justify-around items-center hidden;
}

.right-side {
  @apply lg:flex md:flex lg:w-3/5  md:w-full justify-center md:pb-10 lg:py-10 md:py-10 sm:py-10 pb-10  sm:px-14 items-center  bg-white w-full px-5;
}

.form-section {
  @apply md:mb-16 w-[100%] bg-white md:mt-[0px] max-w-[570px]  lg:mb-16;
}

.welcome {
  @apply mb-1 text-center  lg:text-5xl  text-3xl text-dark font-primary font-medium;
}

.sub-text {
  @apply mb-[45px] text-xl text-center text-[#6E7A84] mt-2 font-primary;
}

.welcome-auth {
  @apply mb-1 text-start  lg:text-5xl  text-3xl text-dark font-primary font-medium;
}

.sub-text-auth {
  @apply mb-[45px] text-xl text-start text-[#6E7A84] mt-2 font-primary;
}

.label {
  @apply text-[#4C4C4C] text-sm my-1 font-primary font-normal;
}

.login-input {
  @apply w-full bg-white  py-2 px-3  border outline-none border-[#dbe1e6] rounded-lg;
}

.forgot-text {
  @apply text-sm ml-2 cursor-pointer text-primary font-normal font-primary;
}

.login-btn {
  @apply font-primary text-base w-full bg-primary hover:bg-primary/90  py-2.5 rounded-lg text-white font-semibold;
}
.error {
  @apply !border-red-500 !mb-0;
}

.error-message {
  @apply text-sm text-red-600 capitalize;
}
.form-error {
  @apply bg-red-100 rounded-xl p-4 text-center mb-4;
}

.error-text {
  @apply text-red-600 uppercase text-sm;
}

input:focus {
  border: 1px solid #38a9f0;
  -webkit-box-shadow: 0px 0px 4px rgba(56, 169, 240, 0.75);
  -moz-box-shadow: 0px 0px 4px rgba(56, 169, 240, 0.75);
  box-shadow: 0px 0px 4px #006cb5;
}

input::-ms-reveal,
input::-ms-clear {
  display: none;
}
</style>
