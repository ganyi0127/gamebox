// pages/message/message.js
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [], // 消息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var messageList = JSON.parse(options.messageListJSON)
    console.log(messageList)

    for (var i = 0; i < messageList.length; i++) {
      var message = messageList[i]
      messageList[i].time = util.formatTime(message.time, 'Y/M/D h:m')
    }
    console.log(messageList[i])
    this.setData({
      messageList: messageList,
    })
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

  }
})