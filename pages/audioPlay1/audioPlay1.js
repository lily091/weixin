const app = getApp()
Page({
  data: {
    obj: {},
    current: 0,
    percent: 0,
    total: 0,
    flag: true
  },
  onLoad: function (options) {
    this.options = options  //将options对外
    wx.request({
      data: options,
      url: app.globalData.reqUserUrl+ 'getAudioId',
      success: rs=>{
        const obj=rs.data
        obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
        obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
        this.setData({
          obj
        })
        this.dataProc(obj)
      }
    })
  },
  dataProc(obj){
    const BGM = wx.getBackgroundAudioManager()
    this.BGM = BGM
    BGM.title = obj.title
    BGM.src = app.globalData.reqUrl+obj.url
    let current
    if (this.options.playTime) {
      current = parseInt(this.options.playTime)
      BGM.seek(current)
      this.setData({
        current,
      })
    }
    let total
    BGM.onTimeUpdate(_=>{
      current = parseInt(BGM.currentTime)
      total = parseInt(BGM.duration)
      this.setData({
        total,
        current,
        percent: parseInt(current/total*100)
      })
    })
    //监听音频自然播放至结束的事件
    BGM.onEnded(_=>{
      this.setData({
        flag: false
      })
      this.next()
    })
    BGM.onWaiting(_=>{
      wx.showLoading({
        title: '加载中,请稍后',
        })
      })
    BGM.onCanplay(_=>{
      wx.hideLoading()
    })
  },
  // 返回上一页
  onUnload(){
    this.BGM.stop()
    const data = {}
    data.mediaId = this.options.id
    data.srcType = "audio"
    const until=require('../../utils/util')
    const current =this.data.current
    const title = this.data.obj.title
    data.playTime = current
    data.title = title
    if (current>=20) {
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
  play(){
    this.BGM.play()
    this.setData({
      flag: true
    })
  },
  pause(){
    this.BGM.pause()
    this.setData({
      flag: false
    })
  },
  stop(){
    this.BGM.stop()
    this.setData({
      current: 0,
      percent: 0,
      flag: false
    })
  },
  sliderChange(e){
    const pre = e.detail.value
    const current=parseInt(pre/100*this.data.total)
    this.BGM.seek(current)
    this.setData({
      current,
      percent: parseInt(current/this.data.total*100)
    })
   this.pause()
  },
  // 前一首
  prev(){
    this.stop()
    wx.request({
      data: this.options,
      url: app.globalData.reqUserUrl+ 'getAudioPrev',
      success: rs=>{
        const obj=rs.data
        if (obj) {
          this.options.id = obj.id
          obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
          obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
          this.BGM.src = app.globalData.reqUrl+obj.url
          this.setData({
            obj,
            flag: true
          })
          this.dataProc(obj)
        }else{
          wx.showToast({
            title: '已经到第一首了',
          })
        }
      }
    })
  },
  next(){
    this.stop()
    wx.request({
      data: this.options,
      url: app.globalData.reqUserUrl+ 'getAudioNext',
      success: rs=>{
        const obj=rs.data
        if (obj) {
          this.options.id = obj.id
          obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
          obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
          this.BGM.src = app.globalData.reqUrl+obj.url
          this.setData({
            obj,
            flag: true
          })
          this.dataProc(obj)
        }else{
          wx.showToast({
            title: '已经到最后一首了',
          })
        }
      }
    })
  }
})