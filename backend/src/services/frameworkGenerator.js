/**
 * Generates an initial knowledge framework based on user profile.
 * Uses Claude API (user-provided key) to generate structured nodes.
 */

async function generateFramework(profile, userApiKey) {
  const prompt = `Based on the following user profile, generate a knowledge framework:

Industry: ${profile.industry}
Goals: ${profile.goals}
Domains: ${profile.domains.join(', ')}
Current Level: ${profile.level || 'beginner'}

Return a JSON object with:
{
  "name": "User's Knowledge Framework",
  "nodes": [
    { "id": "root", "label": "Root topic", "parentId": null, "status": "in_progress" },
    { "id": "topic-1", "label": "Subtopic name", "parentId": "root", "status": "not-started" }
  ],
  "edges": [
    { "from": "root", "to": "topic-1" }
  ]
}

Generate 8-15 nodes covering the key areas the user should learn.
Each node should be a concrete, learnable concept.
Return ONLY the JSON, no explanation.`;

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
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, content];
  return JSON.parse(jsonMatch[1] || content.trim());
}

module.exports = { generateFramework };
