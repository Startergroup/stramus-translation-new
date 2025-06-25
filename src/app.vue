<template>
  <main class="tw-h-full tw-w-full">
    <router-view />
    <modals-container />
    <theme-switcher />
  </main>
</template>

<script>
import { ModalsContainer } from 'vue-final-modal'
import ThemeSwitcher from '@/modules/theme-switcher.vue'

import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { LAST_TAB_ID, USER_DATA } from '@/constants/storages'

export default {
  name: 'app',
  components: {
    ModalsContainer,
    ThemeSwitcher
  },
  setup () {
    const store = useStore()

    const darkMode = computed(() => store.state.settings.darkMode)
    const favicon = computed(() => {
      if (!store.state.settings.options?.favicon) return null

      return store.state.settings.options?.favicon.split('/').at(-1)
    })

    const sections = computed(() => store.state.section?.tabs || [])

    onMounted(async () => {
      if (darkMode.value) {
        document.querySelector('html').setAttribute('data-mode', 'dark')
      }

      const stored_user_data = localStorage.getItem(USER_DATA)
      const { token = null, user = {} } = stored_user_data ? JSON.parse(stored_user_data) : {}

      store.commit('auth/SET_TOKEN', token)
      store.commit('auth/SET_USER', user)

      await store.dispatch('settings/getSettings')
      await store.dispatch('votes/getVotes')
      await store.dispatch('section/getTabs')

      if (favicon.value) {
        document.querySelector('link[rel="icon"]').setAttribute('href', `https://streamos.ru/uploads/${favicon.value}`)
      }

      const LAST_ACTIVE_SECTION = JSON.parse(localStorage.getItem(LAST_TAB_ID))
      const isThereTargetTab = sections.value.some(item => parseInt(item.tab_id) === parseInt(LAST_ACTIVE_SECTION))

      if (isThereTargetTab) {
        store.commit('section/SET_ACTIVE_TAB_ID', LAST_ACTIVE_SECTION)
        await store.dispatch('schedule/getScheduleBySectionId', LAST_ACTIVE_SECTION)
        store.commit('schedule/SET_VISIBLE_STATE', true)
      }
    })
  }
}
</script>
