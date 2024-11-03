import Api from '@/api'
import { API_VERSION } from '@/api/config'
import { USER_DATA } from '@/constants/storages'

export default {
  namespaced: true,
  state: {
    timer: null,
    token: null,
    user: {}
  },
  getters: {
    isLogged (state) {
      return Boolean(state.token)
    }
  },
  mutations: {
    setTimer (state, timer) {
      state.timer = timer
    },
    setToken (state, token) {
      state.token = token
    },
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    async guestLogin ({ commit }, { email, name }) {
      const { success = false, data, message = '' } = await Api.post(`/${API_VERSION}/user/guest_login`, {
        data: {
          name,
          email,
          isGuest: true
        }
      }) || {}

      if (success) {
        commit('setUser', data)

        return {
          success
        }
      } else {
        return {
          success: false,
          message
        }
      }
    },
    async login ({ commit, state }, { name, code }) {
      const { success, data = {}, message = '' } = await Api.post(`/${API_VERSION}/user/login`, {
        data: {
          code,
          name,
          email: 'example@example.com'
        }
      })

      if (success) {
        commit('setToken', data?.access_token)
        commit('setUser', data)

        localStorage.setItem(USER_DATA, JSON.stringify({
          token: state.token,
          user: state.user
        }))

        return {
          success: true
        }
      } else {
        return {
          success: false,
          message
        }
      }
    },
    async updateActivity ({ state }) {
      await Api.post(`/${API_VERSION}/user/update_activity`, {
        data: {
          code: state.user?.code
        }
      })
    }
  }
}
