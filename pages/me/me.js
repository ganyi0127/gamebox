// pages/me/me.js

const network = require('../../utils/network.js');

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    clicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    } else if (this.data.canIUse) {
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取个人信息
   */
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 点击签到
   */
  sign() {
    console.log('点击签到')

    wx.showNavigationBarLoading()
    network.POST({
      action: app.globalData.actions.sign,
      success: (res) => {
        wx.showToast({
          title: '签到成功',
        })
      },
      fail: (msg) => {
        wx.showToast({
          title: '签到失败 (openId缺省)',
          icon: 'none',
          duration: 2000,
        })
      },
      complete: function () {
        // complete  
        wx.hideNavigationBarLoading()
      }
    })
  },

  /**
  * 显示弹窗
  */
  showAlert() {
    // this.alert.showAlert();
    wx.showModal({
      title: '合作联系',
      content: 'yf@llx1888.com',
      showCancel: false,
      confirmText: '确认',
      confirmColor: '#488aff',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  
  },
})