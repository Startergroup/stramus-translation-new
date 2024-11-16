<template>
  <transition-fade :duration="350">
    <div
      v-if="!isEmpty(schedule) && isTheSameDate"
      class="tw-column-start tw-w-full lg:tw-w-[320px] tw-px-4 tw-py-6 tw-gap-10 tw-rounded-md tw-bg-sky/white dark:tw-bg-ink/darker tw-max-h-full tw-overflow-y-auto"
    >
      <div class="tw-flex tw-items-center tw-w-full tw-justify-between">
        <h3 class="tw-text-xl tw-font-bold tw-text-ink/darkest dark:tw-text-sky/white">
          {{ schedule.section_name }}
        </h3>

        <span class="tw-text-lg tw-font-medium tw-text-ink/darker dark:tw-text-sky/light">{{ currentTime }}</span>
      </div>

      <div class="tw-column-start tw-w-full tw-gap-4">
        <div
          v-for="(item, index) in schedule.lectures"
          :key="index"
          :class="[
            'tw-column-start tw-w-full tw-gap-3 tw-rounded-md tw-bg-sky/light dark:tw-bg-ink/darkest tw-px-4 tw-py-3 tw-transition-all tw-duration-250',
            { 'tw-border-2 tw-border-primary/base': item?.lecture_id === activeLecture?.lecture_id }
          ]"
        >
          <div class="tw-column-start tw-w-full tw-gap-1">
            <span class="tw-text-sm tw-font-bold tw-text-ink/dark dark:tw-text-sky/white">
              {{ dayjs(item.start).format('HH:mm') }} - {{ dayjs(item.end).format('HH:mm') }}
            </span>

            <span class="tw-text-sm tw-font-normal tw-text-ink/dark dark:tw-text-sky/light">{{ item.name }}</span>
          </div>

          <div
            v-if="item.fio || item.company"
            class="tw-column-start tw-w-full tw-gap-px"
          >
            <span class="tw-text-sm tw-font-bold tw-text-ink/dark dark:tw-text-sky/white">{{ item.fio }}</span>
            <span class="tw-text-sm tw-font-medium tw-text-ink/dark dark:tw-text-sky/white">{{ item.company }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition-fade>
</template>

<script>
import { TransitionFade } from '@morev/vue-transitions/vue3'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useStore } from 'vuex'
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { isEmpty } from 'lodash'

dayjs.extend(isBetween)

export default {
  name: 'schedule',
  components: {
    TransitionFade
  },
  setup () {
    const store = useStore()

    const schedule = computed(() => store.state.schedule.schedule)
    const isTheSameDate = computed(() =>
      dayjs().isSame(schedule.value.date, 'day') &&
      dayjs().isSame(schedule.value.date, 'month') &&
      dayjs().isSame(schedule.value.date, 'year')
    )
    const activeLecture = ref({})

    const currentTime = ref(dayjs().format('HH:mm'))
    let timeInterval

    onMounted(() => {
      if (!isEmpty(schedule.value)) {
        timeInterval = setInterval(() => {
          currentTime.value = dayjs().format('HH:mm')
          activeLecture.value = schedule.value.lectures.find(item => dayjs().isBetween(item.start, item.end))
        }, 1000)
      }
    })

    onBeforeMount(() => {
      clearInterval(timeInterval)
    })

    return {
      activeLecture,
      currentTime,
      dayjs,
      isEmpty,
      isTheSameDate,
      schedule
    }
  }
}
</script>
