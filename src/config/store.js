import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    activeLanguageCode: 'en',
    category: '',
    seriesName: '',
    lessonName: '',
    editorId: ''
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    activeLanguageCode: state => state.activeLanguageCode,
    category: state => state.category,
    seriesName: state => state.seriesName,
    lessonName: state => state.lessonName,
    editorId: state => state.editorId
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
    },
    setCategory (state, category) {
      state.category = category
    },
    setSeriesName (state, seriesName) {
      state.seriesName = seriesName
    },
    setLessonName (state, lessonName) {
      state.lessonName = lessonName
    },
    setEditorId (state, editorId) {
      state.editorId = editorId
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
