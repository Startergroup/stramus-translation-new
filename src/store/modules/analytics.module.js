import Api from '@/api'
import { API_VERSION } from '@/api/config'

// Интервал с которым отправляем запрос для обновления
// данных о том, какую вкладку просматривает пользователь
// Интервал равен 5 мин
const SENDING_INTERVAL = 300000

export default {
  namespaced: true,
  state: {
    interval_id: null
  },
  mutations: {
    CLEAR_INTERVAL (state) {
      clearInterval(state.interval_id)
      state.interval_id = null
    }
  },
  actions: {
    // TODO: Переработать логику в модуле и в боковом меню
    async onChangeTab ({ rootState, state }) {
      if (!rootState.translation?.activeTabId) return

      await Api.post(`/${API_VERSION}/analytics/section-views`, {
        data: {
          tab_id: rootState.translation?.activeTabId,
          user_id: rootState.auth.user?.code_id,
          start_time: new Date().getTime()
        }
      })
    },
    periodicSendSectionActivity ({ rootState, state }) {
      state.interval_id = setInterval(async () => {
        if (!rootState.translation?.activeTabId) return

        await Api.post(`/${API_VERSION}/analytics/section-views`, {
          data: {
            tab_id: rootState.translation?.activeTabId,
            user_id: rootState.auth.user?.code_id,
            start_time: new Date().getTime()
          }
        })
      }, SENDING_INTERVAL)
    }
  }
}
