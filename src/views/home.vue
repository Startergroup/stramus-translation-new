<template>
  <div class="tw-column-center tw-justify-start tw-w-full tw-min-h-full tw-p-6 md:tw-p-10 tw-gap-8">
    <header-comp />

    <div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-center tw-items-stretch tw-w-full lg:tw-max-h-[732px] tw-gap-3">
      <video-player />
      <schedule />
    </div>

    <cinema-mode />
  </div>
</template>

<script>
import CinemaMode from '@/modules/cinema-mode.vue'
import HeaderComp from '@/modules/header-comp.vue'
import Schedule from '@/modules/schedule.vue'
import VideoPlayer from '@/modules/video-player/video-player.vue'

export default {
  name: 'home',
  components: {
    CinemaMode,
    HeaderComp,
    Schedule,
    VideoPlayer
  }
}
</script>
