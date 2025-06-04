import Api from '@/api'
import { API_VERSION } from '@/api/config'

export default {
  namespaced: true,
  state: {
    active_section_id: null,
    tabs: []
  },
  getters: {
    getActiveTab (state) {
      if (!state.active_section_id) return {}

      return state.tabs.find(tab => tab?.tab_id === state.active_section_id)
    }
  },
  mutations: {
    SET_ACTIVE_TAB_ID (state, id) {
      state.active_section_id = id
    }
  },
  actions: {
    async getTabs ({ state, rootState }) {
      // При гостевом доступе стрим не показываем
      if (rootState.auth?.user?.isGuest) return

      state.tabs = await Api.get(`/${API_VERSION}/tabs`).then(res => res?.data || [])
    }
  }
}
