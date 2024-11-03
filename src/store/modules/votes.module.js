import Api from '@/api'
import { API_VERSION } from '@/api/config'

export default {
  namespaced: true,
  state: {
    votes: {}
  },
  actions: {
    async getVotes ({ rootState, state }) {
      if (!rootState.translation?.activeTabId) return

      const { data } = await Api.get(`/${API_VERSION}/user/vote`, {
        params: {
          tab_id: rootState.translation?.activeTabId,
          user_id: rootState.auth.user?.code_id
        }
      }).then(res => res?.data || {})

      state.votes = data
    },
    async createVote ({ rootState }, { presentationId, value }) {
      await Api.post(`/${API_VERSION}/user/vote`, {
        data: {
          user_id: rootState.auth.user?.code_id,
          presentation_id: presentationId,
          like: value
        }
      })
    }
  }
}
