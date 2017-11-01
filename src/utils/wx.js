/***
 * 微信API封装
 */


/***
 * 微信支付
 */
export class wxPay{
  constructor(params){
    Object.assign(this,{
      success: () => {},          //支付成功回调
      cancel: () => {},           //支付取消回调
      fail: () => {},             //支付失败回调
      complete: () => {},
      toast: text => console.log(text),
      data: null,             //传给微信的数据
    },params);
    this.init();
  }

  init(){
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', () => this.pay(), false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', () => this.pay());
        document.attachEvent('onWeixinJSBridgeReady', () => this.pay());
      }
    } else {
      this.pay();
    }
  }

  pay(){
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      this.data,
      res => {
        this.complete();
        switch (res.err_msg) {
          case 'get_brand_wcpay_request:ok' : this.toast('支付成功');this.success();break;
          case 'get_brand_wcpay_request:cancel': this.toast('已取消支付');this.cancel();break;
          case 'get_brand_wcpay_request:fail': this.toast('支付失败');this.fail();break;
        }
      }
    );
  }
}


/***
 * 微信分享
 */
export class wxShare{
  constructor(params){
    Object.assign(this,{
      title : null,                      // 分享标题
      link  : null,                      // 分享链接
      imgUrl: null,                      // 分享图标
      desc  : null,                      // 分享描述
      config : null,                     // 分享配置
      ready: false,                      // 是否为页面加载完成即启动
      toast: text => console.log(text),
      success: () => {},
      cancel: () => {}
    },params);

    this.init();
  }

  init(){
    wx.config(this.config);
    this.ready?wx.ready(this.share):this.share();
  }

  share(){
    //如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    //分享到朋友圈
    wx.onMenuShareTimeline({
      title: this.title,
      link: this.link,
      imgUrl: this.imgUrl,
      success: this.success,
      cancel: this.cancel
    });
    //分享给朋友
    wx.onMenuShareAppMessage({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.imgUrl,
      type: '',       // 分享类型,music、video或link，不填默认为link
      dataUrl: '',    // 如果type是music或video，则要提供数据链接，默认为空
      success: this.success,
      cancel: this.cancel
    });
    //分享到QQ
    wx.onMenuShareQQ({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.imgUrl,
      success: this.success,
      cancel: this.cancel
    });
    //分享到微博
    wx.onMenuShareWeibo({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.imgUrl,
      success: this.success,
      cancel: this.cancel
    });
    //分享到QQ空间
    wx.onMenuShareQZone({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.imgUrl,
      success: this.success,
      cancel: this.cancel
    });
  }

}
