<template>
  <div class="tw-column-center tw-w-full tw-gap-2">
    <div class="tw-w-full tw-h-4 tw-rounded-lg tw-bg-light-gray">
      <div
        class="tw-bg-primary tw-h-full tw-rounded-lg tw-transition-all tw-duration-250"
        :style="getComputedStyles"
      />
    </div>

    <div class="tw-text-sm tw-font-medium tw-text-dark-gray">
      {{ modelValue }} / {{ length }}
    </div>
  </div>
</template>

<script>
import { toRefs, computed } from 'vue'

export default {
  name: 'progress-bar',
  props: {
    length: {
      type: Number,
      required: true
    },
    modelValue: {
      type: Number,
      required: true
    }
  },
  setup (props) {
    const { length, modelValue } = toRefs(props)

    const getCalculatedProgress = computed(() => modelValue.value ? ((modelValue.value / length.value) * 100) : 0)
    const getComputedStyles = computed(() => ({
      width: `${getCalculatedProgress.value}%`
    }))

    return {
      getComputedStyles
    }
  }
}
</script>
