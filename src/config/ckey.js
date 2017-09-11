/***
 * 缓存键值
 */

let cacheKeys = {
  token: 'userToken',   //用户身份凭证
  windowId: 'simpleWindowId', //单窗口id
  recordTime: 'recordTime', //学习时长
  watchTime: 'watchTime', //视频观看时间
};

const suffix = '@LingLuCloudSchool';  //后缀

for(let index in cacheKeys){
  cacheKeys[index] = cacheKeys[index] + suffix;
}

export default cacheKeys;
