/***
 * DOM操作相关工具
 */

/***
 * 事件绑定
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/***
 * 事件移除
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();


/***
 * 一次性事件
 * @param el
 * @param event
 * @param fn
 */
export const once = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/***
 * 添加class
 * @param el
 * @param cls
 */
export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

/***
 * 移除class
 * @param el
 * @param cls
 */
export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

/***
 * 追加元素
 * @param el
 * @param tag 生成标签的类型,
 * @param obj 生成标签上需添加的属性
 * @param html 生成标签的内容
 */
export const appendElement = function(el,tag,obj,html){
  tag = document.createElement(tag);
  tag.innerHTML = html;
  if(obj !== undefined){
    for(var key in obj){
      tag.setAttribute(key,obj[key]);
    }
  }
  el.appendChild(tag);
};


/***
 * 移除元素
 * @param el
 */
export const removeElement = function(el){
  el.parentNode.removeChild(el);
};

/***
 * 样式处理器
 * @param el
 * @param prop
 * @param value
 * @returns {CSSStyleDeclaration}
 */
export const css = function(el,prop,value){
  if(value === true || value === undefined){
    if(el === undefined || el === null)throw new Error('Invalid Element in css');
    var style = getComputedStyle(el);
    style = style[prop];
    if(value === true){
      (prop === 'width')&&(style = el.offsetWidth);
      (prop === 'height')&&(style = el.offsetHeight);
    }
    return style;
  }else{
    el.style[prop] = value;
  }
};


/***
 * 滚动条距离顶点的距离,兼容谷歌火狐
 * @type {number}
 */
export const scrollTop = () => /firefox/.test(navigator.userAgent.toLowerCase())?
  document.documentElement.scrollTop:document.body.scrollTop;


/***
 * 发起scheme协议
 * @param url
 */
export function sendScheme(url){
  var ifr = document.createElement("iframe");
  ifr.src = url;
  /***打开app的协议***/
  ifr.style.display = "none";
  document.body.appendChild(ifr);
  console.warn('成功发起 scheme 协议 /// ' + url);
  window.setTimeout(()=>{
    document.body.removeChild(ifr);
  }, 500)
}

/***
 * 移除广告
 */
export function removeAd(){
  var addArr = ['EG0phD8f'];
  var count = 0;
  for(var index in addArr){
    var item = addArr[index];
    var ad = document.getElementById(item);
    if(ad !== null){
      ad.parentNode.removeChild(ad);
      count ++;
    }
  }
  count>0&&console.error('**************** 成功干掉 '+ count +' 条广告 ****************');
}


/***
 * 将图片裁剪成正方形
 * @param {Number} size 结果图片的尺寸,默认根据图片宽高中更小的值进行裁剪
 * @param src 原图片地址
 * @param contentType 内容类型
 * @returns {Promise} 返回base64编码图片
 */
export function clipImageToSquare(src,size,contentType = "image/png"){
  return new Promise((resolve,reject) => {
    const image = new Image();
    image.src = src;

    on(image,'load',() => {
      const canvas = document.createElement("canvas");
      const width = image.width;
      const height = image.height; //原始宽高

      const wh = typeof size === 'number'? size : Math.min(width,height);
      if(wh <= 0){
        console.warn('Invalid image size in clipImageToSquare');
        reject('无效图片大小设定');
      }

      const w = width > height? wh*width/height : wh;
      const h = width > height? wh : wh*height/width;//图片拉伸的宽高

      canvas.height = canvas.width = wh;
      canvas.getContext("2d").drawImage(image,0,0,w,h);

      const dataURL = canvas.toDataURL(contentType);
      resolve(dataURL,contentType);
    });

    on(image,'error',() => {
      console.warn('Image loading failure in clipImageToSquare');
      reject('图片加载失败')
    });
  })
}

/***
 * 将base64编码内容转换成blob文件
 * @param dataURL base64编码内容
 * @param contentType 内容类型
 * @returns {Promise} 返回blob文件
 */
export function base64ToBlob(dataURL,contentType = "image/png"){
  return new Promise((resolve,reject) => {
    try {
      let data = dataURL.split(',')[1];
      data = window.atob(data);
      let ia = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
      }
      const blob = new Blob([ia], {type: contentType});
      resolve(blob);
    }catch (err){
      reject('格式转换失败');
    }
  })
}

/***
 * 选择要操作的文件  默认不限制选择
 * @param {RegExp,String} type   限制文件的类型
 * @param {String} maxSize   限制文件的大小 必须带单位,可用单位 b,kb,m,g,t 不限制大小写
 * @param {Number} timeout 文件选取超时设定 单位秒
 * @returns {Promise}   返回文件的base64编码
 * @constructor
 */
export function SelectFile(type = null,maxSize = null,timeout = 10){
  return new Promise((resolve,reject) => {
    const inp = document.createElement('input');
    inp.setAttribute('type','file');
    inp.click();

    on(inp,'change',() => {
      const reader = new FileReader();
      const file = inp.files[0];

      //限制格式
      if(typeof type === 'string' || typeof type === 'object'){
        let reg = null;
        switch(typeof type){
          case 'string': if(type == 'image'){reg = /image\/\w+/}else{reg = new RegExp(type)}break;
          case 'object': reg = type;break;
        }
        //限制格式
        if(reg !== null){
          try {
            if(!reg.test(file.type)){
              console.warn('Invalid file');
              throw new Error('选择的文件格式不正确');
            }
          }catch (err){
            reject(err.message);
          }
        }
      }

      //限制大小
      if(typeof maxSize === 'string'){
        let size = null;
        /[0-9]+[bB]$/.test(maxSize) && (size = file.size);
        /[0-9]+[kK][bB]$/.test(maxSize) && (size = file.size/1024);
        /[0-9]+[mM]$/.test(maxSize) && (size = file.size/1024/1024);
        /[0-9]+[gG]$/.test(maxSize) && (size = file.size/1024/1024/1024);
        /[0-9]+[tT]$/.test(maxSize) && (size = file.size/1024/1024/1024/1024);
        if(size === null){
          console.warn('Invalid maxSize in SelectFile');
          reject('无效的文件大小限制');
        }else if( size >= parseFloat(maxSize)){
          console.warn('The file is greater than the max size');
          reject('文件超出了限制大小');
        }
      }

      reader.readAsDataURL(file);

      on(reader,'load',() => resolve(reader.result));
    });
  });
}

/***
 *  Toast
 * @param message 消息内容 可插入标签
 * @param interval  显示时长
 * @param style 自定义样式
 * @param animate 自定义出/入动画
 * @constructor
 */
export function Toast({message = '',interval = 3,style = {},animate = {enter: 'fadeInUp',leave: 'fadeOutDown'}}){
  let styles = {
    background: 'rgba(0,0,0,0.8)',
    position: 'fixed',
    bottom: '80px',
    width: '200px',
    left: '50%',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '5px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.12)',
    font: '14px "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif',
  };

  for(let i in style){styles[i] = style[i]}

  let dom = document.createElement('div');

  dom.style.marginLeft = '-' + parseFloat(styles.width)/2 + 'px';

  for(let i in styles){
    dom.style[i] = styles[i];
  }

  dom.innerHTML = message;

  dom.className = 'animated ' + animate.enter;
  document.body.appendChild(dom);
  setTimeout(() => {
    setTimeout(() => document.body.removeChild(dom),1000);
    dom.className = 'animated ' + animate.leave;
  },parseFloat(interval)*1000);

}

