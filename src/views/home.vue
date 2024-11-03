<template>
  <div class="tw-column-center tw-justify-center tw-w-full tw-min-h-full tw-py-6 md:tw-py-36 tw-px-6 md:tw-px-10">
    <div
      :class="[
        'tw-flex tw-items-center tw-justify-center',
        'tw-w-12 tw-h-12 tw-rounded-full tw-bg-white dark:tw-bg-ink/darker tw-cursor-pointer',
        'tw-transition-all tw-duration-250',
        'hover:tw-bg-dark-white dark:hover:tw-bg-ink/base',
        'tw-fixed tw-top-8 tw-left-8 tw-z-20'
      ]"
      @click="openSidebar"
    >
      <icon-base
        :icon="icons.burger"
        :width="24"
        :height="16"
        :view-box-size="[24, 16]"
        fill="#6C63FF"
      />
    </div>

    <video-player />
    <cinema-mode />
  </div>
</template>

<script>
import CinemaMode from '@/modules/cinema-mode.vue'
import IconBase from '@/components/icon-base.vue'
import Sidebar from '@/modules/sidebar.vue'
import VideoPlayer from '@/modules/video-player/video-player.vue'

import icons from '@/utils/icons'
import { useModal } from 'vue-final-modal'

export default {
  name: 'home',
  components: {
    CinemaMode,
    IconBase,
    VideoPlayer
  },
  setup () {
    const openSidebar = () => {
      const { open } = useModal({
        component: Sidebar
      })
      open()
    }

    return {
      icons,
      openSidebar
    }
  }
}
</script>
