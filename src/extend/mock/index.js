import Mock from 'mockjs';
import baseConfig from '../../config/base';
import Api from '../../config/api';
import { response } from './response';

/***
 * 数据模拟
 */


const useMock = (ifName, data) => {
  if(data !== undefined){
    Mock.mock(new RegExp(ifName), response(Api)[data]);
  }else{
    Mock.mock(new RegExp(ifName), response(Api)[ifName]);
  }
};


export default function(){
  if (baseConfig.mock) {
    //启动拦截
    useMock(Api.login);
    useMock(Api.praise,'success');
  }
};
