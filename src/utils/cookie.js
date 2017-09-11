/***
 * cookie
 */




/***
 * 获取cookie
 * @param name
 * @returns {null}
 */
export const getCookie = function (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)){
    return unescape(arr[2]);
  } else return null;
};

/***
 * 设置cookie
 * @param name
 * @param value
 * @param time
 * @param path
 */
export const setCookie = function (name, value, time, path) {
  var strsec = getsec(time);
  var exp = new Date();
  exp.setTime(exp.getTime() + strsec * 1);
  let paths = path == undefined ? '':'; path=/';
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + paths;
};

/***
 * 删除指定cookie
 * @param name
 * @param path
 * @param fn
 */
export const deleteCookie = function (name,path,fn) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  let paths = path == undefined ? '':'; path=/';
  if (cval != null)document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + paths;
  typeof fn === 'function' &&fn();
};

/***
 * 清空cookie
 * @param path
 * @param fn
 */
export const clearCookie = function (path,fn) {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  var paths = path == undefined ? '':'; path=/';
  if (keys) {
    for (var i =  keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + paths;
  }
  typeof fn === 'function' &&fn();
};


/***
 * 有效期规则
 * @param str
 * @returns {number}
 */
function getsec(str){
  var str1=str.substring(1,str.length)*1;
  var str2=str.substring(0,1);
  if (str2=="s") {
    return str1*1000;
  } else if (str2=="h") {
    return str1*60*60*1000;
  } else if (str2=="d") {
    return str1*24*60*60*1000;
  }
}
//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30

//参数path为存储cookie的域名,默认当前域名,一级域名为'/'
