<template>
  <div class="tw-column-start tw-w-full lg:tw-w-[320px] tw-px-4 tw-py-6 tw-gap-10 tw-rounded-md tw-bg-sky/white dark:tw-bg-ink/darker tw-max-h-full tw-overflow-y-auto tw-relative tw-order-2 lg:tw-order-[unset]">
    <div class="tw-flex tw-items-center tw-w-full tw-justify-between">
      <h3 class="tw-text-xl tw-font-bold tw-text-ink/darkest dark:tw-text-sky/white">
        {{ schedule.section_name }}
      </h3>

      <div class="tw-flex tw-items-center tw-gap-2">
        <span class="tw-text-lg tw-font-medium tw-text-ink/darker dark:tw-text-sky/light">
          {{ current_time }}
        </span>

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
          { 'tw-border-2 tw-border-primary/base': item?.lecture_id === current_lecture_id }
        ]"
        :data-lecture-id="item?.lecture_id"
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
            :title="votes.find(vote => vote.lecture_id === item.lecture_id) ? 'Ваш голос принят!' : 'Проголосовать за доклад'"
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
          <span class="tw-text-sm tw-font-bold tw-text-ink/dark dark:tw-text-sky/white">
            {{ item.fio }}
          </span>

          <span class="tw-text-sm tw-font-medium tw-text-ink/dark dark:tw-text-sky/white">
            {{ item.company }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import IconBase from '@/components/icon-base.vue'

import dayjs from 'dayjs'
import icons from '@/utils/icons'
import isBetween from 'dayjs/plugin/isBetween'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useStore } from 'vuex'
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { isEmpty, cloneDeep } from 'lodash'

dayjs.extend(isBetween)
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.tz.setDefault('Europe/Moscow')

export default {
  name: 'schedule',
  components: {
    ButtonPrime,
    IconBase
  },
  setup () {
    const store = useStore()

    const votes = computed(() => store.state.votes.votes)
    const createVote = async ({ lectureId, scheduleId }) => {
      await store.dispatch('votes/createVote', { lectureId, scheduleId })
      await store.dispatch('votes/getVotes')
    }

    const schedule = computed(() => store.state.schedule.schedule)
    const lectures = computed(() => cloneDeep(schedule.value.lectures).sort((a, b) => dayjs(a.start).unix() - dayjs(b.start).unix()))
    const current_lecture_id = computed(() => store.state.schedule.active_lecture_id)
    const closeSchedule = () => {
      store.commit('schedule/SET_VISIBLE_STATE', false)
    }

    const current_time = ref(dayjs().format('HH:mm'))
    let current_time_interval_id = null

    onMounted(() => {
      current_time_interval_id = setInterval(() => {
        current_time.value = dayjs().format('HH:mm')
      }, 60000)
    })
    onBeforeUnmount(() => {
      clearInterval(current_time_interval_id)
    })

    watch(
      () => current_lecture_id.value,
      async (lecture_id) => {
        if (!lecture_id) return

        await nextTick()

        const current_lecture_element = document.querySelector(`[data-lecture-id="${lecture_id}"]`)

        if (current_lecture_element) {
          current_lecture_element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      },
      { immediate: true }
    )

    return {
      closeSchedule,
      createVote,
      current_lecture_id,
      current_time,
      dayjs,
      icons,
      isEmpty,
      lectures,
      schedule,
      votes
    }
  }
}
</script>
