/***
 * 组件全局化
 */


const components = [

];

const prefix = 'lf';

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
  ...components
}
