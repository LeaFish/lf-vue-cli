import Vue from 'vue';
import Router from 'vue-router';
import router from './config';
import { extend } from '@/utils/util';

Vue.use(Router);

//获取组件内容
function generateResolve(str) {
  return resolve => require(['@/pages/' + str + '/index'], resolve);
}

//拼接参数
function getParamStr(params) {
  var str = '';
  if (Array.isArray(params) && params.length > 0) {
    params.forEach(item => {
      str = str + '/:' + item
    })
  }
  return str;
}

function generateRoutes(routerArr, name, path, page) {
  let route = [];
  routerArr.forEach(item => {
    var obj = new Object(null);
    extendMainKey(obj, item, name, path);
    obj.component = generateResolve(page ? page + '/' + item.page : item.page);
    if (item.children) {
      obj.children = generateRoutes(item.children, obj.name, obj.path, page ? page + '/' + item.page : item.page);
    }
    route.push(obj);
  });
  return route;
}


function extendMainKey(obj, item, name, path) {
  //生成/连接符path
  obj.path = item.page.replace(/([A-Z])/g, "/$1").toLowerCase();
  //添加参数
  obj.path = obj.path + getParamStr(item.param);

  (path === undefined) || (obj.path = path + obj.path);
  //name驼峰格式化
  obj.name = name === undefined ? (item.page.substr(0, 1).toLowerCase() + item.page.substr(1)) : (name + item.page);
}


var routes = generateRoutes(router);

//默认跳转页面
routes.push({path: '*', redirect: routes[0].path});


export default new Router({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})


