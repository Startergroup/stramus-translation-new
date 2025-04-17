<template>
  <transition-fade :duration="350">
    <div
      v-if="!isEmpty(schedule) && isTheSameDate && isVisible"
      class="tw-column-start tw-w-full lg:tw-w-[320px] tw-px-4 tw-py-6 tw-gap-10 tw-rounded-md tw-bg-sky/white dark:tw-bg-ink/darker tw-max-h-full tw-overflow-y-auto tw-relative"
    >
      <div class="tw-flex tw-items-center tw-w-full tw-justify-between">
        <h3 class="tw-text-xl tw-font-bold tw-text-ink/darkest dark:tw-text-sky/white">
          {{ schedule.section_name }}
        </h3>

        <div class="tw-flex tw-items-center tw-gap-2">
          <span class="tw-text-lg tw-font-medium tw-text-ink/darker dark:tw-text-sky/light">{{ currentTime }}</span>

          <button-prime
            rounded
            outlined
            class="tw-w-10 tw-h-10"
            @click="closeSchedule"
          >
            <icon-base
              :icon="icons['x-close-big']"
              :width="10"
              :height="10"
              :view-box-size="[12, 12]"
            />
          </button-prime>
        </div>
      </div>

      <div class="tw-column-start tw-w-full tw-gap-4">
        <div
          v-for="(item, index) in lectures"
          :key="index"
          :class="[
            'tw-column-start tw-w-full tw-gap-3 tw-rounded-md tw-bg-sky/light dark:tw-bg-ink/darkest tw-px-4 tw-py-3 tw-transition-all tw-duration-250',
            { 'tw-border-2 tw-border-primary/base': item?.lecture_id === activeLecture?.lecture_id }
          ]"
        >
          <div class="tw-flex tw-items-start tw-justify-between tw-w-full">
            <div class="tw-column-start tw-w-full tw-gap-1">
              <span class="tw-text-sm tw-font-bold tw-text-ink/dark dark:tw-text-sky/white">
                {{ dayjs(item.start).format('HH:mm') }} - {{ dayjs(item.end).format('HH:mm') }}
              </span>

              <span class="tw-text-sm tw-font-normal tw-text-ink/dark dark:tw-text-sky/light">{{ item.name }}</span>
            </div>

            <div
              v-if="item.is_votable"
              :class="[
                'tw-flex tw-items-center tw-justify-center tw-w-7 tw-h-7 tw-cursor-pointer',
                votes.find(vote => vote.lecture_id === item.lecture_id) ? '[&_path]:tw-fill-primary/base' : '[&_path]:tw-fill-ink/darker dark:[&_path]:tw-fill-white'
              ]"
              @click="createVote({ scheduleId: schedule?.schedule_id, lectureId: item?.lecture_id })"
            >
              <icon-base
                :icon="icons['fi-rr-thumbs-up']"
                :width="15"
                :height="15"
                :view-box-size="[15, 15]"
              />
            </div>
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
import ButtonPrime from 'primevue/button'
import IconBase from '@/components/icon-base.vue'
import { TransitionFade } from '@morev/vue-transitions/vue3'

import dayjs from 'dayjs'
import icons from '@/utils/icons'
import isBetween from 'dayjs/plugin/isBetween'
import { useStore } from 'vuex'
import { ref, computed, watch, onBeforeMount } from 'vue'
import { isEmpty } from 'lodash'

dayjs.extend(isBetween)

export default {
  name: 'schedule',
  components: {
    ButtonPrime,
    IconBase,
    TransitionFade
  },
  setup () {
    const store = useStore()

    const schedule = computed(() => store.state.schedule.schedule)
    const lectures = computed(() => schedule.value.lectures.sort((a, b) => dayjs(a.start).unix() - dayjs(b.start).unix()))
    const isTheSameDate = computed(() =>
      dayjs().isSame(schedule.value.date, 'day') &&
      dayjs().isSame(schedule.value.date, 'month') &&
      dayjs().isSame(schedule.value.date, 'year')
    )
    const activeLecture = ref({})
    const isVisible = computed(() => store.state.schedule.isVisible)

    const currentTime = ref(dayjs().format('HH:mm'))
    let timeInterval

    const closeSchedule = () => {
      store.commit('schedule/SET_VISIBLE_STATE', false)
    }

    const votes = computed(() => store.state.votes.votes)
    const createVote = async ({ lectureId, scheduleId }) => {
      await store.dispatch('votes/createVote', { lectureId, scheduleId })
      await store.dispatch('votes/getVotes')
    }

    watch(
      () => schedule.value,
      (value) => {
        if (!isEmpty(value)) {
          timeInterval = setInterval(() => {
            currentTime.value = dayjs().format('HH:mm')
            activeLecture.value = schedule.value.lectures.find(item => dayjs().isBetween(item.start, item.end))
          }, 1000)
        }
      },
      { immediate: true }
    )

    onBeforeMount(() => {
      clearInterval(timeInterval)
    })

    return {
      activeLecture,
      closeSchedule,
      createVote,
      currentTime,
      dayjs,
      icons,
      isEmpty,
      isTheSameDate,
      isVisible,
      lectures,
      schedule,
      votes
    }
  }
}
</script>
