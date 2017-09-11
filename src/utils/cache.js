/***
 *  localStorage
 */

/***
 * 设置缓存数据
 * @param cacheKey
 * @param data
 */
export function setCache (cacheKey,data) {
  window.localStorage && data !== undefined&&window.localStorage.setItem(cacheKey,JSON.stringify(data));
}

/***
 * 获取缓存数据
 * @param cacheKey
 * @returns {undefined}
 */
export function getCache (cacheKey) {
  if(window.localStorage){
    var storage = window.localStorage.getItem(cacheKey);
    if(storage){
      if(storage.indexOf('undefined') != -1){
        window.localStorage.removeItem(cacheKey);
        return undefined;
      }
      return JSON.parse(storage);
    }else{
      return undefined;
    }
  }else{
    return undefined;
  }
}

/***
 * 移除指定缓存
 * @param cacheKey(Array/String)
 */
export function removeCache(cacheKey){
  if(window.localStorage){
    if(Array.isArray(cacheKey)){
      for(let i in cacheKey){
        window.localStorage.removeItem(cacheKey[i]);
      }
    }

    if(typeof cacheKey === 'string'){
      window.localStorage.removeItem(cacheKey);
    }
  }
}

/***
 * 清空缓存
 * @param cacheKey
 */
export function clearCache(cacheKey){
  window.localStorage && window.localStorage.clear();
}
