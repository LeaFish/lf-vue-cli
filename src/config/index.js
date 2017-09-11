/***
 * config配置集
 */

import base from './base';
import api from './api';
import scheme from './scheme';
import ckey from './ckey';
import image from './image';


const Config = {
  base,
  api,
  scheme,
  ckey,
  image
};

const install = function(Vue, opts = {}) {
  Vue.prototype.$config = Config;

  for(let index in Config){
    Vue.prototype['$' + index] = Config[index];
  }
};

export default {
  install,
  ...Config
}
