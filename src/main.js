import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'summernote/dist/summernote-lite.js'
import 'summernote/dist/summernote-lite.css'
import axios from "axios";

Vue.use(ElementUI)

axios.defaults.baseURL="http://127.0.0.1:8000/"
Vue.config.productionTip = false
Vue.prototype.$http=axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

