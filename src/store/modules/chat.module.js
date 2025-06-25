export default {
  namespaced: true,
  state: {
    chat_id: null,
    is_chat_open: false,
    messages: []
  },
  mutations: {
    SET_CHAT_ID (state, id) {
      state.chat_id = id
    },
    SET_CHAT_VISIBLE_STATE (state, value) {
      state.is_chat_open = value
    },
    SET_MESSAGES (state, messages = []) {
      state.messages = messages
    }
  }
}
