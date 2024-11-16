import Api from '@/api'
import { API_VERSION } from '@/api/config'

export default {
  namespaced: true,
  state: {
    schedule: {},
    isVisible: false
  },
  mutations: {
    setVisibleState (state, value) {
      state.isVisible = value
    }
  },
  actions: {
    async getScheduleBySectionId ({ state }, id) {
      const { schedule = {} } = await Api.get(`/${API_VERSION}/schedule-by-section`, {
        params: {
          id
        }
      })

      state.schedule = schedule
    }
  }
}
