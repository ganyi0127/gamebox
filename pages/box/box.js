const network = require('../../utils/network.js');

//获取应用实例
const app = getApp();

// pages/box/box.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gamesData: [],
    bannerList: [],
    historys: [],
    autoPlay: false, //顶部是否自动播放
    swiperHeight: 0, //顶部swiper高度
    itemsHeight: 750, //中部游戏列表总高度
    swiperImageHeight: 1, //顶部swiper图片高度（给个初始非0，否则不显示）
    indicatorDots: true, //是否显示顶部偏移点
    currentTab: 0, //顶部swiper选择项
    currentNavTab: 0, //顶部导航栏选择项
    readyToPush: false, //判断是否跳转
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.history = this.selectComponent('#history')
    this.alert = this.selectComponent("#alert");

    var that = this;
    // wx.showNavigationBarLoading()
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;

        // 获取历史游戏
        that.getHistorys()

        // 加载banner
        that.getBanner()

        //加载游戏
        that.getGames()
      },
      fail: () => {

      }
    })
  },

  /**
   * 显示弹窗
   */
  showAlert() {
    this.alert.showAlert();
  },
  //取消事件
  _cancelEvent() {
    this.alert.hideAlert();
  },
  //确认事件
  _confirmEvent() {
    this.alert.hideAlert();
  },

  /**
   * 获取历史纪录
   */
  getHistorys(){
    var historys = wx.getStorageSync('historys') || []
    this.setData({
      historys: historys
    })
  },

  /**
   * 获取广告图
   */
  getBanner: function() {
    network.GET({
      action: app.globalData.actions.getBannerList,
      success: (res) => {
        console.log(res)
        this.setData({
          bannerList: res,
        });
      }
    })
  },

  /**
   * 加载游戏
   */
  getGames: function() {
    network.POST({
      action: app.globalData.actions.getGameList,
      success: (res) => {
        console.log(res)
        this.setData({
          gamesData: res,
        });
      },
      fail: (msg) => {
        var message = '数据获取失败'
        if (msg) {
          message = msg
        }

        wx.showLoading({
          title: message,
        })
        setTimeout(() => {
          wx.hideLoading();
        }, 3000);
      },
      complete: function() {
        // complete  
        wx.hideLoading();
      }
    })

    wx.showLoading({
      title: '获取中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    setTimeout(function() {
      // wx.hideLoading();
    }, 5000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this

    //动态计算高度
    var query = wx.createSelectorQuery()
    query.select("#swiper").boundingClientRect(function(res) {
      console.log(res)
      if (res) {
        var height = res.width * 9 / 16 + 'px'
        that.setData({
          swiperImageHeight: height,
          swiperHeight: height + 20,
          // itemsHeight: 1208, //需移除
        })
      }
    }).exec()

    // 更新历史游戏
    this.getHistorys()

    // 设置为可push
    this.setData({
      readyToPush: false,
    })
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
    wx.stopPullDownRefresh();
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
   * tab切换
   */
  swichNav: function(e) {
    var current = e.target.dataset.current

    if (this.data.currentNavTab === current) {
      return false
    } else {

      var length = (this.data.gamesData[current].values).length

      var height = Math.ceil(length / 4) * 300 + 200
      if (height < 750) {
        height = 750
      }

      this.setData({
        currentNavTab: current,
        itemsHeight: height,
      })
    }
  },

  /**
   * swiper自动切换
   */
  bindChangeNav: function(e) {
    var current = e.detail.current
    var length = (this.data.gamesData[current].values).length

    var height = Math.ceil(length / 4) * 300 + 200
    if (height < 750) {
      height = 750
    }

    this.setData({
      currentNavTab: current,
      itemsHeight: height,
    })
  },

  /**
   * swiper自动切换
   */
  bindChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    })
  },

  /**
   * banner点击
   */
  bindBannerTap: function(e) {
    var url = e.target.dataset.banner.href;
    this.pushToGame(url)
  },

  /**
   * 列表点击
   */
  bindGameTap: function(e) {
    var game = e.target.dataset.game

    // 本地存储
    console.log('存储本地游戏')
    var historys = wx.getStorageSync('historys') || []
    historys.unshift(game)
    wx.setStorageSync('historys', historys)

    var url = game.url;
    this.pushToGame(url)
  },

  /**
   * 获取更多游戏
   */
  getMoreGames: function(e) {

    this.getGames();
  },

  /**
   * 根据游戏id跳转
   * @param url 跳转链接
   */
  pushToGame: function(url) {
    if (this.data.readyToPush) return;
    this.setData({
      readyToPush: true,
    })


    console.log('url: ' + url)

    var encodeUrl = encodeURIComponent(url)

    wx.navigateTo({
      url: '../web/web?url=' + encodeUrl,
    })
  }
})