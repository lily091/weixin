// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    // reqUserUrl: 'http://192.168.1.100:1338/users/',
    // reqUrl: 'http://192.168.1.100:1338/',
    // reqUpload: 'http://192.168.1.100:1338',
    reqUserUrl: 'http://192.168.6.1:1338/users/',
    reqUrl: 'http://192.168.6.1:1338/',
    reqUpload: 'http://192.168.6.1:1338',
    screenH: wx.getSystemInfoSync().windowHeight
  }
})
