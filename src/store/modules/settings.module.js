import Api from '@/api'
import { API_VERSION } from '@/api/config'
import { i18n } from '@/localization/i18n'

export default {
  namespaced: true,
  state: {
    darkMode: true,
    cinemaMode: false,
    /**
     * @param { { favicon: string, setting_id: number, subtitle_en: string, subtitle_ru: string, title_en: string, title_ru: string } | null }
     */
    options: null
  },
  getters: {
    getTitle (state) {
      if (!state.options) return ''

      return state.options[`title_${i18n.global.locale.value}`]
    },
    getSubtitle (state) {
      if (!state.options) return ''

      return state.options[`subtitle_${i18n.global.locale.value}`]
    }
  },
  mutations: {
    setTheme (state, isDarkMode) {
      state.darkMode = isDarkMode
      document.querySelector('html').setAttribute('data-mode', isDarkMode ? 'dark' : 'light')
    },
    switchCinemaMode (state, value) {
      state.cinemaMode = value
    }
  },
  actions: {
    async getSettings ({ state }) {
      state.options = await Api.get(`/${API_VERSION}/settings`, {}).then(res => res?.data)
    }
  }
}
