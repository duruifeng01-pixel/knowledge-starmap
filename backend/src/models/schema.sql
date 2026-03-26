-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openid VARCHAR(128) UNIQUE,
  username VARCHAR(64),
  profile JSONB DEFAULT '{}',  -- { industry, goals, domains, level }
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Knowledge Frameworks table
CREATE TABLE knowledge_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(128),
  nodes JSONB DEFAULT '[]',   -- [{ id, label, parentId, status }]
  edges JSONB DEFAULT '[]',    -- [{ from, to }]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Learning Tasks table
CREATE TABLE learning_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(256),
  content_source TEXT,
  content_markdown TEXT,
  mindmap_data JSONB DEFAULT '{}',
  status VARCHAR(32) DEFAULT 'pending',  -- pending, in_progress, completed
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Discussion Records table
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES learning_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',  -- [{ role, content, timestamp }]
  insights JSONB DEFAULT '[]',   -- [{ concept, content, timestamp }]
  created_at TIMESTAMP DEFAULT NOW()
);

-- Information Sources table
CREATE TABLE information_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(128),
  type VARCHAR(32),  -- wechat, bilibili, xiaohongshu, rss, url
  url TEXT,
  status VARCHAR(32) DEFAULT 'active',
  last_fetched_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_user ON learning_tasks(user_id);
CREATE INDEX idx_tasks_status ON learning_tasks(status);
CREATE INDEX idx_discussions_task ON discussions(task_id);
CREATE INDEX idx_frameworks_user ON knowledge_frameworks(user_id);