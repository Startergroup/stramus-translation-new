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
    setActiveTabId (state, id) {
      state.activeTabId = id
    }
  },
  actions: {
    async getTabs ({ state }) {
      state.tabs = await Api.get(`/${API_VERSION}/tabs`).then(res => res?.data || [])
    }
  }
}
