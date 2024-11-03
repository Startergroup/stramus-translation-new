<template>
  <main class="tw-h-full tw-w-full">
    <router-view />
    <modals-container />

    <div class="tw-flex tw-flex-col md:tw-flex-row tw-items-end md:tw-items-center tw-gap-6 tw-fixed tw-top-8 tw-right-8 tw-z-20">
      <theme-switcher />

      <select-button
        :model-value="locale"
        :options="languages"
        :pt="ptSelectButton"
        @update:model-value="changeLocale($event)"
      >
        <template #option="{ option }">
          <span class="tw-text-base tw-font-medium tw-text-gray tw-uppercase tw-relative tw-z-10">
            {{ option }}
          </span>
        </template>
      </select-button>
    </div>
  </main>
</template>

<script>
import { ModalsContainer } from 'vue-final-modal'
import SelectButton from 'primevue/selectbutton'
import ThemeSwitcher from '@/modules/theme-switcher.vue'

import { useStore } from 'vuex'
import { ref, computed, onMounted } from 'vue'
import { USER_DATA } from '@/constants/storages'
import { i18n } from '@/localization/i18n'

export default {
  name: 'app',
  components: {
    ModalsContainer,
    SelectButton,
    ThemeSwitcher
  },
  setup () {
    const store = useStore()

    const darkMode = computed(() => store.state.settings.darkMode)
    const ptSelectButton = {
      button: {
        class: 'dark:tw-bg-ink/darker dark:[&_*]:tw-text-light-gray dark:[&[data-p-highlight="true"]]:before:tw-bg-ink/base'
      }
    }

    const locale = computed(() => i18n.global.locale.value)
    const languages = ref(['ru', 'en'])
    const changeLocale = (value) => {
      if (!value) return

      i18n.global.locale.value = value
    }

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

    return {
      changeLocale,
      languages,
      locale,
      ptSelectButton
    }
  }
}
</script>
