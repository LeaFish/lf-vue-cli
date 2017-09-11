import Img from '../config/image';
import { on } from '../utils/dom';
import { isExist , isFunction, isObject } from '../utils/util';

/***
 * 处理image标签的load error 事件
 * @type {{name: string, inserted: (function(*=, *))}}
 */

const handle = (el,binding) => {
  let image = new Image(),
    success = null,               //加载成功展示的图片地址
    loading = Img.coverLoading,   //封面加载中图片
    error = Img.coverError,            //默认错误页面
    errorFn = null,
    loadFn = null;

  //启用默认头像
  (binding.modifiers.user) && (error = Img.user);
  //启用菜单栏图标
  (binding.modifiers.menuIcon) && (error = Img.menuIcon);

  //默认处理函数
  errorFn = e => e.target.src = error;
  loadFn = e => {};

  //参数为图片地址时
  if(binding.modifiers.src){
    success = binding.value;
  }else{
    //完全自定义处理时
    if(!binding.modifiers.fn && isObject(binding.value)){
      if(isExist(binding.value.success)){
        success = binding.value.success;
      }
      if(isExist(binding.value.error)){
        error = binding.value.error;
      }
      if(isExist(binding.value.loading)){
        loading = binding.value.loading;
      }
      if(isExist(binding.value.fn)){
        isExist(binding.value.fn.error) && (errorFn = binding.value.fn.error);
        isExist(binding.value.fn.load) && (loadFn = binding.value.fn.load);
      }
    }
    //参数为处理函数时
    if(binding.modifiers.fn){
      const value = binding.value;
      if( isFunction(value) ){
        loadFn = value;
      }else if( isObject(value) ){
        isFunction(value.error) && (errorFn = value.error);
        isFunction(value.load) && (loadFn = value.load);
      }
    }
  }

  if(!isExist(success)){
    success = binding.value;
  }

  //对封面图片进行加载中显示处理
  if(binding.modifiers.cover){
    el.src = loading;
    image.src = success;
    on(image,'error',() => {
      el.src = error;
      on(el,'error',errorFn);
      on(el,'load', loadFn);
    });
    on(image,'load', () => {
      if(parseFloat(parseInt(image.width)/parseInt(image.height)).toFixed(2) !== parseFloat(452/252).toFixed(2)){
        success = Img.cover;
      }
      el.src = success;
      on(el,'error',errorFn);
      on(el,'load', loadFn);
    });
  }else{
    el.src = success;
    on(el,'error',errorFn);
    on(el,'load', loadFn);
  }
};

const ImageEvent = {
  name: 'img',
  // 当绑定元素插入到 DOM 中。
  update: handle,
  inserted: handle
};


export default ImageEvent;
