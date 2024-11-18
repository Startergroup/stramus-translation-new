<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
    <div
      :class="[
        'tw-flex tw-items-center tw-justify-center',
        'tw-w-12 tw-h-12 tw-rounded-full tw-bg-white dark:tw-bg-ink/darker tw-cursor-pointer',
        'tw-transition-all tw-duration-250',
        'hover:tw-bg-dark-white dark:hover:tw-bg-ink/base'
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

    <theme-switcher />
  </div>
</template>

<script>
import IconBase from '@/components/icon-base.vue'
import Sidebar from '@/modules/sidebar.vue'
import ThemeSwitcher from '@/modules/theme-switcher.vue'

import icons from '@/utils/icons'
import { useModal } from 'vue-final-modal'

export default {
  name: 'header-comp',
  components: {
    IconBase,
    ThemeSwitcher
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
