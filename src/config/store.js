import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    activeLanguageCode: 'en'
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    activeLanguageCode: state => state.activeLanguageCode
  },
  mutations: {
    login (state) {
      state.isLoggedIn = true
    },
    logout (state) {
      state.isLoggedIn = false
    },
    setActiveLanguageCode (state, Language) {
      state.activeLanguageCode = Language
    }
  },
  plugins: [
    createPersistedState({
      getState: (key) => Cookies.getJSON(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 3 }) /*, secure: true */
    })
  ]
})

export default store
