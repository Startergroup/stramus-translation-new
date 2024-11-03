<template>
  <div class="tw-column-center tw-w-full tw-gap-6">
    <img
      v-if="logo"
      :src="logo"
      alt="quiz logo"
      class="tw-w-[320px]"
    >

    <span class="tw-text-lg tw-font-medium tw-text-black tw-text-center">{{ text }}</span>

    <button-primary
      label="Учавствую!"
      @click="$emit('start:quiz')"
    />
  </div>
</template>

<script>
import ButtonPrimary from 'primevue/button'

export default {
  name: 'introduction',
  components: {
    ButtonPrimary
  },
  props: {
    logo: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    }
  },
  emits: ['start:quiz']
}
</script>
