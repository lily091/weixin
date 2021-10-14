const app = getApp()
Page({
  data: {
    obj: {},
    startTime: 0
  },
  onLoad: function (options) {
    this.options = options  //将options对外
    if (options.playTime) {
      this.setData({
        startTime: parseInt(options.playTime)
      })
    }
    
    wx.request({
      data: options,
      url: app.globalData.reqUserUrl+ 'getVideoId',
      success: rs=>{
        const obj=rs.data
        obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
        obj.url = app.globalData.reqUrl+obj.url
        obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
        this.setData({
          obj
        })
      }
    })
  },
  timeupdate(e){
    //console.log(e.detail.currentTime);
    this.playTime = e.detail.currentTime
  },
  onUnload(){
    const data = {}
    data.mediaId = this.options.id
    data.srcType = "video"
    const until=require('../../utils/util')
    const current = parseInt(this.playTime)
    const title = this.data.obj.title
    data.playTime = current
    data.title = title
    if (current>=4) {
      until.getOpenId(openId=>{
        data.openId = openId
        wx.request({
          data,
          url: app.globalData.reqUserUrl+ 'addPlayRecord',
          success:rs=>{
            console.log(rs.data);
          }
        })
      })
    }
  },
  end(){
    this.next()
  },
  prev(){
    wx.request({
      data: this.options,
      url: app.globalData.reqUserUrl+ 'getVideoPrev',
      success: rs=>{
        const obj=rs.data
        if (obj) {
          this.options.id = obj.id
          obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
          obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
          obj.url = app.globalData.reqUrl+obj.url
          this.setData({
            obj
          })
        }else{
          wx.showToast({
            title: '已经到第一集了',
          })
        }
      }
    })
  },
  next(){
    wx.request({
      data: this.options,
      url: app.globalData.reqUserUrl+ 'getVideoNext',
      success: rs=>{
        const obj=rs.data
        if (obj) {
          this.options.id = obj.id
          obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
          obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
          obj.url = app.globalData.reqUrl+obj.url
          this.setData({
            obj
          })
        }else{
          wx.showToast({
            title: '已经到最后一集了',
          })
        }
      }
    })
  }
})