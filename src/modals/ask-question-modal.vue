<template>
  <vue-final-modal
    class="tw-flex tw-items-center tw-justify-center"
    content-transition="fade"
    content-class="tw-column-start tw-w-full tw-max-w-[640px] tw-bg-white dark:tw-bg-ink/darker tw-rounded-lg tw-px-6 tw-py-10 tw-gap-6"
    overlay-transition="fade"
    @closed="$emit('update:model-value', false)"
  >
    <template #default>
      <h2 class="tw-text-xl tw-font-medium tw-text-black dark:tw-text-sky/white tw-leading-[normal]">
        {{ $t('message.questionTitle') }}
      </h2>

      <form
        class="tw-column-start tw-w-full tw-gap-6"
        @submit.prevent="onSubmit"
      >
        <div class="tw-column-start tw-w-full tw-gap-2">
          <textarea-prime
            :model-value="form.comment.value"
            :name="form.comment.name"
            :placeholder="form.comment.props.placeholder"
            :invalid="Object.hasOwn(errors, 'comment')"
            auto-resize
            rows="5"
            cols="30"
            :pt="textareaPt"
            @update:model-value="form.comment.value = $event"
          />

          <small class="tw-text-xs tw-font-medium tw-text-error dark:tw-border-red-500">{{ errors?.comment }}</small>
        </div>

        <div class="tw-flex tw-items-center tw-justify-end tw-gap-4 tw-w-full">
          <button-prime
            type="submit"
            :label="$t('message.questionButton')"
          />

          <button-prime
            :label="$t('message.cancel')"
            severity="danger"
            @click="$emit('update:model-value', false)"
          />
        </div>
      </form>
    </template>
  </vue-final-modal>
</template>

<script>
import ButtonPrime from 'primevue/button'
import TextareaPrime from 'primevue/textarea'
import Toast from '@/components/toast/toast-template.vue'
import { VueFinalModal } from 'vue-final-modal'

import * as yup from 'yup'
import { textareaPt } from '@/pt-options'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { getForm } from '@/composables/form.composables'
import { useToast } from 'vue-toastification'
import { getDatabase, ref, set } from 'firebase/database'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'ask-question-modal',
  components: {
    ButtonPrime,
    TextareaPrime,
    VueFinalModal
  },
  emits: ['update:model-value'],
  setup (props, { emit }) {
    const { t } = useI18n()
    const toast = useToast()
    const store = useStore()

    const activeTabId = computed(() => store.state.translation.activeTabId)
    const activeTab = computed(() => store.getters['translation/getActiveTab'])

    const { form, errors, handleSubmit } = getForm({
      items: [{
        name: 'comment',
        props: {
          placeholder: computed(() => t('message.enterComment'))
        }
      }],
      initialValues: {
        comment: ''
      },
      validationSchema: yup.object().shape({
        comment: yup.string().required(computed(() => t('message.requiredField')))
      })
    })
    const onSubmit = handleSubmit((values) => {
      if (!activeTabId.value) {
        toast({
          component: Toast,
          props: {
            title: 'Ошибка',
            message: 'Не выбрана ни одна секция'
          }
        }, {
          timeout: 5000
        })

        return
      }

      const db = getDatabase()
      const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

      set(ref(db, `${activeTab.value.name}/${uuidv4()}`), {
        comment: values.comment,
        date
      })
      toast({
        component: Toast,
        props: {
          title: 'Успешно',
          message: 'Вопрос отправлен'
        }
      }, {
        timeout: 5000
      })
      emit('update:model-value', false)
    })

    return {
      form,
      errors,
      handleSubmit,
      onSubmit,
      textareaPt
    }
  }
}
</script>
