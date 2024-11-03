<template>
  <div class="tw-column-center tw-w-full tw-gap-10">
    <!-- Текст и картинка вопроса -->
    <div class="tw-column-center tw-w-full tw-gap-4">
      <h2 class="tw-text-2xl tw-font-semibold tw-text-dark-gray">
        {{ getCurrentQuestion.content }}
      </h2>

      <img
        v-if="getCurrentQuestion?.img"
        :src="getCurrentQuestion?.img"
        alt=""
        class="tw-w-[320px]"
      >
    </div>

    <!-- Блок с ответами на вопрос -->
    <div
      :class="[
        'tw-grid tw-w-full tw-gap-4',
        { 'tw-grid-cols-2': !getCurrentQuestion?.free_answer },
        { 'tw-grid-cols-1': getCurrentQuestion?.free_answer }
      ]"
    >
      <div
        v-for="(item, index) in answers"
        :key="index"
        class="tw-column-center tw-w-full"
      >
        <!-- Обычный выбор варианта ответа -->
        <div
          v-if="!getCurrentQuestion?.free_answer"
          class="tw-column-center tw-w-full tw-gap-4 tw-px-4 tw-py-6 tw-rounded-xl tw-bg-primary tw-cursor-pointer"
          @click="onSelectAnswer(item)"
        >
          <span class="tw-text-base tw-font-normal tw-text-white">{{ item.content }}</span>

          <img
            v-if="item?.img"
            :src="item.img"
            alt=""
            class="tw-max-w-full"
          >
        </div>

        <!-- Свободный ввод ответа -->
        <div
          v-else
          class="tw-column-center tw-w-full tw-gap-4"
        >
          <span class="tw-text-lg tw-font-medium tw-text-dark-gray">
            Введите вариант ответа
          </span>

          <input-text
            :model-value="freeAnswer"
            :pt="inputTextPt"
            :type="inputTypes.TEXT"
            @update:model-value="freeAnswer = $event"
          />

          <button-prime
            label="Ответить"
            @click="onSelectAnswer({ ...item, value: freeAnswer })"
          />
        </div>
      </div>
    </div>

    <!-- Прогресс бар -->
    <progress-bar
      :model-value="currentQuestion"
      :length="questions.length"
    />
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import ProgressBar from './progress-bar.vue'
import InputText from 'primevue/inputtext'

import inputTypes from '@/constants/input-types'
import { inputTextPt } from '@/pt-options'
import { ref, computed, toRefs } from 'vue'

export default {
  name: 'quiz-content',
  components: {
    ButtonPrime,
    InputText,
    ProgressBar
  },
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  emits: ['finish:quiz'],
  setup (props, { emit }) {
    const { questions } = toRefs(props)

    const freeAnswer = ref('')
    const results = ref([])

    const currentQuestion = ref(0)
    const getCurrentQuestion = computed(() => questions.value[currentQuestion.value])

    const answers = computed(() => getCurrentQuestion.value?.answers.filter(item => Boolean(item.is_free_answer) === getCurrentQuestion.value?.free_answer))
    const onSelectAnswer = (answer) => {
      results.value.push(answer)

      if (currentQuestion.value === questions.value.length - 1) {
        emit('finish:quiz', results.value)
        return
      }

      currentQuestion.value++
    }

    return {
      answers,
      currentQuestion,
      freeAnswer,
      getCurrentQuestion,
      inputTextPt,
      inputTypes,
      onSelectAnswer
    }
  }
}
</script>
