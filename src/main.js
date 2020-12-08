import Vue from 'vue'
import App from './App.vue'
import {Input, Button, Modal, Field, Numberinput, Dialog, Message} from 'buefy'
import 'buefy/dist/buefy.css'

// Vue.use(Table);
Vue.use(Input);
Vue.use(Button);
Vue.use(Modal);
Vue.use(Field);
Vue.use(Numberinput);
Vue.use(Dialog);
Vue.use(Message);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
