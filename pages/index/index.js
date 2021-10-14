// index.js
// 获取应用实例
const app = getApp()
const screenH = app.globalData.screenH
Page({
  data: {
    styleStr: `height:${screenH}px;
    background: url('${app.globalData.reqUrl}images/1.jpeg');
    background-size: 100% ${screenH}px;`
  },
  enter(){
    wx.redirectTo({
      url: '/pages/swiper/swiper'
    })
  }
})
