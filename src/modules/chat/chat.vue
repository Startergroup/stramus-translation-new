<template>
  <transition-fade :duration="350">
    <template #default>
      <div class="tw-column-start tw-w-full lg:tw-w-[480px] tw-px-4 tw-py-6 tw-gap-10 tw-rounded-md tw-bg-sky/white dark:tw-bg-ink/darker tw-max-h-full tw-overflow-y-auto tw-relative">
        <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
          <h2 class="tw-text-lg tw-font-medium tw-text-ink/darkest dark:tw-text-sky/white">
            Чат секции: "{{ active_tab?.name }}"
          </h2>

          <div
            class="tw-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-rounded-full tw-bg-ink/dark tw-cursor-pointer"
            @click="() => {}"
          >
            <icon-base
              :icon="icons['x-close-big']"
              :width="10"
              :height="10"
              :view-box-size="[12, 12]"
            />
          </div>
        </div>

        <div class="tw-column-start tw-w-full tw-max-h-[81%] tw-overflow-y-auto tw-gap-3">
          <div
            v-for="(user_message, index) in messages"
            :key="index"
            :class="[
              'tw-column-start tw-w-auto tw-min-w-[240px] tw-gap-2',
              'tw-rounded-md tw-px-4 tw-py-2',
              { 'tw-bg-primary/light dark:tw-bg-primary/light tw-ml-auto': user_message?.sender_id === user_id },
              { 'tw-bg-primary/base dark:tw-bg-primary/base': user_message?.sender_id !== user_id }
            ]"
          >
            <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
              <span class="tw-text-base tw-font-medium tw-text-ink/darkest dark:tw-text-sky/white">
                {{ user_message.sender?.name }}
              </span>

              <span class="tw-text-sm tw-font-normal tw-text-ink/dark dark:tw-text-sky/light">
                {{ dayjs(user_message?.timestamp).format('HH:mm') }}
              </span>
            </div>

            <span class="tw-text-base tw-font-normal tw-text-ink/darkest dark:tw-text-sky/white">
              {{ user_message?.text }}
            </span>
          </div>
        </div>

        <div class="tw-flex tw-items-end tw-w-full tw-gap-3 tw-mt-auto">
          <textarea-primary
            :auto-resize="true"
            :model-value="message"
            :pt="inputTextPt"
            rows="1"
            placeholder="Введите сообщение"
            name="message"
            class="tw-resize-none"
            @update:model-value="message = $event"
            @keydown.enter="sendMessage"
          />

          <button-prime
            tag="div"
            class="tw-min-w-[40px] tw-w-10 tw-h-10 tw-cursor-pointer"
            @click="sendMessage"
          >
            <template #icon>
              <icon-base
                :icon="icons['fi-rr-paper-plane']"
                :widht="16"
                :height="16"
                :view-box-size="[16, 16]"
                class="[&_path]:tw-fill-sky/white"
              />
            </template>
          </button-prime>
        </div>
      </div>
    </template>
  </transition-fade>
</template>

<script>
import ButtonPrime from 'primevue/button'
import IconBase from '@/components/icon-base.vue'
import TextareaPrimary from 'primevue/textarea'
import { TransitionFade } from '@morev/vue-transitions/vue3'

import WSClient from '@/classes/WSClient'
import dayjs from 'dayjs'
import icons from '@/utils/icons'
import { inputTextPt } from '@/pt-options'
import { BASE_URL, API_VERSION } from '@/api/config'
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'chat',
  components: {
    ButtonPrime,
    IconBase,
    TextareaPrimary,
    TransitionFade
  },
  setup () {
    const store = useStore()
    const wsClient = new WSClient(`${BASE_URL}/${API_VERSION}/chat/message`)

    const active_tab = computed(() => store.getters['section/getActiveTab'] || {})
    const chat_id = computed(() => store.state.chat?.chat_id)
    const user_id = computed(() => store.state.auth.user?.code_id)

    const messages = computed(() => store.state.chat.messages || [])
    const message = ref(null)
    const sendMessage = () => {
      wsClient.send({
        chat_id: chat_id.value,
        init: false,
        text: message.value,
        user_id: user_id.value
      })

      message.value = null
    }

    onMounted(() => {
      wsClient.connect()

      wsClient.on('open', () => {
        wsClient.send({
          init: true,
          tab_id: active_tab.value?.tab_id,
          user_id: user_id.value
        })
      })

      wsClient.onMessage((data) => {
        if (data?.init) {
          store.commit('chat/SET_CHAT_ID', data?.id)
          store.commit('chat/SET_MESSAGES', data?.messages || [])

          return
        }

        store.commit('chat/SET_MESSAGES', data || [])
      })
    })

    return {
      active_tab,
      dayjs,
      icons,
      inputTextPt,
      message,
      messages,
      sendMessage,
      user_id
    }
  }
}
</script>
