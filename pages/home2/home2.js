const app = getApp()
Page({
  data: {
    screenH: `height:${app.globalData.screenH -82}px`,
    current: 0,
    navArr: [
      {id:0, title: '狗十三',dataType: 'gss'},
      {id:1, title: '声东击西',dataType: 'sdjx'},
      {id:2, title: '知否知否',dataType: 'zfzf'}]
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