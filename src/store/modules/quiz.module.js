import Api from '@/api'
import { API_VERSION } from '@/api/config'

export default {
  namespaced: true,
  state: {
    quizzes: [],
    rating: [],
    selectedQuizId: null
  },
  getters: {
    getActiveQuizzes (state) {
      return state.quizzes.filter(item => item?.is_active)
    },
    getSelectedQuiz (state) {
      if (!state.selectedQuizId) return {}

      return state.quizzes.find(item => parseInt(item.quiz_id) === parseInt(state.selectedQuizId) && item?.is_active)
    }
  },
  mutations: {
    setSelectedQuizId (state, id) {
      state.selectedQuizId = id
    }
  },
  actions: {
    async getQuizzes ({ rootState, state }) {
      const { data = [] } = await Api.get(`/${API_VERSION}/user/quiz`, {
        params: {
          user_id: rootState.auth.user?.code_id
        }
      }) || {}

      state.quizzes = data
    },
    async getUserRating ({ state }, id) {
      state.rating = await Api.get(`/${API_VERSION}/user/quiz/rate`, {
        params: {
          quiz_id: id
        }
      })
    },
    async sendUserResult ({ rootState }, payload) {
      return await Api.post(`/${API_VERSION}/user/quiz`, {
        data: {
          ...payload,
          user_id: rootState.auth.user?.code_id
        }
      })
    }
  }
}
