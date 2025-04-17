<template>
  <div class="tw-flex tw-items-center tw-gap-3">
    <span class="tw-text-sm tw-font-medium tw-text-black dark:tw-text-sky/white">{{ $t('message.light') }}</span>

    <input-switch
      :model-value="darkMode"
      :pt="ptInputSwitch"
      @update:model-value="setTheme"
    />

    <span class="tw-text-sm tw-font-medium tw-text-black dark:tw-text-sky/white">{{ $t('message.dark') }}</span>
  </div>
</template>

<script>
import InputSwitch from 'primevue/inputswitch'

import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'theme-switcher',
  components: {
    InputSwitch
  },
  setup () {
    const store = useStore()

    const darkMode = computed(() => store.state.settings.darkMode)
    const setTheme = (value) => {
      store.commit('settings/SET_THEME', value)
    }

    const ptInputSwitch = {}

    return {
      darkMode,
      ptInputSwitch,
      setTheme
    }
  }
}
</script>
