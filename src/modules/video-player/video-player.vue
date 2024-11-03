<template>
  <div class="tw-column-start tw-w-full tw-max-w-[1175px] tw-gap-4 tw-relative tw-z-20">
    <div
      :class="[
        'tw-flex tw-items-center tw-justify-center tw-w-full tw-h-[320px] sm:tw-h-[420px] lg:tw-h-[660px] tw-rounded-md tw-overflow-hidden',
        { 'tw-bg-white dark:tw-bg-ink/darker': Object.values(activeTab).length },
        { 'tw-bg-dark-gray dark:tw-bg-ink/darker': !Object.values(activeTab).length }
      ]"
    >
      <vue-plyr
        v-if="!isEmpty(activeTab)"
        ref="plyr"
        style="width: 100%;"
      >
        <template #default>
          <iframe
            :src="activeTab?.url"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="tw-w-full tw-h-full"
          />
        </template>
      </vue-plyr>

      <h2
        v-else-if="isEmpty(activeTab)"
        class="tw-text-lg md:tw-text-2xl tw-font-medium tw-text-light-gray tw-text-center"
      >
        {{ $t('message.videoHint') }}
      </h2>
    </div>

    <actions />
  </div>
</template>

<script>
import Actions from './components/actions.vue'
import VuePlyr from 'vue-plyr'

import 'vue-plyr/dist/vue-plyr.css'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { isEmpty } from 'lodash'

export default {
  name: 'video-player',
  components: {
    Actions,
    VuePlyr
  },
  setup () {
    const store = useStore()

    const plyr = ref(null)
    const activeTab = computed(() => store.getters['translation/getActiveTab'])

    return {
      activeTab,
      isEmpty,
      plyr
    }
  }
}
</script>
