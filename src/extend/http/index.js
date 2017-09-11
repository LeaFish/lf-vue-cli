/***
 * http请求处理
 */

import axios from 'axios';
import { formParams } from '@/utils/util';
import httpConfig from './config';

/***
 * 必传参数
 *
 */
const serverType = httpConfig.serverType?httpConfig.serverType:'java';          //服务器端语言类型 node java php
const method = httpConfig.method?httpConfig.method:'post';                      //默认请求方式
const domain = httpConfig.domain?httpConfig.domain:'http://' + location.host + '/';

/***
 * 默认使用的提示器
 * @param message
 * @param type
 */
const useMessage = (message,type) => {
  if(typeof httpConfig.useMessage === 'function'){
    if(String(message).length >= 15)message = '服务器出错啦,请稍候再试';
    httpConfig.useMessage(message,type);
  }else{
    alert(message);
  }
};


/***
 * 创建axios实例
 */
const service = axios.create({
  baseURL: process.env.BASE_API,  // api的base_url
  timeout: httpConfig.timeout?httpConfig.timeout:20000                  // 请求超时时间
});

/***
 * request拦截器
 */
service.interceptors.request.use(config => {
  // Do something before request is sent


  config.method && (config.method = method);
  config.data || (config.data = {});
  httpConfig.addMustParams(config);
  //java spring 需要表单化request参数,服务器端才能接收到,node服务器则不需要
  (serverType == 'java') && (config.data = formParams(config.data));

  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
});

/***
 * respone拦截器
 */
service.interceptors.response.use(
   response => {
     const code = response.data[httpConfig.format.code];
     const message = response.data[httpConfig.format.message];
     const data = response.data[httpConfig.format.data];

     if (code !== 200) {
       //统一处理的错误
       let type = httpConfig.errorHanding(code);

       useMessage(message,type);
       return Promise.reject(message);
     } else {
       return response.data;
     }
   }
  ,
  error => {
    if(/timeout/.test(error)){
      useMessage('请求超时','error');
    }else{
      console.log('err' + error);// for debug
      useMessage('请求失败','error');
    }

    return Promise.reject(error);
  }
);



export default (api,data) => service(domain + api,{data});
