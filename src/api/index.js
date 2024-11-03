import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { BASE_URL } from './config'
import { USER_DATA } from '@/constants/storages'

class Api {
  #client

  constructor () {
    this.#client = axios.create({
      baseURL: BASE_URL
    })
  }

  async execute (method, url, { params = {}, data = {} }) {
    try {
      const token = store.state.auth.token
      const headers = {
        Authorization: `Basic ${token}`
      }
      const options = {
        method,
        url,
        params,
        data,
        headers
      }
      const result = await this.#client(options)

      return result?.data || {}
    } catch (error) {
      console.error(error)

      if (error.request.status === 401) {
        clearInterval(store.state.auth.timer)

        store.commit('auth/setTimer', null)
        store.commit('auth/setToken', null)
        store.commit('auth/setUser', null)

        localStorage.setItem(USER_DATA, null)

        await router.push({ name: 'auth' })
      }

      throw Error(error)
    }
  }

  get (url, { params = {} } = {}) {
    return this.execute('get', url, { params })
  }

  post (url, { params = {}, data = {} }) {
    return this.execute('post', url, { data })
  }

  put (url, { params = {}, data = {} }) {
    return this.execute('put', url, { data })
  }

  delete (url, { data = {} }) {
    return this.execute('delete', url, { data })
  }
}

export default new Api()
