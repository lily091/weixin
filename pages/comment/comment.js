// pages/comment/comment.js
const app = getApp()
Page({
  data: {
    arr: [],
    isShow: false,
    tempPhotos: [],//评论图片列表
  },
  onLoad: function (json) {
    this.articleId = json.articleId
    this.photos = []
    this.dataProc(0)
    this.isFresh = false  //刷新标志位
  },
  // 拉取数据
  dataProc(skip, fun){
    const pageSize = 2 //一页的条数
    wx.request({
      data: {articleId:this.articleId,skip,pageSize},
      url: app.globalData.reqUserUrl+ 'getComment',
      success: rs=>{
        let arr = rs.data
        if(arr.length===0){
          wx.showToast({
            title: '没有数据了哦',
          })
          return
        }
        arr = arr.map(el =>{
          el.imgPaths=JSON.parse(el.imgPaths)
          return el
        })
        if (this.isFresh) {
          this.setData({
            arr
          })
          if (fun)fun()//执行回调函数
        }else{
          this.setData({
            arr: [...this.data.arr,...arr]
          })
        }
      }
    })
  },
  //图片选择
  selectPhone() {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success:res=>{
        const tempPhotos = res.tempFilePaths
        this.setData({
          tempPhotos
        })
        tempPhotos.forEach(filePath=>{
          wx.uploadFile({
            filePath,
            name: 'file',
            url: app.globalData.reqUserUrl+"receiveImg",
            success: re=> {
              const photoName = app.globalData.reqUrl+'photos/'+ JSON.parse(re.data)
              this.photos.push(photoName)
            }
          })
        })
      }
    })
  },
    // 发表评论
    formSubmit(e){
      wx.getUserProfile({
        desc: '评论需要公开信息授权',
        success: res =>{
          const avatarUrl = res.userInfo.avatarUrl
          const nickName = res.userInfo.nickName
          const data = e.detail.value
          const content = data.content;
          if (content==='') {
            wx.showToast({
              title: '评论不能为空',
            })
            return
          }
          if (this.photos.length!=0) {
            data.imgPaths = this.photos
          }
          data.avatarUrl = avatarUrl
          data.nickName = nickName
          data.articleId = this.articleId
          wx.request({
            data,
            url: app.globalData.reqUserUrl + 'postComment',
            success: rs=>{
              console.log(rs.data);
              wx.showToast({
                title: '评论成功',
              })
              this.setData({
                isShow: false
              })
              this.dataProc()      //刷新数据
            }
          })
        }
      })
    },
  showPage(){
    this.setData({
      isShow: true,
    })
  },
  closePage(){
    this.setData({
      isShow: false
    })
  },
  reset(){
    this.setData({
      tempPhotos: []
    })
  },
  onPullDownRefresh: function(){
    this.isFresh = true
    this.dataProc(0,function(){
      wx.showToast({
        title: '刷新成功',
      })
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function(){
    this.isFresh = false
    this.dataProc(0,function(){
      wx.showToast({
        title: 'title',
      })
    })
  }

})