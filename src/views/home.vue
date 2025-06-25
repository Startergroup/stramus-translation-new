<template>
  <div class="tw-column-center tw-justify-start tw-w-full tw-min-h-full tw-p-6 md:tw-p-10 tw-gap-8">
    <header-comp />

    <div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-center tw-items-stretch tw-w-full lg:tw-max-h-[732px] tw-gap-3">
      <transition-fade :duration="300">
        <schedule v-if="!isEmpty(schedule) && isTheSameDate && isScheduleOpen" />
      </transition-fade>

      <video-player class="tw-order-1 lg:tw-order-[unset]" />

      <transition-fade :duration="300">
        <chat v-if="isChatOpen" />
      </transition-fade>
    </div>

    <cinema-mode />
  </div>
</template>

<script>
import Chat from '@/modules/chat/chat.vue'
import CinemaMode from '@/modules/cinema-mode.vue'
import HeaderComp from '@/modules/header-comp.vue'
import Schedule from '@/modules/schedule.vue'
import { TransitionFade } from '@morev/vue-transitions/vue3'
import VideoPlayer from '@/modules/video-player/video-player.vue'

import dayjs from 'dayjs'
import { useStore } from 'vuex'
import { watch, computed, onMounted, onUnmounted } from 'vue'
import { isEmpty } from 'lodash'

export default {
  name: 'home',
  components: {
    Chat,
    CinemaMode,
    HeaderComp,
    Schedule,
    TransitionFade,
    VideoPlayer
  },
  setup () {
    const store = useStore()

    const schedule = computed(() => store.state.schedule.schedule)
    const isTheSameDate = computed(() => dayjs().isSame(schedule.value.date, 'day'))
    const isScheduleOpen = computed(() => store.state.schedule.is_visible)

    const lecture_views_interval_id = computed(() => store.state.schedule.lecture_views_interval_id)

    const isChatOpen = computed(() => store.state.chat.is_chat_open)

    onMounted(() => {
      store.dispatch('schedule/runIntervalCheckCurrentLecture')
    })
    onUnmounted(() => {
      clearInterval(store.state.schedule.lecture_views_interval_id)
    })

    watch(
      () => schedule.value,
      async (value) => {
        if (lecture_views_interval_id.value) {
          clearInterval(lecture_views_interval_id.value)
          store.commit('schedule/SET_LECTURE_VIEWS_INTERVAL_ID', null)
        }

        if (!value) return

        store.dispatch('schedule/setActiveLecture')
        store.dispatch('schedule/intervalSendLectureViews')
      },
      { immediate: true }
    )

    return {
      isEmpty,
      isChatOpen,
      isScheduleOpen,
      isTheSameDate,
      schedule
    }
  }
}
</script>
