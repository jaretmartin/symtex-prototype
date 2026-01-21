import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface DelayNodeData {
  label: string;
  description?: string;
  duration?: string;
}

const DelayNode = memo(({ data, selected }: NodeProps<DelayNodeData>) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--color-surface-card) 0%, #16162a 100%)',
        border: selected ? '2px solid var(--color-text-muted)' : '1px solid var(--color-surface-elevated)',
        minWidth: '160px',
        boxShadow: selected
          ? '0 0 20px rgba(100, 116, 139, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'var(--color-text-muted)',
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
            background: 'linear-gradient(135deg, var(--color-text-muted), #475569)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          ⏱️
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
              color: 'var(--color-text-muted)',
              fontWeight: 500,
            }}
          >
            DELAY
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
      {data.duration && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--color-gold)',
            marginTop: '8px',
            fontWeight: 500,
          }}
        >
          {data.duration}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'var(--color-text-muted)',
          width: '12px',
          height: '12px',
          border: '2px solid var(--color-surface-base)',
        }}
      />
    </div>
  );
});

DelayNode.displayName = 'DelayNode';

export default DelayNode;
