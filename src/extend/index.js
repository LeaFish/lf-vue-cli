import http from './http';

const extend = {
  http
};


const install = function(Vue, opts = {}) {
  for(let index in extend){
    Vue.prototype['$' + index] = extend[index];
  }
};

export default {
  install
}
