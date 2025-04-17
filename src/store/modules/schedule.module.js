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
    SET_VISIBLE_STATE (state, value) {
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

      state.schedule = schedule.find(item => (
        dayjs().isSame(item?.date, 'year') &&
        dayjs().isSame(item?.date, 'month') &&
        dayjs().isSame(item?.date, 'day')
      ))
    }
  }
}
