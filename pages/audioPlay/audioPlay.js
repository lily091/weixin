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
    const innerAudio = wx.createInnerAudioContext()
    this.iAo = innerAudio
    let current
    let total
    innerAudio.onTimeUpdate(_=>{
      current = parseInt(innerAudio.currentTime)
      total = parseInt(innerAudio.duration)
      this.setData({
        total,
        current,
        percent: parseInt(current/total*100)
      })
    })
    //监听音频自然播放至结束的事件
    innerAudio.onEnded(_=>{
      this.setData({
        flag: false
      })
      this.next()
    })
    innerAudio.autoplay =true
    wx.request({
      data: options,
      url: app.globalData.reqUserUrl+ 'getAudioId',
      success: rs=>{
        const obj=rs.data
        obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
        obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
        innerAudio.src = app.globalData.reqUrl+obj.url
        this.setData({
          obj
        })
      }
    })
  },
  onUnload(){
    this.iAo.stop()
  },
  play(){
    this.iAo.play()
    this.setData({
      flag: true
    })
  },
  pause(){
    this.iAo.pause()
    this.setData({
      flag: false
    })
  },
  stop(){
    this.iAo.stop()
    this.setData({
      current: 0,
      percent: 0,
      flag: false
    })
  },
  sliderChange(e){
    const pre = e.detail.value
    const current=parseInt(pre/100*this.data.total)
    this.iAo.seek(current)
    this.setData({
      current,
      percent: parseInt(current/this.data.total*100)
    })
   this.pause()
  },
  prev(){
    wx.request({
      data: this.options,
      url: app.globalData.reqUserUrl+ 'getAudioPrev',
      success: rs=>{
        const obj=rs.data
        if (obj) {
          this.options.id = obj.id
          obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
          obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
          this.iAo.src = app.globalData.reqUrl+obj.url
          this.setData({
            obj,
            flag: true
          })
        }else{
          wx.showToast({
            title: '已经到第一首了',
          })
        }
      }
    })
  },
  next(){
    wx.request({
      data: this.options,
      url: app.globalData.reqUserUrl+ 'getAudioNext',
      success: rs=>{
        const obj=rs.data
        if (obj) {
          this.options.id = obj.id
          obj.dateTime=require('../../utils/util').formatTime(new Date(obj.updatedAt))
          obj.smallSrc = app.globalData.reqUrl+obj.smallSrc
          this.iAo.src = app.globalData.reqUrl+obj.url
          this.setData({
            obj,
            flag: true
          })
        }else{
          wx.showToast({
            title: '已经到最后一首了',
          })
        }
      }
    })
  }
})