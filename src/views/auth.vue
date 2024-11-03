<template>
  <div class="tw-grid tw-grid-cols-1 xl:tw-grid-cols-2 tw-w-full tw-h-full">
    <div class="tw-hidden xl:tw-column-center tw-justify-center tw-w-full tw-gap-2 tw-bg-transparent tw-px-10">
      <h2 class="tw-text-6xl tw-font-bold tw-text-black dark:tw-text-white tw-text-center">
        {{ getTitle }}
      </h2>

      <span class="tw-text-lg tw-font-medium tw-text-black dark:tw-text-white tw-text-center">
        {{ getSubtitle }}
      </span>
    </div>

    <div class="tw-column-center tw-justify-center tw-w-full tw-bg-white dark:tw-bg-ink/base tw-px-4 xl:tw-px-0">
      <div class="tw-column-start tw-w-full tw-max-w-[480px] tw-gap-8">
        <h3 class="tw-text-xl tw-font-semibold tw-text-dark-gray dark:tw-text-white">
          {{ $t('message.authTitle') }}
        </h3>

        <div class="tw-column-start tw-w-full tw-rounded-md tw-bg-white dark:tw-bg-ink/darker tw-shadow-md tw-px-4 tw-py-6">
          <form
            class="tw-column-start tw-w-full tw-gap-8"
            @submit.prevent="onSubmit"
          >
            <div class="tw-column-start tw-w-full tw-gap-4">
              <div
                v-for="(item, index) in form"
                :key="index"
                class="tw-column-start tw-w-full tw-gap-2"
              >
                <div class="tw-flex tw-items-center tw-w-full tw-gap-2">
                  <span class="tw-text-xs tw-font-bold tw-text-gray dark:tw-text-light-gray">
                    {{ item.props?.label }}
                  </span>

                  <tippy
                    v-if="item.name === 'code'"
                    class="tippy"
                    content-class="tw-column-start tw-gap-2"
                    theme="gray"
                    trigger="mouseenter"
                  >
                    <template #default>
                      <div class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-middle-gray dark:tw-bg-ink/base tw-cursor-pointer">
                        <icon-base
                          :icon="icons['question']"
                          :width="20"
                          :height="20"
                          :view-box-size="[20, 20]"
                          fill="transparent"
                        />
                      </div>
                    </template>

                    <template #content>
                      <span class="tw-text-sm tw-font-normal tw-text-black">
                        {{ $t('message.codeHint') }}
                      </span>
                    </template>
                  </tippy>
                </div>

                <div class="tw-w-full tw-relative">
                  <input-text
                    :model-value="item.value"
                    :name="item.name"
                    :placeholder="item.props?.placeholder"
                    :pt="inputTextPt"
                    :invalid="Object.hasOwn(errors, item.name)"
                    :type="item.props?.type"
                    @update:model-value="item.value = $event"
                  />

                  <icon-base
                    v-if="item.name === 'code'"
                    :icon="item.props?.isCodeVisible ? icons['eye-off'] : icons['eye']"
                    :width="18"
                    :height="15"
                    :view-box-size="[20, 18]"
                    class="tw-flex tw-items-center tw-absolute tw-inset-y-0 tw-my-auto tw-right-4 tw-z-10 tw-cursor-pointer dark:[&_path]:tw-fill-white"
                    @click="onChangeCodeVisibility"
                  />
                </div>

                <small class="tw-text-xs tw-font-medium tw-text-error dark:tw-red-500">
                  {{ errors[item.name] }}
                </small>
              </div>
            </div>

            <button-prime
              type="submit"
              :label="$t('message.enterButton')"
              class="tw-w-full tw-cursor-pointer"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonPrime from 'primevue/button'
import IconBase from '@/components/icon-base.vue'
import InputText from 'primevue/inputtext'
import { Tippy } from 'vue-tippy'
import Toast from '@/components/toast/toast-template.vue'

import * as yup from 'yup'
import icons from '@/utils/icons'
import inputTypes from '@/constants/input-types'
import { inputTextPt } from '@/pt-options'
import { getForm } from '@/composables/form.composables'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

export default {
  name: 'auth',
  components: {
    ButtonPrime,
    IconBase,
    InputText,
    Tippy
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()
    const { t } = useI18n()

    const getTitle = computed(() => store.getters['settings/getTitle'])
    const getSubtitle = computed(() => store.getters['settings/getSubtitle'])

    const { errors, form, handleSubmit } = getForm({
      items: [
        {
          name: 'name',
          props: {
            label: computed(() => t('message.name')),
            placeholder: computed(() => t('message.enterName')),
            type: inputTypes.TEXT
          }
        },
        {
          name: 'code',
          props: {
            isCodeVisible: false,
            label: computed(() => t('message.code')),
            placeholder: computed(() => t('message.enterKey')),
            type: inputTypes.PASS
          }
        }
      ],
      initialValues: {
        name: '',
        code: ''
      },
      validationSchema: yup.object().shape({
        name: yup.string().required(computed(() => t('message.requiredField'))),
        code: yup.string().required(computed(() => t('message.requiredField')))
      })
    })
    const onSubmit = handleSubmit(async (values) => {
      const { success, message = '' } = await store.dispatch('auth/login', values)

      if (success) {
        await router.push({ name: 'home' })
      } else {
        toast({
          component: Toast,
          props: {
            title: 'Ошибка',
            message
          }
        }, {
          timeout: 5000
        })
      }
    })

    const onChangeCodeVisibility = () => {
      const codeField = form.value.code

      codeField.props.isCodeVisible = !codeField.props.isCodeVisible
      codeField.props.type = codeField.props.isCodeVisible ? inputTypes.TEXT : inputTypes.PASS
    }

    return {
      errors,
      form,
      getTitle,
      getSubtitle,
      icons,
      inputTextPt,
      onChangeCodeVisibility,
      onSubmit
    }
  }
}
</script>
