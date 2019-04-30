import Vue from 'vue'
// import router from './router'

import App from './App'

import * as filters from './filters'

import 'normalize.css/normalize.css'
import './styles/index.scss'

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  // router,
  render: h => h(App)
}).$mount('#app')
