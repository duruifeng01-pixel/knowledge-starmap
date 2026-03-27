// pages/mindmap/mindmap.js
const app = getApp();

Page({
  data: {
    nodes: [],
    edges: [],
    masteredCount: 0,
    totalCount: 0,
  },

  onShow() {
    this.loadFramework();
  },

  loadFramework() {
    const token = app.globalData.token;
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.request({
      url: `${app.globalData.apiBase}/knowledge/framework`,
      method: 'GET',
      header: {
        Authorization: `Bearer ${token}`,
      },
      success: (res) => {
        if (res.data) {
          this.setData({
            nodes: res.data.nodes || [],
            edges: res.data.edges || [],
            totalCount: res.data.nodes ? res.data.nodes.length : 0,
            masteredCount: res.data.nodes
              ? res.data.nodes.filter((n) => n.status === 'mastered').length
              : 0,
          });
          this.drawMindMap();
        }
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
    });
  },

  drawMindMap() {
    const { nodes, edges } = this.data;
    const ctx = wx.createCanvasContext('starmap');

    ctx.setFillStyle('#0D0D0D');
    ctx.fillRect(0, 0, 750, 600);

    // Draw edges
    ctx.setStrokeStyle('#2A2A2A');
    ctx.setLineWidth(1);
    edges.forEach((edge) => {
      const fromIdx = nodes.findIndex((n) => n.id === edge.from);
      const toIdx = nodes.findIndex((n) => n.id === edge.to);
      if (fromIdx !== -1 && toIdx !== -1) {
        const fromX = (fromIdx % 4) * 180 + 90;
        const fromY = Math.floor(fromIdx / 4) * 120 + 100;
        const toX = (toIdx % 4) * 180 + 90;
        const toY = Math.floor(toIdx / 4) * 120 + 100;
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node, i) => {
      const x = (i % 4) * 180 + 90;
      const y = Math.floor(i / 4) * 120 + 100;
      const color = this.getNodeColor(node.status);

      ctx.beginPath();
      ctx.setFillStyle(color);
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.setFillStyle('#FFFFFF');
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      const label = node.label ? node.label.substring(0, 6) : node.id.substring(0, 6);
      ctx.fillText(label, x, y + 50);
    });

    ctx.draw();
  },

  getNodeColor(status) {
    switch (status) {
      case 'mastered':
        return '#22C55E';
      case 'in-progress':
        return '#6366F1';
      default:
        return '#2A2A2A';
    }
  },

  onCanvasTap() {
    wx.showToast({ title: '点击了星图', icon: 'none' });
  },

  viewInsights() {
    wx.showToast({ title: '思考记录页面 (v2)', icon: 'none' });
  },

  adjustStructure() {
    wx.showToast({ title: '结构编辑页面 (v2)', icon: 'none' });
  },
});