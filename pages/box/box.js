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
    currentNavTab: 0, //游戏列表导航栏选择项
    readyToPush: false, //判断是否跳转

    page: 1, //默认1
    pageSize: 20 //默认20
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
        that.getGames(() => {
          that.setListHeight(this.data.currentNavTab)
        })
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
  getHistorys() {
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
  getGames: function(complete) {
    network.POST({
      action: app.globalData.actions.getGameList,
      params: {
        page: this.data.page,
        pageSize: this.data.pageSize,
      },
      success: (res) => {
        console.log('获取游戏列表成功:')
        console.log(res)
        console.log('page:' + this.data.page)

        var tempGames = this.data.gamesData
        var page = this.data.page
        if (tempGames.length > 0 && this.data.page != 1 && this.data.currentNavTab != 0) {
          tempGames[1].values = tempGames[1].values.concat(res[1].values)
          page += 1
        } else {
          tempGames = res
          if (this.data.currentNavTab == 0) {

          } else {
            page += 1
          }
        }

        this.setData({
          gamesData: tempGames,
          page: page,
        });

        // var message = '加载完成'

        // wx.showToast({
        //   title: message,
        // })
      },
      fail: (msg) => {
        var message = '失败'
        if (msg) {
          message = msg
        }

        wx.showToast({
          title: message
        })
      },
      complete: function() {
        // complete  

        wx.hideNavigationBarLoading()
        setTimeout(() => {
          wx.hideToast()
          wx.hideLoading()

        }, 3000);

        if (complete) {
          complete()
        }
      }
    })

    // wx.showLoading({
    //   title: '获取中',
    // })
    wx.showNavigationBarLoading()
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
    // 下拉 初始化page表
    this.setData({
      page: 1,
    })

    this.getGames(() => {
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getMoreGames()
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
      this.setListHeight(current)
    }
  },

  /**
   * swiper自动切换
   */
  bindChangeNav: function(e) {
    var current = e.detail.current
    this.setListHeight(current)
  },

  /**
   * 动态设置高度
   */
  setListHeight(segmentIndex) {
    if (this.data.gamesData.length <= segmentIndex) {
      return
    }
    var length = (this.data.gamesData[segmentIndex].values).length

    var height = Math.ceil(length / 1) * 200 + 200
    if (height < 750) {
      height = 750
    }

    this.setData({
      currentNavTab: segmentIndex,
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
    var banner = e.target.dataset.banner
    var url = banner.href
    var name = banner.name
    this.pushToGame(url, name)
  },

  /**
   * 历史纪录点击
   */
  bindHistoryTap: function(e) {
    console.log(e)
    var game = e.detail.game

    // 本地存储
    this.saveGame(game)

    var url = game.url
    console.log(game)
    this.pushToGame(url, game.name)
  },

  /**
   * 列表点击
   */
  bindGameTap: function(e) {
    console.log(e)
    var game = e.target.dataset.game

    // 本地存储
    this.saveGame(game)

    var url = game.url;
    this.pushToGame(url, game.name)
  },

  /**
   * 存储游戏到本地
   */
  saveGame(game) {
    console.log('存储本地游戏:')
    console.log(game)
    var historys = wx.getStorageSync('historys') || []
    for (var i = 0; i < historys.length; i++) {
      var oldGame = historys[i]
      if (oldGame.id === game.id) {
        historys.splice(i, 1);
        break
      }
    }
    historys.unshift(game)
    wx.setStorageSync('historys', historys)
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
  pushToGame: function(url, title) {
    if (this.data.readyToPush) return;
    this.setData({
      readyToPush: true,
    })


    console.log('url: ' + url)

    var encodeUrl = encodeURIComponent(url)

    wx.navigateTo({
      url: '../web/web?url=' + encodeUrl + '&title=' + title,
    })
  }
})