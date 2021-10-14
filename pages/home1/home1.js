const app = getApp()
Page({
  data: {
    screenH: `height:${app.globalData.screenH -82}px`,
    current: 0,
    navArr: [
      {id:0, title: '钢琴曲',dataType: 'one'},
      {id:1, title: '中文歌',dataType: 'two'},
      {id:2, title: '纯音乐',dataType: 'three'}]
  },
  onLoad: function (options) {

  },
  changeId(e){
    this.setData({
      current: e.target.dataset.id
    })
  },
  swiperChange(e){
    this.setData({
      current: e.detail.current
    })
  }
})