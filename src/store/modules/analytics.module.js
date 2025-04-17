import { USER_SECTION_ACTIVITY } from '@/constants/storages'

// Минимальное время, которое надо провести в секции чтобы засчитать просмотр
const CHECK_ACTIVITY_INTERVAL = 30000

export default {
  namespaced: true,
  state: {
    section_activity: [],
    interval_id: null
  },
  mutations: {
    /**
     * @param state
     * @param { tab_id: number } tab_id
     */
    APPEND_SECTION_ACTIVITY (state, tab_id) {
      if (!tab_id) {
        return
      }

      if (state.section_activity.some(item => item.tab_id === tab_id)) {
        return
      }

      state.section_activity.push({
        tab_id,
        start_time: new Date().getTime()
      })
    },
    /**
     * @param state
     * @param { { tab_id: number, start_time: number, end_time: number }[] } activities
     */
    SET_SECTION_ACTIVITIES (state, activities) {
      state.section_activity = activities
    },
    /**
     * @param state
     * @param { tab_id: number } tab_id
     */
    UPDATE_ACTIVITY_END_TIME (state, tab_id) {
      clearInterval(state.interval_id)
      state.interval_id = null

      const target_activity = state.section_activity.find(item => item.tab_id === tab_id)

      if (Object.hasOwn(target_activity, 'end_time')) {
        return
      }

      if (target_activity) {
        target_activity.end_time = new Date().getTime()

        if ((target_activity.end_time - target_activity.start_time) < CHECK_ACTIVITY_INTERVAL) {
          const target_activity_index = state.section_activity.findIndex(item => item.tab_id === tab_id)
          state.section_activity.splice(target_activity_index, 1)

          return
        }

        localStorage.setItem(USER_SECTION_ACTIVITY, JSON.stringify(state.section_activity))
      }
    }
  },
  actions: {
    periodicActivityCheck ({ state, rootState, commit, dispatch }) {
      state.interval_id = setInterval(() => {
        commit('UPDATE_ACTIVITY_END_TIME', rootState.translation.activeTabId)
      }, CHECK_ACTIVITY_INTERVAL)
    },
    sendAnalytics ({ state, rootState }) {
      const mapped_data = state.section_activity.map(item => ({
        ...item,
        code_id: rootState.auth.user?.code_id
      }))

      console.debug('Analytics was send: ', mapped_data)
    }
  }
}
