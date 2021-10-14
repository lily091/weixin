const app = getApp()
const until = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls: [],  //文章图片列表
    obj: {},
    tempPhotos: [],//评论图片列表
    comNum: 0
  },
  onLoad: function (options) {
    wx.request({
      data: options,
      url: app.globalData.reqUserUrl+'getArtId',
      success: rs=>{
        const obj = rs.data.obj;
        obj.dateTime = until.formatTime(new Date(obj.updatedAt))
        obj.content = obj.content.replace(/\{\{imgUrl\}\}/g,app.globalData.reqUpload).replace(/<p>/g,'<p class="p">').replace(/<img/g,'<img class="img"')
        let urls=obj.content.match(/src=\"[^\"]+/g)
        urls = urls.map(el=>{
          return el.replace('src="','')
        })
        this.setData({
          obj,
          urls,
          comNum: rs.data.num
        })
      }
    })
    this.photos = []
  },
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
        data.articleId = this.data.obj.id
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
          }
        })
      }
    })
  },
imgTap(){
  wx.previewImage({
    current: this.data.urls[0],  //当前显示图片http连接
    urls: this.data.urls  //需要预览的链接列表 
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
goComment(){
  wx.navigateTo({
    url: '/pages/comment/comment?articleId='+this.data.obj.id,
  })
}
})