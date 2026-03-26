// pages/onboarding/onboarding.js
const app = getApp();

Page({
  data: { step: 1, industry: '', goals: '', domains: '' },

  onIndustryInput(e) { this.setData({ industry: e.detail.value }); },
  onGoalsInput(e) { this.setData({ goals: e.detail.value }); },
  onDomainsInput(e) { this.setData({ domains: e.detail.value }); },

  nextStep() { this.setData({ step: this.data.step + 1 }); },

  async submit() {
    const profile = {
      industry: this.data.industry,
      goals: this.data.goals,
      domains: this.data.domains.split(',').map(d => d.trim()),
      level: 'beginner'
    };
    try {
      const res = await wx.request({
        url: `${app.globalData.apiBase}/users/register`,
        method: 'POST',
        data: { profile }
      });
      if (res.data.user) {
        app.globalData.user = res.data.user;
        app.globalData.token = res.data.token;
        wx.switchTab({ url: '/pages/home/home' });
      }
    } catch (err) {
      wx.showToast({ title: '注册失败', icon: 'error' });
    }
  }
});