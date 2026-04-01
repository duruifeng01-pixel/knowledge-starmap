import { useState } from 'react'
import { authAPI } from '../api/client'
import './Onboarding.css'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    industry: '',
    goals: '',
    domains: ''
  })

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // 生成访客 openid
      const openid = `guest_${Date.now()}`

      // 构建用户资料
      const profile = {
        industry: formData.industry,
        goals: formData.goals,
        domains: formData.domains.split(',').map(d => d.trim()).filter(Boolean),
        level: 'beginner'
      }

      const response = await authAPI.register({
        openid,
        username: formData.industry || '新用户',
        profile
      })

      const { user, token } = response.data

      // 存储认证信息
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      onComplete(user)
    } catch (err) {
      console.error('注册失败:', err)
      setError('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-container glass-card-strong fade-in">
        <div className="onboarding-header">
          <div className="onboarding-logo">✨</div>
          <h1>欢迎使用知识星图</h1>
          <p>让我们先了解一下你</p>
        </div>

        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <div className="onboarding-step slide-in">
            <h2>你是做什么行业的？</h2>
            <p className="step-hint">这帮助我们为你定制知识框架</p>
            <input
              type="text"
              className="form-input"
              placeholder="例如：互联网产品经理"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step slide-in">
            <h2>你的学习目标是什么？</h2>
            <p className="step-hint">你想要提升哪方面的能力？</p>
            <textarea
              className="form-input"
              placeholder="例如：建立系统的知识管理体系，提升结构化思维能力"
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step slide-in">
            <h2>想深耕哪些领域？</h2>
            <p className="step-hint">用逗号分隔多个领域</p>
            <input
              type="text"
              className="form-input"
              placeholder="例如：人工智能、产品设计、商业分析"
              value={formData.domains}
              onChange={(e) => setFormData({ ...formData, domains: e.target.value })}
              autoFocus
            />
          </div>
        )}

        <div className="onboarding-actions">
          {step > 1 && (
            <button
              className="btn btn-secondary"
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              上一步
            </button>
          )}

          {step < 3 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep(step + 1)}
            >
              下一步
            </button>
          ) : (
            <button
              className="btn btn-cta"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '进入中...' : '开始探索'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
