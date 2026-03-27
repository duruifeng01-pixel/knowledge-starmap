// backend/src/services/reminder.js
const https = require('https');

async function sendReminder(userOpenid, taskTitle) {
  // WeChat template message API
  const accessToken = await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;

  const payload = {
    touser: userOpenid,
    template_id: 'YOUR_TEMPLATE_ID',  // Configure in WeChat backend
    data: {
      first: { value: '今日学习任务待完成', color: '#6366F1' },
      keyword1: { value: taskTitle, color: '#FFFFFF' },
      keyword2: { value: '知识星图', color: '#8A8A8A' },
      remark: { value: '点击开始今日学习，点亮你的知识星图 ✨', color: '#22C55E' }
    }
  };

  // In production, use wx-server-sdk or call WeChat API
  console.log('Reminder payload:', JSON.stringify(payload));
}

async function getAccessToken() {
  // Fetch from WeChat API
  return process.env.WECHAT_ACCESS_TOKEN;
}

// Run reminder check every hour
function scheduleReminders() {
  setInterval(async () => {
    // Check users with pending tasks older than 4 hours
    // Send reminders via WeChat template messages
    console.log('Checking for pending task reminders...');
  }, 60 * 60 * 1000);
}

module.exports = { scheduleReminders, sendReminder };
