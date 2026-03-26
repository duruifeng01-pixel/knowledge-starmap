// pages/discussion/discussion.js
const app = getApp();

const DISCUSSION_STEPS = [
  {
    text: '用自己的话解释这篇文章的核心观点是什么？',
    hint: '不要引用原文，试着用你自己的语言表达'
  },
  {
    text: '这篇文章和你已知的哪个知识点相关联？',
    hint: '想想之前学过的内容，有没有可以连接的地方'
  },
  {
    text: '你认为作者论证这个观点的逻辑是什么？',
    hint: '他的证据和结论之间的桥梁是什么'
  },
  {
    text: '你同意还是不同意这个观点？为什么？',
    hint: '不需要完全同意或反对，可以有条件地认同'
  },
  {
    text: '读完这篇文章后，你想深入了解什么？',
    hint: '哪方面你还觉得模糊，值得继续探索'
  }
];

Page({
  data: {
    taskId: '',
    currentStep: 0,
    totalSteps: DISCUSSION_STEPS.length,
    currentQuestion: {},
    answer: '',
    answers: [],
    completed: false,
    progress: 0
  },

  onLoad(options) {
    this.setData({
      taskId: options.taskId,
      currentQuestion: DISCUSSION_STEPS[0]
    });
  },

  onAnswerInput(e) {
    this.setData({ answer: e.detail.value });
  },

  async submitAnswer() {
    const { currentStep, answer, answers } = this.data;
    const newAnswers = [...answers, { step: currentStep, answer }];
    this.setData({ answers: newAnswers, answer: '', completed: true });
    this.updateProgress();
    await this.saveAnswer(currentStep, answer);
  },

  async saveAnswer(step, answer) {
    try {
      await wx.request({
        url: `${app.globalData.apiBase}/discussions/${this.data.taskId}/answer`,
        method: 'POST',
        header: { Authorization: `Bearer ${app.globalData.token}` },
        data: { step, answer }
      });
    } catch (err) {
      console.error(err);
    }
  },

  updateProgress() {
    const progress = ((this.data.currentStep + 1) / this.data.totalSteps) * 100;
    this.setData({ progress });
  },

  nextQuestion() {
    const nextStep = this.data.currentStep + 1;
    if (nextStep >= this.data.totalSteps) {
      wx.showToast({ title: '讨论完成！', icon: 'success' });
      this.updateTaskStatus('completed');
      return;
    }
    this.setData({
      currentStep: nextStep,
      currentQuestion: DISCUSSION_STEPS[nextStep],
      completed: false,
      progress: (nextStep / this.data.totalSteps) * 100
    });
  },

  async updateTaskStatus(status) {
    await wx.request({
      url: `${app.globalData.apiBase}/tasks/${this.data.taskId}/status`,
      method: 'PATCH',
      header: { Authorization: `Bearer ${app.globalData.token}` },
      data: { status }
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
