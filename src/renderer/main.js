import Vue from 'vue'

import App from './app'
import router from './router'
import VueQrcode from '@xkeshi/vue-qrcode'

import '@first-lego-league/user-interface/current/assets/css/app.css'

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false

Vue.component(VueQrcode.name, VueQrcode)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
