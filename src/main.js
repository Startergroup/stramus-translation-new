import router from './router'
import store from './store'
import { createApp } from 'vue'

import App from './app.vue'
import ToastCloseButton from '@/components/toast/toast-close-button.vue'

import { createVfm } from 'vue-final-modal'
import PrimeVue from 'primevue/config'
import Toast from 'vue-toastification'
import { i18n } from '@/localization/i18n'
import { firebaseConfig } from './firebase.config'
import { initializeApp } from 'firebase/app'

import 'primevue/resources/themes/aura-light-indigo/theme.css'
import 'vue-toastification/dist/index.css'
import 'vue-final-modal/style.css'
import '@/styles/main.scss'

const app = createApp(App)
const vfm = createVfm()

initializeApp(firebaseConfig)

app
  .use(store)
  .use(router)
  .use(vfm)
  .use(i18n)
  .use(PrimeVue)
  .use(Toast, {
    toastClassName: 'tw-column-start tw-py-4 tw-px-6 tw-border tw-border-light-gray tw-rounded tw-bg-white tw-relative tw-w-[420px] tw-shadow-none',
    containerClassName: 'toast_container',
    bodyClassName: 'tw-flex',
    hideProgressBar: true,
    icon: false,
    timeout: 3000,
    closeButton: ToastCloseButton,
    closeOnClick: false,
    draggable: false
  })
  .mount('#app')
