// pages/swiper/swiper.js
const app = getApp()
const screenH = app.globalData.screenH
Page({
  data: {
    styleStr: `height:${screenH}px;
    background: url('${app.globalData.reqUrl}images/2.jpeg');
    background-size: 100% ${screenH}px`,
    arr: [
      {id: 1, title: '你好生活', content: '你好世界'},
      {id: 2, title: '你好世界', content: '你好世界'},
      {id: 3, title: '你好同学', content: '你好世界'}
    ]
  },
  enterHome(e){
    if(e.detail.current === 2){
      setTimeout(_=>{
        wx.switchTab({
          url: '/pages/home/home',
        })
      },2000)
      
    }
  },
  enterHome1(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
})
