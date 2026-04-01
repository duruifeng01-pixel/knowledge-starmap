import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskAPI } from '../api/client'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTaskUrl, setNewTaskUrl] = useState('')
  const [adding, setAdding] = useState(false)

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getAll()
      setTasks(response.data)
    } catch (err) {
      console.error('加载任务失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleAddTask = async () => {
    if (!newTaskUrl.trim()) return

    setAdding(true)
    try {
      const response = await taskAPI.create({
        title: '正在获取内容...',
        contentSource: newTaskUrl,
        contentMarkdown: ''
      })
      setTasks([response.data, ...tasks])
      setShowAddModal(false)
      setNewTaskUrl('')
      // 跳转到内容页面
      navigate(`/content/${response.data.id}`)
    } catch (err) {
      console.error('添加任务失败:', err)
    } finally {
      setAdding(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '早上好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  const getSourceIcon = (sourceType) => {
    switch (sourceType) {
      case '公众号': return '📖'
      case 'B站': return '🎬'
      case '小红书': return '📕'
      default: return '🔗'
    }
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="home fade-in">
      <div className="home-header glass-card">
        <div className="greeting">
          <h2>{getGreeting()} 👋</h2>
          <p>今天有哪些内容要学习？</p>
        </div>
        <button className="btn btn-cta" onClick={() => setShowAddModal(true)}>
          <span>+</span> 添加学习内容
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>加载任务中...</p>
        </div>
      ) : (
        <>
          {pendingTasks.length > 0 && (
            <section className="task-section">
              <h3 className="section-title">待学习 ({pendingTasks.length})</h3>
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="task-card glass-card"
                  onClick={() => navigate(`/content/${task.id}`)}
                >
                  <div className="task-icon">
                    {getSourceIcon(task.sourceType)}
                  </div>
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      {task.sourceType} · 约{task.estimatedMinutes || 10}分钟
                    </div>
                  </div>
                  <span className="task-status pending">{task.statusText}</span>
                </div>
              ))}
            </section>
          )}

          {completedTasks.length > 0 && (
            <section className="task-section">
              <h3 className="section-title">已完成 ({completedTasks.length})</h3>
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="task-card glass-card completed"
                  onClick={() => navigate(`/content/${task.id}`)}
                >
                  <div className="task-icon completed">
                    ✓
                  </div>
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">{task.sourceType}</div>
                  </div>
                  <span className="task-status completed">{task.statusText}</span>
                </div>
              ))}
            </section>
          )}

          {tasks.length === 0 && (
            <div className="empty-state glass-card">
              <div className="empty-icon">📚</div>
              <h3>还没有学习任务</h3>
              <p>点击上方按钮，添加你的第一个学习内容</p>
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal glass-card-strong" onClick={e => e.stopPropagation()}>
            <h3>添加学习内容</h3>
            <p className="modal-hint">粘贴链接，我们将为你获取内容并生成知识图谱</p>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={newTaskUrl}
              onChange={(e) => setNewTaskUrl(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                取消
              </button>
              <button className="btn btn-cta" onClick={handleAddTask} disabled={adding || !newTaskUrl.trim()}>
                {adding ? '添加中...' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
