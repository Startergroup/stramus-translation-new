<template>
  <main class="tw-h-full tw-w-full">
    <router-view />
    <modals-container />
  </main>
</template>

<script>
import { ModalsContainer } from 'vue-final-modal'

import { useStore } from 'vuex'
import { computed, onMounted } from 'vue'
import { USER_DATA } from '@/constants/storages'

export default {
  name: 'app',
  components: {
    ModalsContainer
  },
  setup () {
    const store = useStore()

    const darkMode = computed(() => store.state.settings.darkMode)

    onMounted(async () => {
      if (darkMode.value) {
        document.querySelector('html').setAttribute('data-mode', 'dark')
      }

      const { token = null, user = {} } = JSON.parse(localStorage.getItem(USER_DATA)) || {}

      store.commit('auth/setToken', token)
      store.commit('auth/setUser', user)

      await store.dispatch('settings/getSettings')
      await store.dispatch('votes/getVotes')
    })
  }
}
</script>
