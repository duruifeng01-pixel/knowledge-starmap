import { useState, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { knowledgeAPI } from '../api/client'
import './MindMap.css'

// 自定义节点组件
function KnowledgeNode({ data }) {
  const statusColors = {
    mastered: '#22C55E',
    'in-progress': '#8B5CF6',
    'not-started': '#9CA3AF'
  }

  return (
    <div
      className="knowledge-node"
      style={{
        background: `linear-gradient(135deg, ${statusColors[data.status] || statusColors['not-started']}, ${statusColors[data.status] || statusColors['not-started']}CC)`,
        boxShadow: `0 4px 20px ${statusColors[data.status] || statusColors['not-started']}40`
      }}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <span className="node-label">{data.label}</span>
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  )
}

const nodeTypes = {
  knowledge: KnowledgeNode
}

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, mastered: 0, inProgress: 0 })

  useEffect(() => {
    const loadFramework = async () => {
      try {
        const response = await knowledgeAPI.getFramework()
        const framework = response.data

        if (framework && framework.nodes && framework.nodes.length > 0) {
          // 转换节点
          const flowNodes = framework.nodes.map((node, index) => ({
            id: node.id,
            type: 'knowledge',
            data: {
              label: node.label,
              status: node.status || 'not-started'
            },
            position: getNodePosition(index, framework.nodes.length)
          }))

          // 转换边
          const flowEdges = framework.edges.map((edge, index) => ({
            id: `edge-${index}`,
            source: edge.from,
            target: edge.to,
            type: 'smoothstep',
            style: { stroke: '#94A3B8', strokeWidth: 2 },
            animated: true
          }))

          setNodes(flowNodes)
          setEdges(flowEdges)

          // 计算统计
          const mastered = framework.nodes.filter(n => n.status === 'mastered').length
          const inProgress = framework.nodes.filter(n => n.status === 'in-progress').length
          setStats({
            total: framework.nodes.length,
            mastered,
            inProgress
          })
        }
      } catch (err) {
        console.error('加载知识图谱失败:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFramework()
  }, [setNodes, setEdges])

  // 计算节点位置（放射状布局）
  const getNodePosition = (index, total) => {
    const centerX = 400
    const centerY = 300
    const radius = Math.min(250, total * 30)

    if (index === 0) {
      return { x: centerX, y: centerY }
    }

    const angle = ((index - 1) / (total - 1)) * 2 * Math.PI - Math.PI / 2
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载知识星图中...</p>
      </div>
    )
  }

  return (
    <div className="mindmap-page fade-in">
      <div className="mindmap-header glass-card">
        <div className="mindmap-title">
          <h2>✨ 我的知识星图</h2>
          <p>你的个人知识网络</p>
        </div>
        <div className="mindmap-stats">
          <div className="stat-item mastered">
            <span className="stat-num">{stats.mastered}</span>
            <span className="stat-label">已掌握</span>
          </div>
          <div className="stat-item in-progress">
            <span className="stat-num">{stats.inProgress}</span>
            <span className="stat-label">学习中</span>
          </div>
          <div className="stat-item total">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-label">总节点</span>
          </div>
        </div>
      </div>

      <div className="mindmap-container glass-card">
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const statusColors = {
                  mastered: '#22C55E',
                  'in-progress': '#8B5CF6',
                  'not-started': '#9CA3AF'
                }
                return statusColors[node.data?.status] || '#9CA3AF'
              }}
            />
            <Background color="#E5E7EB" gap={20} />
          </ReactFlow>
        ) : (
          <div className="empty-mindmap">
            <div className="empty-icon">🌟</div>
            <h3>还没有知识图谱</h3>
            <p>开始学习后，你的知识将以星图形式呈现</p>
          </div>
        )}
      </div>

      <div className="mindmap-legend glass-card">
        <div className="legend-item">
          <span className="legend-dot mastered"></span>
          <span>已掌握</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot in-progress"></span>
          <span>学习中</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot not-started"></span>
          <span>未开始</span>
        </div>
      </div>
    </div>
  )
}
