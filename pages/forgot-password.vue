<script setup>
import { Field, Form, defineRule, ErrorMessage, configure } from "vee-validate";
import { required, email } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import { useUserStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import { ref, reactive } from "vue";
const { forgotPassword } = useUserStore();
const { userLoading, showMessage } = storeToRefs(useUserStore());

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

const form = reactive({
  email: "",
});

function requestHandler() {
  forgotPassword(form.email)
    .then((res) => {
      if (res.ok) {
        formErr.value = "";
      }
    })
    .catch((err) => {
      if (err.status === false) {
        formErr.value = err.message;
      }
    });
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
      <Form class="form-section" @submit="requestHandler" v-slot="{ errors }">
        <div class="mobile_logo">
          <img src="../assets/images/colored_logo.svg" alt="" />
        </div>
        <div class="mt-12">
          <h1 class="welcome">Forget Password?</h1>
          <p class="sub-text">
            Enter your registered email below to receive password reset
            instruction
          </p>
        </div>
        <transition name="bounce" v-if="showMessage">
          <div class="bg-success/10 rounded-lg p-4 text-center mb-4 mt-4">
            <p class="text-success text-sm">Email sent successfully!</p>
          </div>
        </transition>

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
            class="input-data"
            placeholder="Enter your email address"
            v-model.trim="form.email"
            rules="required|email"
            name="email"
          />
        </div>
        <ErrorMessage class="error-message" name="email" />

        <div class="remember-row">
          <p class="remember-text">Remember password ?</p>
          <NuxtLink to="/login">
            <p class="login-route">Login</p>
          </NuxtLink>
        </div>
        <button type="submit" class="send-btn" :disabled="userLoading">
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
            <div v-else>Send</div>
          </transition>
        </button>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.screen-container {
  @apply h-screen md:flex bg-white;
}
.welcome_slogan {
  @apply font-primaryRegular  font-normal text-white text-4xl lg:text-3xl;
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
  @apply mb-[45px] text-xl font-light text-center text-muted mt-2 font-primary;
}

.label {
  @apply font-primary text-[#4C4C4C] text-sm my-1 font-normal;
}

.input-data {
  @apply w-full bg-white  py-2 px-3  border outline-none border-[#dbe1e6] rounded-lg;
}

.send-btn {
  @apply font-primary text-base w-full bg-primary hover:bg-primary/90 mt-4 py-2.5 rounded-lg text-white font-semibold;
}
.error {
  @apply !border-red-500 !mb-0;
}

.error-message {
  @apply text-sm text-red-600 capitalize;
}
.form-error {
  @apply bg-red-100 rounded-sm p-4 text-center mb-4;
}

.error-text {
  @apply text-red-600 uppercase text-sm;
}

.remember-row {
  @apply flex justify-center gap-2 items-center mb-6 mt-2;
}

.remember-text {
  @apply text-[#5E5E5E] text-sm font-normal;
}

.login-route {
  @apply text-primary text-sm font-normal cursor-pointer;
}

input:focus {
  border: 1px solid #38a9f0;
  -webkit-box-shadow: 0px 0px 4px rgba(56, 169, 240, 0.75);
  -moz-box-shadow: 0px 0px 4px rgba(56, 169, 240, 0.75);
  box-shadow: 0px 0px 4px #006cb5;
}
</style>
