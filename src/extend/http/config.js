/***
 * http请求配置
 */

import store from '@/store';
import { Toast } from '@/utils/dom';

export default {
  domain: 'http://' + location.host + '/',
  serverType : 'java',                  // 服务器端语言类型 node java php
  method : 'post',                      // 默认请求方式
  timeout: 20000,                       // 请求超时时间
  format: {                             // 数据结构
    code: 'code',
    message: 'msg',
    data: 'data'
  },
  useMessage: (message,type) => {       // 消息提示器
    Toast({message});
  },
  addMustParams: config => {
    const keys = []; // 必传参数
    keys.forEach(item => config.data[item] = store.state[item] );
  },
  errorHanding(code){                   //统一的response错误处理
    let type = 'error';
    switch(code){
      //case 10001: store.dispatch('isMultiWindow');break;//单窗口检验
    }
    return type;
  },
}
