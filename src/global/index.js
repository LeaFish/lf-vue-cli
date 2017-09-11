
/**
 * Created by LeaFish on 17/8/24.
 *
 * addGlobal
 */


export default function (store){
  /***
   * iframe 通信
   * @type {{pageNumber, pageNumber}}
   */
  global.parentView = {
    //页码
    set pageNumber (value){
      store.dispatch('getDocumentReaderNumber',value);
    },
    //加载失败
    set pageError (value){
      store.dispatch('documentLoadError',value);
    },
    //加载完成
    set pageLoad (value){
      store.dispatch('documentLoadSuccess',value);
    }
  };
}
