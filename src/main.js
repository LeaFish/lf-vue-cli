// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill';
import '@/extend/starter';

import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import store from '@/store';

import addGlobal from '@/global';
import Config from '@/config';
import Components from '@/components';
import Directive from '@/directive';
import Extend from '@/extend';

//emoji表情样式
//import 'emoji/lib/emoji.css';

//pc ui
//import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-default/index.css';
//import './styles/element-#2697f7/index.css';
//Vue.use(ElementUI);

//mobile ui
import Mint from 'mint-ui';
//import 'mint-ui/lib/style.css';
Vue.use(Mint);

Vue.use(Config);
Vue.use(Components);
Vue.use(Directive);
Vue.use(Extend);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  render: h => h(App)
});

//启用global全局变量
//addGlobal(store);
