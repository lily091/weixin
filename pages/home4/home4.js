const app = getApp()
Page({
  data: {
    arr: [],
    screenH: app.globalData.screenH
  },
  onLoad: function (options) {
  },
 onShow: function () {
  const until = require('../../utils/util')
  until.getOpenId(openId=>{
    wx.request({
      data: {openId},
      url: app.globalData.reqUserUrl+ 'getRecord',
      success: rs=>{
        let arr = rs.data
        arr=arr.map(el=>{
          if (el.srcType==="audio")
            el.mediaPlay='/pages/audioPlay1/audioPlay1?id='+el.mediaId+"&playTime="+el.playTime
          else
            el.mediaPlay='/pages/videoPlay/videoPlay?id='+el.mediaId+"&playTime="+el.playTime
          el.smallSrc = app.globalData.reqUrl+'rouseimg/'+parseInt(Math.random()*17+1)+'.jpeg'
          el.dataTime = until.formatTime(new Date(el.updatedAt))
          return el
        })
        this.setData({
          arr
        })
      }
    })
  })
 },
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})