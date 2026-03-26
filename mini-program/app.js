// mini-program/app.js
App({
  onLaunch() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
  },
  globalData: {
    apiBase: 'http://localhost:3000/api',
    user: null,
    token: null
  }
});