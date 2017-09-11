// actions里存放的是异步操作
// 由于vuex中的state的变更只能由mutations进行操作，所以actions不直接进行数据操作，而是调用mutations方法
// 以下出现的that都是vue实例对象，因为把axios绑定在了Vue原型上，vuex无法调用，所以这里需要传入this
import router from '@/router';                // 路由管理
import $http from '@/extend/http';
import { isExist } from '@/utils/util';


const actions = {
  //应用初始化
  appInit({dispatch,commit,rootState,state},data){

  },

};

export default actions;
