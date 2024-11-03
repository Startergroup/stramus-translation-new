<template>
  <p class="tw-text-xl tw-font-bold tw-text-dark-gray tw-w-[55px]">
    {{ getFormattedTime }}
  </p>
</template>

<script>
import { toRefs, ref, computed, onMounted } from 'vue'

export default {
  name: 'timer',
  props: {
    duration: {
      type: Number,
      required: true
    }
  },
  emits: ['time-over', 'update:time-spent'],
  setup (props, { emit }) {
    const { duration } = toRefs(props)

    const totalSeconds = ref(duration.value * 60)
    const countdown = () => {
      const interval = setInterval(() => {
        if (totalSeconds.value <= 0) {
          clearInterval(interval)
          emit('time-over')
          return
        }

        totalSeconds.value--
        emit('update:time-spent', (duration.value * 60) - totalSeconds.value)
      }, 1000)
    }

    const getFormattedTime = computed(() => {
      const mins = Math.floor(totalSeconds.value / 60)
      const secs = totalSeconds.value % 60

      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    })

    onMounted(() => {
      countdown(duration.value)
    })

    return {
      getFormattedTime
    }
  }
}
</script>
