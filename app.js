const network = require('/utils/network.js');


//app.js
App({
  onLaunch: function () {
    
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('微信登录回调：');
        console.log(res)

        // var appid = 'wx9dc3f31d0ba4fa42'; //填写微信小程序appid          
        // var secret = '2def4d66ea74b417307170dad780479f'; //填写微信小程序secret             
        // //调用request请求api转换登录凭证          
        // wx.request({            
        //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=‘+appid+’&secret=‘+secret+’&grant_type=authorization_code&js_code='+res.code,            
        //   header: {                
        //     'content-type': 'application/json'            
        //     },            
        //   success: function(res) {              
        //       console.log(res.data.openid) //获取openid            
        //   }          
        // })

        network.POST({
          action: this.globalData.actions.login,
          params: {
            type: 2,
            code: res.code
          },
          success: (res) => {
          },
          fail: (msg) => {
          },
          complete: function () {
          }
        })

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,     //用户信息
    actions: {          //请求actions
      login: '/login',
      getBannerList: '/hall/getBannerList',
      getGameList: '/hall/getgames',
      getSlides: '/hall/getProducts',
      getSignData: '/user/signInfo',
      sign: '/user/sign',
    },
  },
  onShow: function(){
    console.log('App Show')
  },
  onHide: function(){
    console.log('App Hide')
  }
})