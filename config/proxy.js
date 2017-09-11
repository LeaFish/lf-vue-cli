/***
 * 反向代理配置
 * @returns {Object}
 */


var urls = [

];    //写入需要拦截的接口前缀
var target = 'localhost:8080';    //代理地址

var getProxyTable = function(){
  var obj = new Object(null);
  urls.forEach(function(item){
    obj['/' + item + '/*'] = {
      target: 'http://' + target,
      changeOrigin:true
    };
  });

  return obj;
};

module.exports = getProxyTable();
