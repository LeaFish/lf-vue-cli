import { on , off , scrollTop } from '../utils/dom';
import { extend , isFunction } from '../utils/util';

/***
 * 数据寄存器
 * @type {{}}
 */
let data = {};

/***
 * scroll callback
 */
let scrollCallback = function() {
  if(scrollTop() + window.innerHeight >= data.el.clientHeight) {
    data.fn();
  }
};


/***
 * 无限滚动加载
 * @type {{name: string, inserted: (function(*, *)), unbind: (function())}}
 */
const infiniteScroll = {
  name: 'scroll',
  // 当绑定元素插入到 DOM 中。
  inserted(el,binding) {
    if(!isFunction(binding.value)){
      return console.warn('The binding.value must is a function.');
    }
    extend(data,{el,fn: binding.value});

    on(window,'scroll',scrollCallback);
  },
  unbind() {
    off(window,'scroll',scrollCallback);
  }
};


export default infiniteScroll;
