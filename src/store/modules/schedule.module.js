import Api from '@/api'
import { API_VERSION } from '@/api/config'
import dayjs from 'dayjs'

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

      if (
        dayjs().isSame(schedule?.date, 'year') &&
        dayjs().isSame(schedule?.date, 'month') &&
        dayjs().isSame(schedule?.date, 'day')
      ) {
        state.schedule = schedule
      }
    }
  }
}
