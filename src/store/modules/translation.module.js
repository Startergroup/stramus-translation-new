import Api from '@/api'
import { API_VERSION } from '@/api/config'

export default {
  namespaced: true,
  state: {
    activeTabId: null,
    tabs: []
  },
  getters: {
    getActiveTab (state) {
      if (!state.activeTabId) return {}

      return state.tabs.find(tab => tab?.tab_id === state.activeTabId)
    }
  },
  mutations: {
    SET_ACTIVE_TAB_ID (state, id) {
      state.activeTabId = id
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
