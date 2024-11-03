<template>
  <transition-fade :duration="250">
    <div
      v-if="isCinemaMode"
      class="tw-fixed tw-left-0 tw-top-0 tw-w-full tw-h-full tw-bg-black tw-z-10"
    />
  </transition-fade>
</template>

<script>
import { TransitionFade } from '@morev/vue-transitions/vue3'

import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'cinema-mode',
  components: {
    TransitionFade
  },
  setup () {
    const store = useStore()

    const isCinemaMode = computed(() => store.state.settings.cinemaMode)

    return {
      isCinemaMode
    }
  }
}
</script>
