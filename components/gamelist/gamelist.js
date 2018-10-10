// components/gamelist/gamelist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 游戏列表
    list: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '加载中...', // 状态
    isList: true,   //判断是否以列表形式显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGameTap(e) {
      var game = e.target.dataset.game
      console.log('点击游戏')
      console.log(game)

      this.triggerEvent('bindGameTap', {
        game
      }, {})
    }
  }
})
