
/******** js工具包 *********/

/***
 * 扩展对象
 * @param to
 * @param from
 * @returns {*}
 */
export const extend = function(to, from) {
  if(!isObject(to))throw new Error('Argument must is a object in extend');
  if(from !== null && isObject(from)){
    for (let key in from) {
      if(Array.isArray(to)){
        to.push(from[key]);
      }else{
        to[key] = from[key];
      }
    }
  }else if(from === null){
    //当from为null时,将所有value设为null
    for(let i in to){
      to[i] = null;
    }
  }else{
    throw new Error('Invalid Argument in extend');
  }

  return to;
};


/***
 * 表单化参数集
 * @param pars
 * @returns {*}
 */
export function formParams(pars){
  var fd = new FormData();  //实例化表单对象
  for(var i in pars){
    fd.append(i,pars[i]);
  }

  return fd;
}

/***
 * 判断函数
 * @param val
 */
export const isFunction = val => typeof val === 'function';

/***
 * 判断对象
 * @param val
 */
export const isObject = val => typeof val === 'object';

/***
 * 判断数字
 * @param val
 */
export const isNumber = val => typeof val === 'number';

/***
 * 判断字符串
 * @param val
 */
export const isString = val => typeof val === 'string';

/***
 * 判断布尔值
 * @param val
 */
export const isBoolean = val => typeof val === 'boolean';

/***
 * 判断数据是否存在
 * @param data
 * @returns {boolean}
 */
export const isExist = data => {
  if(typeof data === 'string'){data = data.trim();}
  return data !== null && data !== undefined && data !== '' && data !== 'null' && data !== 'undefined';
};



/***
 * 格式化样式单位
 * @param val
 * @param unit
 * @returns {*}
 */
export function formatStyleUnit(val,unit = 'px'){
  if(!val){
    return val;
  }
  if(isObject(val)){
    let o = {};
    for(let i in val){
      if(/\%/.test(val[i])){
        o[i] = val[i];
      }else{
        o[i] = val[i] + unit;
      }
    }
    return o;
  }else{
    if(/\%/.test(val)){
      return val;
    }else{
      return val + unit;
    }
  }

}

/***
 * 获取url参数
 * @returns {*}
 */
export function getQueryString(){
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = {};
  if (url.indexOf("?") != -1) {
    var str = url.substr(1).split("&");
    for(var i = 0; i < str.length; i ++) {
      theRequest[str[i].split("=")[0]]=(str[i].split("=")[1]);
    }
    return theRequest;
  }else{
    return false;
  }
}





/***
 * 阿拉伯数字转中文数字
 * @param Num
 * @returns {string}
 */
export function numberToChinese(Num){
  for (let i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(",", "")//替换Num中的“,”
    Num = Num.replace(" ", "")//替换Num中的空格
  }
  if (isNaN(Num)) { //验证输入的字符是否为数字
    //alert("请检查小写金额是否正确");
    return;
  }
  //字符处理完毕后开始转换，采用前后两部分分别转换
  let part = String(Num).split(".");
  let newchar = "";
  //小数点前进行转化
  for (let i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      //alert("位数过大，无法计算");
      return "";
    }//若数量超过拾亿单位，提示
    let tmpnewchar = ""
    let perchar = part[0].charAt(i);
    switch (perchar) {
      case "0":  tmpnewchar = "零" + tmpnewchar;break;
      case "1": tmpnewchar = "一" + tmpnewchar; break;
      case "2": tmpnewchar = "二" + tmpnewchar; break;
      case "3": tmpnewchar = "三" + tmpnewchar; break;
      case "4": tmpnewchar = "四" + tmpnewchar; break;
      case "5": tmpnewchar = "五" + tmpnewchar; break;
      case "6": tmpnewchar = "六" + tmpnewchar; break;
      case "7": tmpnewchar = "七" + tmpnewchar; break;
      case "8": tmpnewchar = "八" + tmpnewchar; break;
      case "9": tmpnewchar = "九" + tmpnewchar; break;
    }
    switch (part[0].length - i - 1) {
      case 0: tmpnewchar = tmpnewchar; break;
      case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
      case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
      case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
      case 4: tmpnewchar = tmpnewchar + "万"; break;
      case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
      case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
      case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
      case 8: tmpnewchar = tmpnewchar + "亿"; break;
      case 9: tmpnewchar = tmpnewchar + "十"; break;
    }
    newchar = tmpnewchar + newchar;
  }
  //替换所有无用汉字，直到没有此类无用的数字为止
  while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零零", "零");
  }
  //替换以“一十”开头的，为“十”
  if (newchar.indexOf("一十") == 0) {
    newchar = newchar.substr(1);
  }
  //替换以“零”结尾的，为“”
  if (newchar.lastIndexOf("零") == newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1);
  }
  return newchar;
}


/***
 * 判断系统
 * @returns {{isIpad: boolean, isIphone: boolean, isAndroid: boolean, isWindowsCe: boolean, isWindowsMobile: boolean, isWin2K: boolean, isXP: boolean, isVista: boolean, isWin7: boolean, isWin8: boolean, isWin81: boolean, isWin10: boolean}}
 * @constructor
 */
export const os = (function(){
  var UserAgent = navigator.userAgent.toLowerCase();
  return {
    isIpad     : /ipad/.test(UserAgent),
    isIphone    : /iphone os/.test(UserAgent),
    isAndroid    : /android/.test(UserAgent),
    isWindowsCe   : /windows ce/.test(UserAgent),
    isWindowsMobile : /windows mobile/.test(UserAgent),
    isWin2K     : /windows nt 5.0/.test(UserAgent),
    isXP      : /windows nt 5.1/.test(UserAgent),
    isVista     : /windows nt 6.0/.test(UserAgent),
    isWin7     : /windows nt 6.1/.test(UserAgent),
    isWin8     : /windows nt 6.2/.test(UserAgent),
    isWin81     : /windows nt 6.3/.test(UserAgent),
    isWin10     : /windows nt 10.0/.test(UserAgent)
  };
})();

/***
 * 判断浏览器
 * @returns {{isUc: boolean, isChrome: boolean, isFirefox: boolean, isOpera: boolean, isSafire: boolean, is360: boolean, isBaidu: boolean, isSougou: boolean, isIE6: boolean, isIE7: boolean, isIE8: boolean, isIE9: boolean, isIE10: boolean, isIE11: boolean, isLB: boolean, isWX: boolean, isQQ: boolean}}
 * @constructor
 */
export const bw = (function(){
  var UserAgent = navigator.userAgent.toLowerCase();
  return {
    isUc   : /ucweb/.test(UserAgent), // UC浏览器
    isChrome : /chrome/.test(UserAgent.substr(-33,6)), // Chrome浏览器
    isFirefox : /firefox/.test(UserAgent), // 火狐浏览器
    isOpera  : /opera/.test(UserAgent), // Opera浏览器
    isSafire : /safari/.test(UserAgent) && !/chrome/.test(UserAgent), // safire浏览器
    is360   : /360se/.test(UserAgent), // 360浏览器
    isBaidu  : /bidubrowser/.test(UserAgent), // 百度浏览器
    isSougou : /metasr/.test(UserAgent), // 搜狗浏览器
    isIE6   : /msie 6.0/.test(UserAgent), // IE6
    isIE7   : /msie 7.0/.test(UserAgent), // IE7
    isIE8   : /msie 8.0/.test(UserAgent), // IE8
    isIE9   : /msie 9.0/.test(UserAgent), // IE9
    isIE10  : /msie 10.0/.test(UserAgent), // IE10
    isIE11  : /msie 11.0/.test(UserAgent), // IE11
    isLB   : /lbbrowser/.test(UserAgent), // 猎豹浏览器
    isWX   : /micromessenger/.test(UserAgent), // 微信内置浏览器
    isQQ   : /qqbrowser/.test(UserAgent) // QQ浏览器
  };
})();




