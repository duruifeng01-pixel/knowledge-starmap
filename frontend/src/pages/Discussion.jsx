import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { taskAPI, discussionAPI } from '../api/client'
import './Discussion.css'

const QUESTIONS = [
  {
    step: 1,
    question: '用自己的话解释这篇文章的核心观点是什么？',
    hint: '试着用简单的语言描述你理解的主要思想'
  },
  {
    step: 2,
    question: '这篇文章和你已知的哪个知识点相关联？',
    hint: '思考它是否可以和你学过的其他内容联系起来'
  },
  {
    step: 3,
    question: '你认为作者论证这个观点的逻辑是什么？',
    hint: '作者用了哪些例子或证据来支持观点？'
  },
  {
    step: 4,
    question: '你同意还是不同意这个观点？为什么？',
    hint: '诚实地表达你的看法，不需要完全同意作者'
  },
  {
    step: 5,
    question: '读完这篇文章后，你想深入了解什么？',
    hint: '什么引起了你的好奇心？'
  }
]

export default function Discussion() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  const totalSteps = QUESTIONS.length
  const currentQuestion = QUESTIONS[currentStep - 1]
  const progress = (currentStep / totalSteps) * 100

  const handleSubmit = async () => {
    if (!answer.trim()) return

    setSubmitting(true)
    try {
      await discussionAPI.submitAnswer(taskId, currentStep, answer)

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
        setAnswer('')
      } else {
        // 完成所有问题，更新任务状态
        await taskAPI.updateStatus(taskId, 'completed')
        setCompleted(true)
      }
    } catch (err) {
      console.error('提交失败:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (completed) {
    return (
      <div className="discussion-complete glass-card-strong fade-in">
        <div className="complete-icon">🎉</div>
        <h2>太棒了！</h2>
        <p>你已经完成了这篇内容的深度思考</p>
        <div className="complete-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/home')}>
            返回首页
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/mindmap')}>
            查看我的知识星图
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="discussion-page fade-in">
      <button className="back-btn" onClick={() => navigate(`/content/${taskId}`)}>
        ← 返回内容
      </button>

      <div className="discussion-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="step-text">步骤 {currentStep} / {totalSteps}</p>
      </div>

      <div className="question-card glass-card-strong">
        <h2>{currentQuestion.question}</h2>
        <p className="question-hint">{currentQuestion.hint}</p>

        <textarea
          className="form-input answer-input"
          placeholder="在这里写下你的思考..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
        />

        <button
          className="btn btn-cta submit-btn"
          onClick={handleSubmit}
          disabled={submitting || !answer.trim()}
        >
          {submitting ? '提交中...' : '提交'}
        </button>
      </div>

      <div className="step-dots">
        {QUESTIONS.map(q => (
          <div
            key={q.step}
            className={`step-dot ${q.step === currentStep ? 'active' : ''} ${q.step < currentStep ? 'done' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
