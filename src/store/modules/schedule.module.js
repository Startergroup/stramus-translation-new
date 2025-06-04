import Api from '@/api'
import { API_VERSION } from '@/api/config'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import { isEmpty } from 'lodash'

dayjs.extend(isBetween)
dayjs.extend(timezone)
dayjs.extend(utc)

// Интервал проверки текущего доклада (5 мин)
const CHECK_CURRENT_LECTURE_INTERVAL = 300000

export default {
  namespaced: true,
  state: {
    active_lecture_id: null,
    is_visible: false,
    lecture_interval_id: null,
    lecture_views_interval_id: null,
    schedule: {}
  },
  getters: {
    lectures (state) {
      return state.schedule?.lectures || []
    }
  },
  mutations: {
    SET_LECTURE_VIEWS_INTERVAL_ID (state, id) {
      state.lecture_views_interval_id = id
    },
    SET_VISIBLE_STATE (state, value) {
      state.is_visible = value
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
    },
    runIntervalCheckCurrentLecture ({ state, getters, dispatch }) {
      clearInterval(state.lecture_interval_id)

      state.lecture_interval_id = setInterval(() => {
        dispatch('setActiveLecture')
      }, CHECK_CURRENT_LECTURE_INTERVAL)
    },
    setActiveLecture ({ getters, state }) {
      const current_lecture = getters.lectures.find(lecture => dayjs().isBetween(dayjs(lecture.start), dayjs(lecture.end)))

      if (!isEmpty(current_lecture)) {
        state.active_lecture_id = current_lecture.lecture_id
      }
    },
    intervalSendLectureViews ({ state, rootState }) {
      if (!state.active_lecture_id) return

      state.lecture_views_interval_id = setInterval(async () => {
        await Api.post(`/${API_VERSION}/lecture/views`, {
          data: {
            user_id: rootState.auth.user?.code_id,
            lecture_id: state.active_lecture_id,
            timestamp: dayjs().tz('Europe/Moscow').valueOf()
          }
        })
      }, 15000)
    }
  }
}
