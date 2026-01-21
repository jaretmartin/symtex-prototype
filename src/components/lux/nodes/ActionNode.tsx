import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ActionNodeData {
  label: string;
  description?: string;
  icon?: string;
}

const ActionNode = memo(({ data, selected }: NodeProps<ActionNodeData>) => {
  const getIconEmoji = (icon?: string) => {
    const iconMap: Record<string, string> = {
      mail: '📧',
      user: '👤',
      play: '▶️',
      send: '📤',
      database: '🗄️',
      api: '🔌',
      notification: '🔔',
    };
    return iconMap[icon || ''] || '⚡';
  };

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--color-surface-card) 0%, #16162a 100%)',
        border: selected ? '2px solid var(--color-primary)' : '1px solid var(--color-surface-elevated)',
        minWidth: '180px',
        boxShadow: selected
          ? '0 0 20px rgba(99, 102, 241, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'var(--color-primary)',
          width: '12px',
          height: '12px',
          border: '2px solid var(--color-surface-base)',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary), #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          {getIconEmoji(data.icon)}
        </div>
        <div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {data.label}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--color-primary)',
              fontWeight: 500,
            }}
          >
            ACTION
          </div>
        </div>
      </div>
      {data.description && (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            marginTop: '4px',
          }}
        >
          {data.description}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'var(--color-primary)',
          width: '12px',
          height: '12px',
          border: '2px solid var(--color-surface-base)',
        }}
      />
    </div>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
