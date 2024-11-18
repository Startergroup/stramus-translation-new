<template>
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
</template>

<script>
import SelectButton from 'primevue/selectbutton'

import { ref, computed } from 'vue'
import { i18n } from '@/localization/i18n'

export default {
  name: 'languages',
  components: {
    SelectButton
  },
  setup () {
    const locale = computed(() => i18n.global.locale.value)
    const languages = ref(['ru', 'en'])
    const changeLocale = (value) => {
      if (!value) return

      i18n.global.locale.value = value
    }

    const ptSelectButton = {
      button: {
        class: 'dark:tw-bg-ink/darker dark:[&_*]:tw-text-light-gray dark:[&[data-p-highlight="true"]]:before:tw-bg-ink/base'
      }
    }

    return {
      locale,
      languages,
      changeLocale,
      ptSelectButton
    }
  }
}
</script>
