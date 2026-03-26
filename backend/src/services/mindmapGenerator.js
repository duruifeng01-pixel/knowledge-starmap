// backend/src/services/mindmapGenerator.js
const https = require('https');

/**
 * Generates a mind map structure from markdown content.
 * Uses Claude API (user-provided key) to extract key concepts.
 */
async function generateMindmap(markdown, userApiKey) {
  const prompt = `从以下内容中提取知识结构，生成一个思维导图框架。

返回JSON格式（只返回JSON，不要其他内容）：
{
  "nodes": [
    {"id": "root", "label": "核心主题", "parentId": null, "status": "in-progress"},
    {"id": "sub-1", "label": "子主题1", "parentId": "root", "status": "not-started"},
    {"id": "sub-2", "label": "子主题2", "parentId": "root", "status": "not-started"}
  ],
  "edges": [
    {"from": "root", "to": "sub-1"},
    {"from": "root", "to": "sub-2"}
  ]
}

内容：
${markdown.substring(0, 4000)}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': userApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const content = data.content[0].text;
  const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, content];
  return JSON.parse(jsonMatch[1] || content.trim());
}

module.exports = { generateMindmap };