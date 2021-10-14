const app = getApp()
Component({
// 组件的属性列表
  properties: {
    dataType:{
      type: String,
      value: ''
    },
    // 数据类型音频/视频
    srcType: {
      type: String,
      value: ''
    },
    //是否为背景音乐
    mode:{
      type: String,
      value: 'innerAudio'
    }
  },
  data: {
    arr: [],
    flag: false,//设置是否有自定义下拉刷新，true正在执行下拉刷新，false等待触发下拉刷新事件
    audioType: ''
  },
  attached(){
    // 相当于onload
    const srcType = this.properties.srcType
    const dataType = this.properties.dataType
    this.noData = false   //数据加载标志位，true表示数据库数据已经全部加载完
    this.dataLoad(srcType,dataType,0)
    if(this.properties.mode==='backgroundAudio'){
      this.setData({
        audioType:'audioPlay1/audioPlay1'
      })
    }else{
      this.setData({
        audioType:'audioPlay/audioPlay'
      })
    }
  },
  methods: {
    downFresh(){
      this.inFreash = true  //刷新标志位,true刷新
     const srcType = this.properties.srcType
     const dataType = this.properties.dataType
     this.noData=false
     this.dataLoad(srcType,dataType,0,()=>{
      this.setData({
        flag: false
      })
     })
    },
    loaded(){
      this.inFreash = false
      const srcType = this.properties.srcType
      const dataType = this.properties.dataType
      const records = this.data.arr.length
      this.dataLoad(srcType,dataType,records)
    },
    dataLoad(srcType,dataType,records,fun){
      if(this.noData)return
      const until = require('../../utils/util')
      let num = 7
      wx.request({
        data: {srcType,dataType,records,num},
        url: app.globalData.reqUserUrl+'mediaData',
        success: (rs)=>{
          let arr1 = rs.data
          if(!arr1.length){
            wx.showToast({
              title: '数据加载完了哦',
            })
            this.noData = true  //数据库中的数据已经全部加载
            return
          }
          arr1 = arr1.map(el=>{
            if (srcType==='audio') {
               el.dateTime = until.formatTime(new Date())
            } else {
              el.dateTime = until.formatDate(new Date())
            }
           
            el.src = app.globalData.reqUrl + el.smallSrc
            return el
          })
          if(this.inFreash){
            this.setData({
              arr:arr1
            })
            if(fun) fun()
          }else{
            this.setData({
              arr:[...this.data.arr,...arr1]
            })
          }
        }
      })
    },
  }
})
