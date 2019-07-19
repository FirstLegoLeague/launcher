import Vue from 'vue'

import VueQrcode from '@xkeshi/vue-qrcode'
import '@first-lego-league/user-interface/current/app.js'
import '@first-lego-league/user-interface/current/app.css'

import App from './app'
import router from './router'

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false

Vue.component(VueQrcode.name, VueQrcode)

Object.defineProperty(Vue.prototype, 'toastr', { value: global['toastr'] })

document.addEventListener('dragover', event => {
  event.preventDefault()
  return false
}, false)

document.addEventListener('drop', event => {
  event.preventDefault()
  return false
}, false)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
