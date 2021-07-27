import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import { rtdbPlugin as VueFire } from 'vuefire'

Vue.use(VueFire)

Vue.config.productionTip = false

Vue.config.errorHandler = (err, vm, info) => {
  if (process.env.NODE_ENV !== 'production') {
    // Show any error but this one
    if (err.message !== "Cannot read property 'badInput' of undefined") {
      console.error(err)
    }
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
