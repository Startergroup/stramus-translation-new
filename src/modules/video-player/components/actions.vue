<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-w-full tw-gap-2 tw-rounded-md tw-bg-white dark:tw-bg-ink/darker tw-py-2 tw-px-4">
    <span class="tw-text-base tw-font-medium tw-text-black dark:tw-text-white">
      {{ section.name }}
    </span>

    <div class="tw-flex tw-items-center tw-gap-2">
      <button-primary
        :title="$t('message.questionHint')"
        rounded
        severity="primary"
        class="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10"
        @click="openQuestionModal"
      >
        <icon-base
          :icon="icons['question']"
          :width="20"
          :height="20"
          :view-box-size="[20, 20]"
          fill="transparent"
        />
      </button-primary>

      <button-primary
        v-if="!isEmpty(schedule)"
        rounded
        severity="primary"
        class="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10"
        @click="openSchedule"
      >
        <icon-base
          :icon="icons['fi-rr-calendar']"
          :width="15"
          :height="15"
          :view-box-size="[15, 15]"
          fill="transparent"
        />
      </button-primary>
    </div>
  </div>
</template>

<script>
import AskQuestionModal from '@/modals/ask-question-modal.vue'
import ButtonPrimary from 'primevue/button'
import IconBase from '@/components/icon-base.vue'

import icons from '@/utils/icons'
import { isEmpty } from 'lodash'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useModal } from 'vue-final-modal'

export default {
  name: 'actions',
  components: {
    ButtonPrimary,
    IconBase
  },
  setup () {
    const store = useStore()

    const votes = computed(() => store.state.votes.votes)
    const section = computed(() => store.getters['translation/getActiveTab'])
    const schedule = computed(() => store.state.schedule.schedule)

    const { open: openQuestionModal } = useModal({
      component: AskQuestionModal
    })

    const openSchedule = () => {
      store.commit('schedule/SET_VISIBLE_STATE', !store.state.schedule.isVisible)
    }

    return {
      icons,
      isEmpty,
      openQuestionModal,
      openSchedule,
      section,
      schedule,
      switchCinemaMode: (value) => store.commit('settings/SWITCH_CINEMA_MODE', value),
      votes
    }
  }
}
</script>
