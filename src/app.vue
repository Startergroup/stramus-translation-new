<template>
  <main class="tw-h-full tw-w-full">
    <router-view />
    <modals-container />
  </main>
</template>

<script>
import { ModalsContainer } from 'vue-final-modal'

import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted } from 'vue'
import { USER_DATA } from '@/constants/storages'

export default {
  name: 'app',
  components: {
    ModalsContainer
  },
  setup () {
    const store = useStore()

    const darkMode = computed(() => store.state.settings.darkMode)
    const favicon = computed(() => {
      if (!store.state.settings.options?.favicon) return null

      return store.state.settings.options?.favicon.split('/').at(-1)
    })

    const handleBeforeUnload = async () => {
      await store.dispatch('analytics/onChangeTab')
      store.commit('analytics/CLEAR_INTERVAL')
    }

    onMounted(async () => {
      window.addEventListener('beforeunload', handleBeforeUnload)

      if (darkMode.value) {
        document.querySelector('html').setAttribute('data-mode', 'dark')
      }

      const stored_user_data = localStorage.getItem(USER_DATA)
      const { token = null, user = {} } = stored_user_data ? JSON.parse(stored_user_data) : {}

      store.commit('auth/SET_TOKEN', token)
      store.commit('auth/SET_USER', user)

      await store.dispatch('settings/getSettings')
      await store.dispatch('votes/getVotes')

      if (favicon.value) {
        document.querySelector('link[rel="icon"]').setAttribute('href', `https://streamos.ru/uploads/${favicon.value}`)
      }

      await store.dispatch('analytics/periodicSendSectionActivity')
    })

    onUnmounted(() => {
      handleBeforeUnload()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })
  }
}
</script>
