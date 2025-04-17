import store from '@/store'

export default async (to, from, next) => {
  const timer = store.state.auth.timer
  const user = store.state.auth.user

  if (to.meta.isProtected) {
    if (timer) {
      clearInterval(timer)
    }

    if (user?.isGuest) {
      return next()
    }

    if (store.getters['auth/isLogged']) {
      store.commit('auth/SET_TIMER', setInterval(() => {
        store.dispatch('auth/updateActivity')
      }, 10000))

      return next()
    }

    return next('/auth')
  } else if (to.name === 'auth' && store.getters['auth/isLogged']) {
    store.commit('auth/SET_TIMER', setInterval(() => {
      store.dispatch('auth/updateActivity')
    }, 10000))

    return next('/')
  }

  clearInterval(timer)

  return next()
}
