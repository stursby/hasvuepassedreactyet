import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'UA-120813208-1'
})

new Vue({
  render: h => h(App)
}).$mount('#app')
