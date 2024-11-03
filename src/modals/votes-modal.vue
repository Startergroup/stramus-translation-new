<template>
  <vue-final-modal
    class="tw-flex tw-items-center tw-justify-center"
    content-transition="fade"
    content-class="tw-column-start tw-w-full tw-max-w-[640px] tw-bg-white dark:tw-bg-ink/darker tw-rounded-lg tw-px-6 tw-py-10 tw-gap-6 tw-relative"
    overlay-transition="fade"
    @closed="$emit('update:model-value', false)"
  >
    <template #default>
      <h2 class="tw-text-lg tw-font-semibold tw-text-dark-gray dark:tw-text-sky/white">
        {{ $t('message.vote_header') }}
      </h2>

      <div class="tw-column-start tw-w-full tw-gap-4">
        <div
          v-for="(item, index) in votes"
          :key="index"
          class="tw-flex tw-items-center tw-w-full tw-gap-2 tw-cursor-pointer"
          @click="voteHandler(item?.presentation_id, item?.is_like)"
        >
          <icon-base
            :icon="icons.smiley"
            :width="20"
            :height="20"
            :view-box-size="[20, 20]"
            fill="transparent"
            :class="[{ '[&_path]:tw-stroke-primary': item.is_like }]"
          />

          <span class="tw-text-base tw-font-normal tw-text-dark-gray dark:tw-text-sky/white">{{ item.name }}</span>
        </div>
      </div>

      <div
        class="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-rounded-full tw-cursor-pointer tw-absolute tw-top-6 tw-right-6"
        @click="$emit('update:model-value', false)"
      >
        <icon-base
          :icon="icons['x-close-big']"
          :width="10"
          :height="10"
          :view-box-size="[12, 12]"
          classes="tw-h-4 tw-w-4 dark:[&_path]:tw-stroke-white"
        />
      </div>
    </template>
  </vue-final-modal>
</template>

<script>
import IconBase from '@/components/icon-base.vue'
import { VueFinalModal } from 'vue-final-modal'

import icons from '@/utils/icons'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'votes-modal',
  components: {
    IconBase,
    VueFinalModal
  },
  emits: ['update:model-value'],
  setup () {
    const store = useStore()

    const votes = computed(() => store.state.votes.votes?.presentations || [])
    const voteHandler = async (presentationId, isLiked) => {
      await store.dispatch('votes/createVote', { presentationId, value: !isLiked })
      await store.dispatch('votes/getVotes')
    }

    return {
      icons,
      voteHandler,
      votes
    }
  }
}
</script>
