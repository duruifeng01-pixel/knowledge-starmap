// mini-program/app.js
App({
  onLaunch() {
    // Check if user is logged in
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.globalData.user = wx.getStorageSync('user');
    }
  },
  globalData: {
    apiBase: 'http://localhost:3000/api',
    user: null,
    token: null
  }
});