<template>
  <vue-final-modal
    class="tw-flex tw-items-center tw-justify-center"
    content-transition="fade"
    content-class="tw-column-start tw-w-full tw-max-w-[1100px] tw-min-h-[240px] tw-max-h-[95%] tw-bg-white tw-rounded-lg tw-px-8 tw-py-10 tw-gap-6 tw-relative tw-overflow-y-auto scrollbar-thin"
    overlay-transition="fade"
  >
    <template #default>
      <transition-fade
        :duration="450"
        class="tw-column-start tw-w-full"
        group
      >
        <introduction
          v-if="!selectedQuiz?.is_passed && !isStarted"
          :text="selectedQuiz?.introduction_text"
          :logo="selectedQuiz?.logo"
          @start:quiz="isStarted = true"
        />

        <div
          v-if="isStarted && !isFinished"
          class="tw-column-start tw-w-full tw-gap-10"
        >
          <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
            <img
              v-if="selectedQuiz?.logo"
              :src="selectedQuiz?.logo"
              alt="logo"
              class="tw-w-[240px] tw-object-cover"
            >

            <timer
              :duration="parseInt(selectedQuiz?.duration)"
              @time-over="() => {}"
              @update:time-spent="timeSpent = $event"
            />
          </div>

          <quiz-content
            :questions="selectedQuiz?.questions || []"
            @finish:quiz="finishQuizHandler"
          />
        </div>

        <user-rating
          v-if="isFinished || selectedQuiz?.is_passed"
          :id="selectedQuiz?.quiz_id"
        />
      </transition-fade>

      <div
        class="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-rounded-full tw-cursor-pointer tw-absolute tw-top-3 tw-right-3"
        @click="$emit('update:model-value', false)"
      >
        <icon-base
          :icon="icons['x-close-big']"
          :width="10"
          :height="10"
          :view-box-size="[12, 12]"
          classes="tw-h-4 tw-w-4"
        />
      </div>
    </template>
  </vue-final-modal>
</template>

<script>
import IconBase from '@/components/icon-base.vue'
import Introduction from './components/introduction.vue'
import QuizContent from './components/quiz-content.vue'
import Timer from './components/timer.vue'
import { TransitionFade } from '@morev/vue-transitions/vue3'
import UserRating from './components/user-rating.vue'
import { VueFinalModal } from 'vue-final-modal'

import icons from '@/utils/icons'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

export default {
  name: 'quiz',
  components: {
    IconBase,
    Introduction,
    QuizContent,
    Timer,
    TransitionFade,
    UserRating,
    VueFinalModal
  },
  emits: ['update:model-value'],
  setup () {
    const store = useStore()

    const selectedQuiz = computed(() => store.getters['quiz/getSelectedQuiz'])
    const isStarted = ref(false)
    const isFinished = ref(false)
    const timeSpent = ref(0)
    const finishQuizHandler = async (results) => {
      await store.dispatch('quiz/sendUserResult', {
        quiz_id: selectedQuiz.value.quiz_id,
        time: timeSpent.value,
        answers: results
      })

      isFinished.value = true
    }

    return {
      finishQuizHandler,
      icons,
      isFinished,
      isStarted,
      selectedQuiz,
      timeSpent
    }
  }
}
</script>
