import Vue from 'vue'
import App from './install.vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Form, FormItem, Input, Button, Col } from 'element-ui'

Vue.component(Form.name, Form)
Vue.component(Input.name, Input)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Col.name, Col)

new Vue({
  el: '#app',
  render: h => h(App)
})
