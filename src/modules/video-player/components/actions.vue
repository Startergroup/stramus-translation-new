<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-w-full tw-gap-2 tw-rounded-md tw-bg-white dark:tw-bg-ink/darker tw-py-2 tw-px-4">
    <span class="tw-text-base tw-font-medium tw-text-black dark:tw-text-white">
      {{ section.name }}
    </span>

    <div class="tw-flex tw-items-center tw-gap-2">
      <button-primary
        v-if="!isEmpty(votes)"
        :title="$t('message.vote_header')"
        rounded
        severity="primary"
        class="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10"
        @click="openVoteModal"
      >
        <icon-base
          :icon="icons['survey']"
          :width="16"
          :height="16"
          :view-box-size="[16, 16]"
          :stroke-width="1"
          stokre="#FFF"
          stroke-linejoin="rounded"
          fill="transparent"
          class="tw-w-4 tw-h-4"
        />
      </button-primary>

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
    </div>
  </div>
</template>

<script>
import AskQuestionModal from '@/modals/ask-question-modal.vue'
import ButtonPrimary from 'primevue/button'
import IconBase from '@/components/icon-base.vue'
import VotesModal from '@/modals/votes-modal.vue'

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

    const { open: openQuestionModal } = useModal({
      component: AskQuestionModal
    })
    const { open: openVoteModal } = useModal({
      component: VotesModal
    })

    return {
      icons,
      isEmpty,
      openQuestionModal,
      openVoteModal,
      section,
      switchCinemaMode: (value) => store.commit('settings/switchCinemaMode', value),
      votes
    }
  }
}
</script>
