import anthropic

def generate_mindmap(markdown_content, api_key):
    """Use Claude to extract mind map structure from markdown."""
    if not api_key:
        raise ValueError("API key required")

    client = anthropic.Anthropic(api_key=api_key)

    prompt = f"""从以下内容中提取知识结构，生成一个思维导图框架。

返回JSON格式：
{{
  "nodes": [
    {{"id": "root", "label": "核心主题", "status": "in-progress"}},
    {{"id": "sub-1", "label": "子主题1", "parentId": "root", "status": "not-started"}}
  ],
  "edges": [
    {{"from": "root", "to": "sub-1"}}
  ]
}}

内容：
{markdown_content[:3000]}
"""

    message = client.messages.create(
        model="claude-sonnet-4-6-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}]
    )

    import json
    text = message.content[0].text
    json_match = text.find('{')
    json_str = text[json_match:]
    return json.loads(json_str)