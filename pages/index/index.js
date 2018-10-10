//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '进入盒子',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    clicked: false
  },


  /**
   * 进入游戏主页
   */
  click: function () {
    console.log('点击进入游戏盒子')

    //跳转
    wx.navigateTo({
      url: '../box/box'
    })
  },

  //事件处理函数
  bindViewTap: function() {
    
  },
  
  /**
   * 页面初始化
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      console.log('使用globalData');
      console.log(app.globalData.userInfo);

      /**
       * 使立即生效
       */
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      console.log('使用canIUse');
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log('使用else');
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res.userInfo);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    

    this.click()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 页面渲染完成
   */
  onReady: function(){

  }

})
