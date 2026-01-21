import { DragEvent } from 'react';

interface NodePaletteProps {
  onAddNode?: (nodeType: string, position: { x: number; y: number }) => void;
}

interface PaletteNode {
  type: string;
  label: string;
  description: string;
  icon: string;
  emoji: string;
  color: string;
}

const nodeCategories: { title: string; nodes: PaletteNode[] }[] = [
  {
    title: 'Triggers',
    nodes: [
      {
        type: 'trigger',
        label: 'New Lead',
        description: 'When a new lead arrives',
        icon: 'zap',
        emoji: '⚡',
        color: '#f59e0b',
      },
      {
        type: 'trigger',
        label: 'Form Submitted',
        description: 'When a form is submitted',
        icon: 'file-text',
        emoji: '📝',
        color: '#f59e0b',
      },
      {
        type: 'trigger',
        label: 'Schedule',
        description: 'Run on a schedule',
        icon: 'calendar',
        emoji: '📅',
        color: '#f59e0b',
      },
      {
        type: 'trigger',
        label: 'Webhook',
        description: 'HTTP webhook trigger',
        icon: 'link',
        emoji: '🔗',
        color: '#f59e0b',
      },
    ],
  },
  {
    title: 'Logic',
    nodes: [
      {
        type: 'condition',
        label: 'If/Then',
        description: 'Branch based on condition',
        icon: 'git-branch',
        emoji: '🔀',
        color: 'var(--color-accent)',
      },
      {
        type: 'condition',
        label: 'Filter',
        description: 'Filter items by criteria',
        icon: 'filter',
        emoji: '🔍',
        color: 'var(--color-accent)',
      },
      {
        type: 'delay',
        label: 'Wait',
        description: 'Pause execution',
        icon: 'clock',
        emoji: '⏱️',
        color: 'var(--color-text-muted)',
      },
    ],
  },
  {
    title: 'Actions',
    nodes: [
      {
        type: 'action',
        label: 'Send Email',
        description: 'Send an email message',
        icon: 'mail',
        emoji: '📧',
        color: '#6366f1',
      },
      {
        type: 'action',
        label: 'Send SMS',
        description: 'Send text message',
        icon: 'message-square',
        emoji: '💬',
        color: '#6366f1',
      },
      {
        type: 'action',
        label: 'Update Record',
        description: 'Update database record',
        icon: 'database',
        emoji: '🗄️',
        color: '#6366f1',
      },
      {
        type: 'action',
        label: 'Create Action',
        description: 'Create a new Action',
        icon: 'check-square',
        emoji: '✅',
        color: '#6366f1',
      },
      {
        type: 'action',
        label: 'Notify Team',
        description: 'Send team notification',
        icon: 'bell',
        emoji: '🔔',
        color: '#6366f1',
      },
      {
        type: 'action',
        label: 'Call API',
        description: 'Make HTTP request',
        icon: 'globe',
        emoji: '🌐',
        color: '#6366f1',
      },
    ],
  },
];

export default function NodePalette(_props: NodePaletteProps) {
  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    node: PaletteNode
  ) => {
    // Set the data that will be read when dropped
    event.dataTransfer.setData('application/lux-node-type', node.type);
    event.dataTransfer.setData(
      'application/lux-node-data',
      JSON.stringify({
        label: node.label,
        description: node.description,
        icon: node.icon,
      })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        width: '280px',
        backgroundColor: '#0f0f1a',
        borderRight: '1px solid #1e1e2e',
        overflowY: 'auto',
        padding: '16px',
      }}
    >
      <h2
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px',
        }}
      >
        Node Palette
      </h2>
      <p
        style={{
          fontSize: '12px',
          color: '#94a3b8',
          marginBottom: '20px',
        }}
      >
        Drag nodes to the canvas to build your Automation
      </p>

      {nodeCategories.map((category) => (
        <div key={category.title} style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
            }}
          >
            {category.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {category.nodes.map((node, idx) => (
              <div
                key={`${node.type}-${idx}`}
                draggable
                onDragStart={(e) => onDragStart(e, node)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  backgroundColor: '#1a1a2e',
                  borderRadius: '8px',
                  border: '1px solid #2a2a3e',
                  cursor: 'grab',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#252540';
                  e.currentTarget.style.borderColor = node.color;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a1a2e';
                  e.currentTarget.style.borderColor = '#2a2a3e';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: `${node.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0,
                  }}
                >
                  {node.emoji}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {node.label}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {node.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
