<script setup>
import { useUserStore } from "~/stores/auth";
const { user } = storeToRefs(useUserStore());
const emit = defineEmits(["close", "confirm", "reject"]);
defineProps({
  isOpen: Boolean,
  loading: Boolean,
  cancelText: String || null,
  confirmText: String || null,
  title: String || null,
  desc: String || null,
  showReject: Boolean,
  hideActions: Boolean,
  showActions:Boolean,
  isFilter:Boolean
});
</script>
<template>
  <HeadlessTransitionRoot appear :show="isOpen" as="template">
    <HeadlessDialog
      as="div"
      @close="emit('close')"
      class="relative z-10 dialog-side"
    >
      <HeadlessTransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </HeadlessTransitionChild>

      <div class="fixed inset-0 overflow-x-hidden">
        <div class="flex h-full items-end justify-end text-center">
          <HeadlessTransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 translate-x-1/3"
            enter-to="opacity-100 translate-x-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 translate-x-full"
            leave-to="opacity-0 translate-x-1/3"
          >
            <HeadlessDialogPanel
            :class="isFilter ? 'max-w-md':'max-w-lg'"
              class="w-full h-[calc(100%-72px)] text-start max-w-lg transform overflow-hidden bg-white p-6 align-middle shadow-md transition-all"
            >
              <HeadlessDialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                <span class="block font-headers text-3xl"> {{ title }}</span>
              </HeadlessDialogTitle>
              <div class="my-2">
                <p class="text-xs text-gray-400">
                  {{ desc }}
                </p>
              </div>
              <div class="overflow-y-auto h-[calc(100%-50px)]">
                <slot />
              </div>
              <div
                class="action-bar w-full"
                v-if=" showActions === true"
              >
                <div class="mt-1 mr-3 flex gap-5 px-1 justify-end">
                  <button
                    type="button"
                    class="outline-none  bg-transparent text-[#171106] mx-8 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2"
                    @click="emit('close')"
                    :disabled="loading"
                  >
                    <transition name="v-btn-label" mode="out-in">
                      <div v-if="loading">
                        <span
                          class="spinner !h-[1.1em] !w-[1.1em] !border-[0.2em]"
                        ></span>
                      </div>
                      <div v-else>Cancel</div>
                    </transition>
                  </button>
                  <button
                    v-if="showReject"
                    type="button"
                    class="w-[30%] rounded-sm border-black border bg-transparent text-[#171106] py-4 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-70"
                    @click="emit('reject')"
                    :disabled="loading"
                  >
                    <transition name="v-btn-label" mode="out-in">
                      <div v-if="loading">
                        <span
                          class="spinner !h-[1em] !w-[1em] !border-[0.2em]"
                        ></span>
                      </div>
                      <div v-else>Reject</div>
                    </transition>
                  </button>
                  <button
                    type="button"
                    class="w-[35%] rounded-lg border border-transparent bg-primary h-10 text-sm font-medium text-white hover:bg-primary/90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-70"
                    @click="emit('confirm')"
                    :disabled="loading"
                  >
                    <transition name="v-btn-label" mode="out-in">
                      <div v-if="loading">
                        <span
                          class="spinner !h-[1em] !w-[1em] !border-[0.2em]"
                        ></span>
                      </div>
                      <div v-else>{{ confirmText || "Send" }}</div>
                    </transition>
                  </button>
                </div>
              </div>
            </HeadlessDialogPanel>
          </HeadlessTransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>

<style lang="scss" scoped>
.action-bar {
  position: absolute;
  bottom: 0;
  background: #fff;
  left: 0;
  padding: 10px 15px;
  z-index: 999;
}
</style>
