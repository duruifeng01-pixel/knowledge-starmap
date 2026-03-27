// pages/home/home.js
const app = getApp();

Page({
  data: {
    date: '',
    greeting: '',
    tasks: [],
    showReminder: true
  },

  onShow() {
    this.loadTasks();
    this.setData({
      date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
      greeting: this.getGreeting()
    });
  },

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好，今天学点什么？';
    if (hour < 18) return '下午好，继续学习';
    return '晚上好，复习一下？';
  },

  async loadTasks() {
    try {
      const res = await wx.request({
        url: `${app.globalData.apiBase}/tasks`,
        header: { Authorization: `Bearer ${app.globalData.token}` }
      });
      this.setData({ tasks: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  openTask(e) {
    const taskId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/content/content?taskId=${taskId}` });
  },

  disableReminder() {
    this.setData({ showReminder: false });
  }
});
