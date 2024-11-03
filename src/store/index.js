import { createStore } from 'vuex'

import auth from './modules/auth.module'
import quiz from './modules/quiz.module'
import settings from './modules/settings.module'
import translation from './modules/translation.module'
import votes from './modules/votes.module'

export default createStore({
  modules: {
    auth,
    quiz,
    settings,
    translation,
    votes
  }
})