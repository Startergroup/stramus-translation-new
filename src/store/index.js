import { createStore } from 'vuex'

import auth from './modules/auth.module'
import chat from './modules/chat.module'
import quiz from './modules/quiz.module'
import section from './modules/section.module'
import settings from './modules/settings.module'
import schedule from './modules/schedule.module'
import votes from './modules/votes.module'

export default createStore({
  modules: {
    auth,
    chat,
    quiz,
    section,
    settings,
    schedule,
    votes
  }
})
