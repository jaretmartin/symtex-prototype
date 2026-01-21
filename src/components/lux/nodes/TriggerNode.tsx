import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface TriggerNodeData {
  label: string;
  description?: string;
  icon?: string;
}

const TriggerNode = memo(({ data, selected }: NodeProps<TriggerNodeData>) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--color-surface-card) 0%, #16162a 100%)',
        border: selected ? '2px solid var(--color-gold)' : '1px solid var(--color-surface-elevated)',
        minWidth: '180px',
        boxShadow: selected
          ? '0 0 20px rgba(245, 158, 11, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
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
            background: 'linear-gradient(135deg, var(--color-gold), #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          ⚡
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
              color: 'var(--color-gold)',
              fontWeight: 500,
            }}
          >
            TRIGGER
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
          background: 'var(--color-gold)',
          width: '12px',
          height: '12px',
          border: '2px solid var(--color-surface-base)',
        }}
      />
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';

export default TriggerNode;
