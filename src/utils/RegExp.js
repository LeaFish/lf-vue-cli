/***
 * 正则校验
 */

const regs = {
  'tel': /^1[3|4|5|7|8]\d{9}$/,
  'pwd': /^[0-9a-zA-Z]+$/,    //只允许使用阿拉伯数字和英文字母
  'email': /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
};


/***
 * 转换为字符串,并去除空格
 * @param value
 * @returns {*}
 */
export function valueToString(value){
  if(typeof value === 'string'){
    return value.replace(/ /,'').trim();
  }else{
    return String(value);
  }
}

/***
 * 核心处理函数
 * @param reg
 * @param value
 * @param message
 * @returns {Promise}
 */
export function regCheck(reg,value,message){
  const val = valueToString(value);
  return new Promise((resolve,reject) => {
    if(reg.test(val)){
      resolve(val);
    }else{
      console.warn(message);
      reject(message);
    }
  })
}


/***
 * 验证手机号
 * @param val
 * @param message
 * @returns {Promise}
 */
export function checkTel(val,message = '手机号格式不正确'){
  return regCheck(regs.tel,val,message);
}

/***
 * 验证密码
 * @param val
 * @param limit 密码长度上下限
 * @param message
 * @returns {Promise}
 */
export function checkPwd(val,limit = [6,16],message = '密码中存在无效的字符'){
  if(!Array.isArray(limit))return Promise.reject('The second argument must be an Array in function checkPwd');

  const length = valueToString(val).length;
  const notice = `密码长度需在${limit[0]}-${limit[1]}位之间`;
  if(length < limit[0] || length > limit[1]){
    console.warn(notice);
    return Promise.reject(notice);
  }else{
    return regCheck(regs.pwd,val,message);
  }
}

/***
 * 验证邮箱地址
 * @param val
 * @param message
 * @returns {Promise}
 */
export function checkEmail(val,message = '邮箱地址格式不正确'){
  return regCheck(regs.email,val,message);
}




/***
 * 表情输入过滤器
 * @param str
 * @param bool  返回Boolean
 * @returns {*}
 */
export function faceFilter(str,bool){
  var reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  if(bool){
    return reg.test(str);
  }
  if(reg.test(str)) {
    return str.replace(reg, "");
  }else{
    return str;
  }
}
