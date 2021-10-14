const formatDate = (t) => {
  const d = new Date(t)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  
  return `${year}年${month}月${day}日`
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const app=getApp()
const getOpenId = function(fun){
  wx.login({
    success: rs => {
        if (rs.code) {
            let code = rs.code
            wx.request({
                    url: app.globalData.reqUserUrl+'getUserInfo',
                    data: { code },
                    success: obj => {
                        if (fun) fun(obj.data) //obj.data就是openId
                    }
                })
                // 发送 rs.code 到后台换取 openId, sessionKey, unionId
        } else {
            console.log('获取用户登录态失败！' + rs.errMsg);
        }
    }
})
}
module.exports = {
  formatTime,
  formatDate,
  getOpenId
}
