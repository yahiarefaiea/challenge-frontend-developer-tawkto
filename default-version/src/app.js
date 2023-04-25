import 'core-js/es/promise' // required for Promise support
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})