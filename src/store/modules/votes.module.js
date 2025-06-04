import Api from '@/api'
import { API_VERSION } from '@/api/config'
import { isEmpty } from 'lodash'

export default {
  namespaced: true,
  state: {
    votes: []
  },
  actions: {
    async getVotes ({ rootState, state }) {
      if (!rootState.translation?.active_section_id && isEmpty(rootState.schedule.schedule)) return

      const { votes } = await Api.get(`/${API_VERSION}/user/vote`, {
        params: {
          user_id: rootState.auth.user?.code_id
        }
      })

      state.votes = votes
    },
    async createVote ({ rootState }, { lectureId, scheduleId }) {
      await Api.post(`/${API_VERSION}/user/vote`, {
        data: {
          user_id: rootState.auth.user?.code_id,
          lecture_id: lectureId,
          schedule_id: scheduleId
        }
      })
    }
  }
}
