/***
 * 自定义全局指令
 */

import ImageEvent from './imageEvent';
import InfiniteScroll from './infiniteScroll';


const directives = [
  ImageEvent,
  InfiniteScroll
];

const install = function(Vue, opts = {}) {
  directives.map(directive => {
    Vue.directive(directive.name, directive);
  });
};

export default {
  install
}
