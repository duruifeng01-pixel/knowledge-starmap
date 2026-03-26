// pages/content/content.js
const app = getApp();

Page({
  data: {
    taskId: '',
    content: '',
    mindmapNodes: [],
    panelExpanded: false,
    discussionStarted: false
  },

  onLoad(options) {
    this.setData({ taskId: options.taskId });
    this.loadTask(options.taskId);
  },

  async loadTask(taskId) {
    try {
      const res = await wx.request({
        url: `${app.globalData.apiBase}/tasks/${taskId}`,
        header: { Authorization: `Bearer ${app.globalData.token}` }
      });
      const task = res.data;
      this.setData({
        content: task.content_markdown || '内容加载中...',
        mindmapNodes: task.mindmap_data?.nodes || []
      });
    } catch (err) {
      console.error(err);
    }
  },

  togglePanel() {
    this.setData({ panelExpanded: !this.data.panelExpanded });
  },

  onNodeTap(e) {
    const nodeId = e.currentTarget.dataset.id;
    wx.showToast({ title: `查看节点: ${nodeId}`, icon: 'none' });
  },

  startDiscussion() {
    wx.navigateTo({
      url: `/pages/discussion/discussion?taskId=${this.data.taskId}`
    });
  }
});