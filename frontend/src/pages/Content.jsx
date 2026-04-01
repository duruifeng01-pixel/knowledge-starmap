import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { taskAPI, knowledgeAPI } from '../api/client'
import './Content.css'

export default function Content() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [framework, setFramework] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMindmap, setShowMindmap] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskRes, frameworkRes] = await Promise.all([
          taskAPI.getOne(taskId),
          knowledgeAPI.getFramework()
        ])
        setTask(taskRes.data)
        setFramework(frameworkRes.data)
      } catch (err) {
        console.error('加载失败:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [taskId])

  const handleStartDiscussion = () => {
    navigate(`/discussion/${taskId}`)
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载内容中...</p>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <h3>内容不存在</h3>
        <button className="btn btn-primary" onClick={() => navigate('/home')}>
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="content-page fade-in">
      <button className="back-btn" onClick={() => navigate('/home')}>
        ← 返回
      </button>

      <article className="content-article glass-card">
        <header className="content-header">
          <span className="content-source">{task.content_source || '自定义内容'}</span>
          <h1>{task.title}</h1>
        </header>

        {task.content_markdown ? (
          <div className="content-body">
            <ReactMarkdown>{task.content_markdown}</ReactMarkdown>
          </div>
        ) : (
          <div className="content-placeholder">
            <p>暂无详细内容</p>
          </div>
        )}
      </article>

      <div className="content-actions">
        <button
          className="btn btn-secondary mindmap-btn"
          onClick={() => setShowMindmap(!showMindmap)}
        >
          {showMindmap ? '收起' : '查看'} 知识图谱
        </button>

        {task.status !== 'completed' && (
          <button className="btn btn-cta" onClick={handleStartDiscussion}>
            开始讨论
          </button>
        )}
      </div>

      {showMindmap && framework && (
        <div className="mindmap-preview glass-card">
          <h3>📍 知识图谱预览</h3>
          <div className="mindmap-nodes">
            {framework.nodes?.map(node => (
              <div key={node.id} className={`mindmap-node ${node.status}`}>
                {node.label}
              </div>
            ))}
          </div>
          {framework.nodes?.length > 0 && (
            <button
              className="btn btn-primary full-mindmap-btn"
              onClick={() => navigate('/mindmap')}
            >
              在星图中查看完整图谱 →
            </button>
          )}
        </div>
      )}

      {showMindmap && !framework && (
        <div className="mindmap-preview glass-card">
          <h3>📍 知识图谱</h3>
          <p className="text-muted">暂无知识图谱数据</p>
        </div>
      )}
    </div>
  )
}
