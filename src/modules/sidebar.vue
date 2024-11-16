<template>
  <vue-final-modal
    content-transition="vfm-slide-left"
    content-class="tw-column-start tw-w-full tw-max-w-[90%] md:tw-max-w-[380px] tw-bg-white dark:tw-bg-ink/darker tw-h-screen tw-max-h-full tw-px-6 tw-py-10"
    overlay-transition="vfm-fade"
    swipe-to-close="left"
    @closed="$emit('update:model-value', false)"
  >
    <template #default>
      <div class="tw-column-start tw-w-full tw-gap-12">
        <h2 class="tw-text-lg md:tw-text-xl tw-font-bold tw-text-gray dark:tw-text-white tw-text-center">
          {{ getTitle }}
        </h2>

        <div class="tw-column-start tw-w-full tw-gap-12">
          <div class="tw-column-start tw-w-full tw-gap-3">
            <button-primary
              v-for="(item, index) in tabs"
              :key="index"
              :label="item.name"
              :class="[
                'tw-w-full tw-text-left',
                { 'dark:tw-bg-primary': item.tab_id === activeTabId },
                { 'tw-bg-light-gray dark:tw-bg-ink/base tw-text-black dark:tw-text-white': item.tab_id !== activeTabId }
              ]"
              @click="onSelectTab(item.tab_id)"
            />
          </div>

          <div
            v-if="quizzes.length"
            class="tw-column-start tw-w-full tw-gap-3"
          >
            <button-primary
              v-for="(item, index) in quizzes"
              :key="index"
              severity="secondary"
              class="tw-w-full tw-text-left"
              @click="setSelectedQuizId(item.quiz_id)"
            >
              <template #default>
                <div class="tw-flex tw-items-center tw-gap-2">
                  <div
                    :class="[
                      'tw-w-2 tw-h-2 tw-rounded-full',
                      { 'tw-bg-red-300': item.is_passed },
                      { 'tw-bg-green': !item.is_passed }
                    ]"
                  />

                  {{ item.name }}
                </div>
              </template>
            </button-primary>
          </div>

          <button-primary
            :label="$t('message.chatTitle')"
            severity="info"
            class="tw-w-full tw-text-left tw-bg-blue-400 dark:tw-bg-blue-600"
            @click="openQuestionModal"
          />
        </div>
      </div>

      <button-primary
        :label="$t('message.logout')"
        severity="danger"
        class="tw-w-full tw-mt-auto"
        @click="logout"
      />
    </template>
  </vue-final-modal>
</template>

<script>
import AskQuestionModal from '@/modals/ask-question-modal.vue'
import ButtonPrimary from 'primevue/button'
import Quiz from '@/modules/quiz/quiz.vue'
import { VueFinalModal, useModal } from 'vue-final-modal'

import { USER_DATA } from '@/constants/storages'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

export default {
  name: 'sidebar',
  components: {
    ButtonPrimary,
    VueFinalModal
  },
  emits: ['update:model-value'],
  setup (props, { emit }) {
    const store = useStore()
    const router = useRouter()

    const getTitle = computed(() => store.getters['settings/getTitle'])

    const tabs = computed(() => store.state.translation.tabs)
    const activeTabId = computed(() => store.state.translation.activeTabId)
    const onSelectTab = async (id) => {
      store.commit('translation/setActiveTabId', id)
      await store.dispatch('votes/getVotes')
      await store.dispatch('schedule/getScheduleBySectionId', id)
      store.commit('schedule/setVisibleState', true)
      emit('update:model-value', false)
    }

    const quizzes = computed(() => store.getters['quiz/getActiveQuizzes'])
    const setSelectedQuizId = (id) => {
      const { open } = useModal({
        component: Quiz
      })

      store.commit('quiz/setSelectedQuizId', id)
      open()
      emit('update:model-value', false)
    }

    const openQuestionModal = () => {
      const { open } = useModal({
        component: AskQuestionModal
      })

      open()
      emit('update:model-value', false)
    }
    const logout = async () => {
      clearInterval(store.state.auth.timer)

      store.commit('auth/setTimer', null)
      store.commit('auth/setToken', null)
      store.commit('auth/setUser', null)

      localStorage.setItem(USER_DATA, null)

      await router.push({ name: 'auth' })
      emit('update:model-value', false)
    }

    onMounted(async () => {
      await store.dispatch('translation/getTabs')
      await store.dispatch('quiz/getQuizzes')
    })

    return {
      activeTabId,
      getTitle,
      quizzes,
      logout,
      onSelectTab,
      openQuestionModal,
      setSelectedQuizId,
      tabs
    }
  }
}
</script>
