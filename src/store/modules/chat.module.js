export default {
  namespaced: true,
  state: {
    chat_id: null,
    messages: []
  },
  getters: {
    isVisible: (_state, _getters, rootState) => {
      return Boolean(rootState.section.active_section_id)
    }
  },
  mutations: {
    SET_CHAT_ID (state, id) {
      state.chat_id = id
    },
    SET_MESSAGES (state, messages = []) {
      state.messages = messages
    }
  }
}
