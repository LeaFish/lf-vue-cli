/***
 * timeTools时间日期处理工具
 */
var timeTools = {};
(function (main) {
  'use strict';

  /**
   * Parse or format dates
   * @class timeTools
   */

  var token = /D{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|do|ZZ|([HhMsdm])\1?|[aA]|"[^"]*"|'[^']*'/g;
  var twoDigits = /\d\d?/;
  var threeDigits = /\d{3}/;
  var fourDigits = /\d{4}/;
  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var literal = /\[([^]*?)\]/gm;
  var noop = function () {
  };

  function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  }

  function monthUpdate(arrName) {
    return function (d, v, i18n) {
      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
      if (~index) {
        d.month = index;
      }
    };
  }

  /***
   * 指定长度,不足补0
   * @param val
   * @param len
   * @returns {string|*}
     */
  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  timeTools.pad = pad;

  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthNamesShort = shorten(monthNames, 3);
  var dayNamesShort = shorten(dayNames, 3);
  timeTools.i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
  };

  var formatFlags = {
    d: function(dateObj) {
      return dateObj.getDate();
    },
    dd: function(dateObj) {
      return pad(dateObj.getDate());
    },
    do: function(dateObj, i18n) {
      return i18n.DoFn(dateObj.getDate());
    },
    D: function(dateObj) {
      return dateObj.getDay();
    },
    DD: function(dateObj) {
      return pad(dateObj.getDay());
    },
    DDD: function(dateObj, i18n) {
      return i18n.dayNamesShort[dateObj.getDay()];
    },
    DDDD: function(dateObj, i18n) {
      return i18n.dayNames[dateObj.getDay()];
    },
    M: function(dateObj) {
      return dateObj.getMonth() + 1;
    },
    MM: function(dateObj) {
      return pad(dateObj.getMonth() + 1);
    },
    MMM: function(dateObj, i18n) {
      return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function(dateObj, i18n) {
      return i18n.monthNames[dateObj.getMonth()];
    },
    yy: function(dateObj) {
      return String(dateObj.getFullYear()).substr(2);
    },
    yyyy: function(dateObj) {
      return dateObj.getFullYear();
    },
    h: function(dateObj) {
      return dateObj.getHours() % 12 || 12;
    },
    hh: function(dateObj) {
      return pad(dateObj.getHours() % 12 || 12);
    },
    H: function(dateObj) {
      return dateObj.getHours();
    },
    HH: function(dateObj) {
      return pad(dateObj.getHours());
    },
    m: function(dateObj) {
      return dateObj.getMinutes();
    },
    mm: function(dateObj) {
      return pad(dateObj.getMinutes());
    },
    s: function(dateObj) {
      return dateObj.getSeconds();
    },
    ss: function(dateObj) {
      return pad(dateObj.getSeconds());
    },
    S: function(dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100);
    },
    SS: function(dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function(dateObj) {
      return pad(dateObj.getMilliseconds(), 3);
    },
    a: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    ZZ: function(dateObj) {
      var o = dateObj.getTimezoneOffset();
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
    }
  };

  var parseFlags = {
    D: [twoDigits, function (d, v) {
      d.day = v;
    }],
    Do: [new RegExp(twoDigits.source + word.source), function (d, v) {
      d.day = parseInt(v, 10);
    }],
    M: [twoDigits, function (d, v) {
      d.month = v - 1;
    }],
    yy: [twoDigits, function (d, v) {
      var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function (d, v) {
      d.hour = v;
    }],
    m: [twoDigits, function (d, v) {
      d.minute = v;
    }],
    s: [twoDigits, function (d, v) {
      d.second = v;
    }],
    yyyy: [fourDigits, function (d, v) {
      d.year = v;
    }],
    S: [/\d/, function (d, v) {
      d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function (d, v) {
      d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function (d, v) {
      d.millisecond = v;
    }],
    d: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function (d, v, i18n) {
      var val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    }],
    ZZ: [/([\+\-]\d\d:?\d\d|Z)/, function (d, v) {
      if (v === 'Z') v = '+00:00';
      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

      if (parts) {
        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    }]
  };
  parseFlags.dd = parseFlags.d;
  parseFlags.dddd = parseFlags.ddd;
  parseFlags.DD = parseFlags.D;
  parseFlags.mm = parseFlags.m;
  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
  parseFlags.MM = parseFlags.M;
  parseFlags.ss = parseFlags.s;
  parseFlags.A = parseFlags.a;


  // Some common format strings
  timeTools.masks = {
    default: 'yyyy-MM-dd HH:mm',
    allDate: 'DDD MMM dd yyyy HH:mm:ss',
    shortDate: 'M/d/yy',
    mediumDate: 'MMM d, yyyy',
    longDate: 'MMMM d, yyyy',
    fullDate: 'DDDD, MMMM d, yyyy',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  };

  /***
   * Check a Date Object
   * @param dateObj
   * @returns {boolean}
     */
  timeTools.isDateObject = function(dateObj){
    return Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime());
  };

  /***
   * Format a date
   * @method format
   * @param {Date|number} dateObj
   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
   * @param i18nSettings
   * @returns {string|XML}
   **/
  timeTools.format = function (dateObj, mask, i18nSettings) {
    var i18n = i18nSettings || timeTools.i18n;

    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj);
    }


    if (timeTools.isDateObject(dateObj)) {
      console.error('Invalid Date in timeTools.format');
      throw new Error('Invalid Date in timeTools.format');
    }

    mask = timeTools.masks[mask] || mask || timeTools.masks['default'];

    var literals = [];

    // Make literals inactive by replacing them with ??
    mask = mask.replace(literal, function($0, $1) {
      literals.push($1);
      return '??';
    });
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {

      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/\?\?/g, function() {
      return literals.shift();
    });
  };

  /**
   * Parse a date string into an object, changes - into /
   * @method parse
   * @param {string} dateStr Date string
   * @param {string} format Date parse format
   * @param i18nSettings
   * @returns {Date|boolean}
   */
  timeTools.parse = function (dateStr, format, i18nSettings) {
    var i18n = i18nSettings || timeTools.i18n;

    if (typeof format !== 'string') {
      console.error('Invalid format in timeTools.parse');
      throw new Error('Invalid format in timeTools.parse');
    }

    format = timeTools.masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
      return false;
    }

    var isValid = true;
    var dateInfo = {};
    format.replace(token, function ($0) {
      if (parseFlags[$0]) {
        var info = parseFlags[$0];
        var index = dateStr.search(info[0]);
        if (!~index) {
          isValid = false;
        } else {
          dateStr.replace(info[0], function (result) {
            info[1](dateInfo, result, i18n);
            dateStr = dateStr.substr(index + result.length);
            return result;
          });
        }
      }

      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });

    if (!isValid) {
      return false;
    }

    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }

    var date;
    if (dateInfo.timezoneOffset != null) {
      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
  };


  /***
   * Make a second to a object
   * @param s       秒
   * @param type    转换上限类型  y M d h m s
   * @param simple  是否简化返回值的key
   * @param pad     是否补0
   * @returns {{}}
     */
  timeTools.secondToObject = function(s = 0,type = 'd',simple = false,pad = false){
    var second = parseInt(s),minute = 0,hour = 0,day = 0,month = 0,year = 0,obj = {};
    if(typeof second !== 'number'){
      console.error('argument[1] must is a number in timeTools.secondToObject');
      throw new Error('argument[1] must is a number in timeTools.secondToObject');
    }
    if(s > 0){
      if(type == 'y'){
        year = Math.floor(second/60/60/24/30/365);
        month = Math.floor((second - year*60*60*24*30*365)/60/60/24/30);
        day = Math.floor((second - year*60*60*24*30*365 - month*30*60*60*24)/60/60/24);
        hour = Math.floor((second - year*60*60*24*30*365 - month*30*60*60*24 - day*60*60*24)/3600);
        minute = Math.floor((second - year*60*60*24*30*365 - month*30*60*60*24 - day*60*60*24 - hour*3600)/60);
        second = Math.floor(second - year*60*60*24*30*365 - month*30*60*60*24 - day*60*60*24 - hour*3600 - minute*60);
        obj = { year, month, day, hour, minute, second };
      }
      if(type == 'M'){
        month = Math.floor(second/60/60/24/30);
        day = Math.floor((second - month*30*60*60*24)/60/60/24);
        hour = Math.floor((second - month*30*60*60*24 - day*60*60*24)/3600);
        minute = Math.floor((second - month*30*60*60*24 - day*60*60*24 - hour*3600)/60);
        second = Math.floor(second - month*30*60*60*24 - day*60*60*24 - hour*3600 - minute*60);
        obj = { month, day, hour, minute, second };
      }
      if(type == 'd'){
        day = Math.floor(second/60/60/24);
        hour = Math.floor((second - day*60*60*24)/3600);
        minute = Math.floor((second - day*60*60*24 - hour*3600)/60);
        second = Math.floor(second - day*60*60*24 - hour*3600 - minute*60);
        obj = { day, hour, minute, second };
      }
      if(type == 'h'){
        hour = Math.floor(second/3600);
        minute = Math.floor((second  - hour*3600)/60);
        second = Math.floor(second  - hour*3600 - minute*60);
        obj = { hour, minute, second };
      }
      if(type == 'm'){
        minute = Math.floor(second/60);
        second = Math.floor(second -  minute*60);
        obj = { minute, second };
      }
      if(type == 's'){
        obj = {second}
      }
    }else{
      obj = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 };
    }

    var newObj = {};
    if(simple){
      for(let index in obj){
        if(index == 'month'){
          newObj['M'] = obj[index];
        }else{
          newObj[index.substr(0,1)] = obj[index];
        }
      }
    }else{
      newObj = obj;
    }

    if(pad){
      for(let index in newObj){
        newObj[index] = timeTools.pad(newObj[index],pad);
      }
    }

    return newObj;
  };


    /***
     * Format a second
     * @param s         为秒为单位的数字
     * @param mask      自定义格式  可匹配字符 'y','M','d','h','m','s'
     * @param showZero  是否显示零值
     * @returns {string}
     */
  timeTools.secondFormat = function(s,mask = 'd天h小时m分钟s秒',showZero = false){
    var reg = /y+|M+|d+|h+|m+|s+/g;
    var type = null;
    var typeArr = ['y','M','d','h','m','s'];  //定义可匹配字符
    for(var i = 0; i < typeArr.length ; i++){
      var item = typeArr[i];
      if(new RegExp(item).test(mask)){  //自动检测自定义格式的上限
        type = item;
        break;
      }
    }
    if(type == null){
      console.error('Invalid mask in timeTools.secondFormat');
      throw new Error('Invalid mask in timeTools.secondFormat');
    }
    // 验证结果寄存器
    var literals = [];
    var secondObject = timeTools.secondToObject(s,type,true);  //获取通过格式上限转换出来的时间对象

    var result = mask.replace(reg, function ($0,offset,source) {
      var result = pad(secondObject[$0.substr(0,1)],$0.length);
      result = showZero?result:parseInt(result) === 0?0:result;
      literals.push({$0,offset,source,result});
      if(showZero && parseInt(result) < 10)result = '0' + result;
      return result;
    });
    //console.log(result);
    //if(!showZero){
    //  //重组字符串,处理零值
    //  result = '';
    //  for(var i = 0; i < literals.length ; i++){
    //    var str = null;
    //    if(i == literals.length - 1){
    //      str = literals[i].source.substr(literals[i].offset);
    //    }else{
    //      str = literals[i].source.substr(literals[i].offset)
    //          .replace(new RegExp(literals[i].source.substr(literals[i + 1].offset)),'');
    //    }
    //    literals[i].suffix = str.replace(new RegExp(literals[i].$0),'');
    //    if(literals[i].result){
    //      result += (literals[i].result + literals[i].suffix);
    //    }
    //  }
    //}
    return result;
  };

  /***
   * Get a date string
   * @param addDateCount {number} -2 前天 -1 昨天 0 今天 1 明天 2 后天 以此类推
   * @param mask  {string}      自定义格式
   * @returns {string|XML}
     */
  timeTools.getDate = function(addDateCount = 0,mask = 'yyyy-MM-dd'){
    var date = new Date();
    date.setDate(date.getDate() + addDateCount);
    return timeTools.format(date,mask);
  };

  /***
   * Get a year string
   * @param addDateCount
   * @param mask
   * @returns {string|XML}
     */
  timeTools.getFullYear = function(addDateCount = 0,mask = 'yyyy'){
    var date = new Date();
    date.setFullYear(date.getFullYear() + addDateCount);
    return timeTools.format(date,mask);
  };

  /***
   * Get a month string
   * @param addDateCount
   * @param mask
   * @returns {string|XML}
     */
  timeTools.getMonth = function(addDateCount = 0,mask = 'M'){
    var date = new Date();
    date.setMonth(date.getMonth() + addDateCount);
    return timeTools.format(date,mask);
  };

  /***
   * check date
   * @param date
   * @param addDateCount
   * @param mask
   * @param key   选择调用的方法
   * @returns {boolean}
     */
  timeTools.checkDate = function(date,addDateCount,mask = 'yyyy-MM-dd',key = 'getDate'){
    return timeTools.format(date,mask) == timeTools[key](addDateCount,mask);
  };
  
  /***
   * Format all date string
   * @param {Date|number} date
   *
   * @param {object} newMasks 自定义日期格式集,自定义判断逻辑;
   * newMasks 有效数据格式:
   * 例1: {today: 'yy-MM-dd'}
   * 例2: {today: {mask: 'yy-MM-dd', fn: function(date){ return true }}}
   * fn函数返回值必须为Boolean值;若省略fn函数且为默认中不存在的标准,则默认为返回true,功能为匹配所有日期;
   *
   * 例3: today: { mask: '今天', argument: [0,'yyyy-MM-dd','getDate'] }
   * argument 采用timeTools.checkDate方法进行日期判断, timeTools.checkDate(date,...argument)
   * fn函数和argument数组同时存在时,优先采用fn函数;
   *
   * @param sort 自定义日期判断顺序,以及筛选判断
   * 默认顺序 ["yesterday", "today", "tomorrow", "yesteryear", "toyear", "default"]
   *
   * @returns {string|XML}
     */
  timeTools.formatAllDate = function(date = new Date(),newMasks = {},sort){
    if (typeof date === 'number') date = new Date(date);
    if (timeTools.isDateObject(date)) {
      console.error('Invalid Date in timeTools.checkDate');
      throw new Error('Invalid Date in timeTools.checkDate');
    }

    //默认日期格式集,以及判断逻辑
    var masks = {
      yesterday: { mask: '昨天', argument: [-1,'yyyy-MM-dd','getDate'] },
      today: { mask: '今天', argument: [0,'yyyy-MM-dd','getDate'] },
      tomorrow: { mask: '明天', argument: [1,'yyyy-MM-dd','getDate'] },
      yesteryear: { mask: 'default', argument: [1,'yyyy','getFullYear'] },
      toyear: { mask: 'MM-dd HH:mm', argument: [0,'yyyy','getFullYear'] },
      default: { mask: 'default', fn: date => true }
    };

    //启用自定义日期格式
    if(typeof newMasks === 'object' && !Array.isArray(newMasks)){
      for(var i in newMasks){
        //value is string
        if(typeof newMasks[i] === 'string'){
          if(masks[i] === undefined){
            masks[i] = {
              mask: newMasks[i],
              fn: masks.default.fn
            }
          }else{
            masks[i].mask = newMasks[i];
          }
        }
        //value is object
        if(typeof newMasks[i] === 'object' && !Array.isArray(newMasks[i])){
          if(typeof newMasks[i].mask === 'string'){
            masks[i].mask = newMasks[i].mask;
            if(typeof newMasks[i].fn === 'function'){
              masks[i].fn = newMasks[i].fn;
            }else if(Array.isArray(newMasks[i].argument) ){
              masks[i].argument = newMasks[i].argument;
            }else{
              masks[i].fn = masks.default.fn;
            }
          }
        }
      }
    }else{
      console.error('Invalid newMasks in timeTools.checkDate');
      throw new Error('Invalid newMasks in timeTools.checkDate');
    }

    if(!Array.isArray(sort)){
      //启用默认日期判断顺序
      sort = [];
      for(var i in masks){ sort.push(i);}
    }else{
      //判断自定义顺序中是否存在default,不存在则补上,以防存在日期无法判断
      var isDefault = false;
      for(var i in sort){
        if(sort[i] == 'default'){
          isDefault = true;
          break;
        }
      }
      isDefault || sort.push('default');
    }
    //日期判断开始
    for(var i in sort){
      var checkResult = null;
      if(masks[sort[i]] !== undefined){
        if(masks[sort[i]].fn !== undefined){
          checkResult = masks[sort[i]].fn(date);
        }else{
          //默认采用timeTools.checkDate方法进行判断
          checkResult = timeTools.checkDate(date,...masks[sort[i]].argument);
        }
        if(checkResult){
          return timeTools.format(date,masks[sort[i]].mask);
        }
      }
    }
  };


  /***
   * 判断当前距离一个时间点的距离
   * @param date    时间对象
   * @param start   数据起点  'y','M','d','h','m','s'
   * @param end     数据终点  'y','M','d','h','m','s'
   * @param returnObject  直接返回处理后的秒对象
   * @returns {*}
   */
  timeTools.getNowDistance = function(date = new Date(),start = 'y',end = 'm',returnObject = false){
    let dis = parseInt((date.getTime() - new Date().getTime())/1000);  //秒级差值
    let state = dis < 0 ?0:dis == 0?1:2; //past now future
    let stateArray = ['前','刚刚','后'];
    let text = {y: '年', M: '个月', d: '天', h: '小时', m: '分钟', s: '秒'};
    let sort = ['y','M','d','h','m','s'];
    let result = null;

    let secondObject = timeTools.secondToObject(Math.abs(dis),start,true);

    if(returnObject)return secondObject;
    if(state == 1)return stateArray[state];

    for(let i = 0;i < sort.length;i++){
      let item = sort[i];
      if(secondObject[item] != 0){
        result = end == item?stateArray[1]:(secondObject[item] + text[item] + stateArray[state]);
        break;
      }
    }

    return result;
  };

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = timeTools;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return timeTools;
    });
  } else if(typeof main !== 'undefined'){
    main.timeTools = timeTools;
  }else{
    return timeTools;
  }
})(this);


