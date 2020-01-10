//app.js
App({
  onLaunch: function () {
    console.log('onlanuch');
    const phonenumber = wx.getStorageSync('phonenumber');
    if (!phonenumber){
      wx.redirectTo({
        url: './pages/index/index',
      })
    }
    
  },
  globalData: {
    userInfo: null
  }
})