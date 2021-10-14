// pages/home/home.js
const app = getApp()
const screenH = app.globalData.screenH
Page({
  data: {
    arr: [],
    inputVal:'',
    isCancel: false,
    screenH: `height:${screenH}px;`
  },
  onLoad: function (options) {
    this.dataProc(0)
    this.dataFlag = true
    this.setData({
      search: this.search.bind(this)
    })
  },
  search: function(keyword){
    if (keyword==='') {
      this.clearFun()
      return
    }
    return new Promise((resolve, reject)=>{
      wx.request({
        data: {keyword},
        url: app.globalData.reqUserUrl+'getSearchData',
        success: rs => {
          const temp = rs.data
          const arr = temp.map(el=>{
            el.smallSrc = app.globalData.reqUrl +'smallSrc/'+ el.smallSrc
            el.time = require('../../utils/util').formatTime(new Date(el.updatedAt))
            return el
          })
          this.setData({
            arr
          })
        }
      })
    })
  },
  focusfun(){
    this.setData({
      isCancel: true
    })
  },
  clearFun(){
    this.dataProc(0)
    this.setData({
      isCancel: true
    })
  },
  blurFun(){
    //this.dataProc(0)
    this.setData({
      inputVal: ''
    })
  },
  dataProc(start,fun){
    const pageSize = 7
    wx.request({
      data: {start,pageSize},
      url: app.globalData.reqUserUrl+'getArt',
      success:rs=>{
        const temp = rs.data
        if(temp.length === 0){
          wx.showToast({
            title: '已经没有了哦',
          })
          this.dataFlag = false
          return
        }
        let arrFrom = temp.map(el=>{
          el.smallSrc = app.globalData.reqUrl +'smallSrc/'+ el.smallSrc
          el.time = require('../../utils/util').formatTime(new Date(el.updatedAt))
          return el
        })
        if(start){
          this.setData({
            arr: [...this.data.arr,...arrFrom]
          })
        }else{
          this.setData({
            arr: arrFrom
          })
          this.dataFlag = true
          if(fun) fun()
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      inputVal: '',
      isCancel: false
    })
    this.dataProc(0,function(){
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.dataFlag){
      let arrLen = this.data.arr.length
      this.dataProc(arrLen)
    }
  },
})