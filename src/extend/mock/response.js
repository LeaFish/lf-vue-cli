export function response (Api){
  return {
    success: {
      code: 200,
        msg: 'suc',
        data: []
    },
    [Api.login]:{
      "msg": 'success',
        "code": 200,
        data: {
        "token": 123123
      }
    },

  }
}

//http://xzj-images.oss-cn-shanghai.aliyuncs.com/course/20170713120813683.png
