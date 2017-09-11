import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';
import config from '@/config';
import module from './modules/module';

Vue.use(Vuex);

// 存储状态值
let state = {
  token: null,          //用户信息凭证
  client: 1,            //客户端类型
  loading: false
};

//导入配置信息
for(let index in config){
  if(index === 'install')continue;
  state['$' + index] = config[index];
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {}
});


