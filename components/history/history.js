// components/history/history.js
Component({
  options: {
    multipleSlots: true,
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    // 历史游戏
    historys: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGameTap(e){
      var game = e.target.dataset.game
      console.log('点击历史游戏')
      console.log(game)
    }
  }
})
