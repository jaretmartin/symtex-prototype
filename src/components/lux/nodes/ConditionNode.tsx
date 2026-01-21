import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ConditionNodeData {
  label: string;
  description?: string;
  icon?: string;
}

const ConditionNode = memo(({ data, selected }: NodeProps<ConditionNodeData>) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--color-surface-card) 0%, #16162a 100%)',
        border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-surface-elevated)',
        minWidth: '180px',
        boxShadow: selected
          ? '0 0 20px rgba(139, 92, 246, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'var(--color-accent)',
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
            background: 'linear-gradient(135deg, var(--color-accent), #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          🔀
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
              color: 'var(--color-accent)',
              fontWeight: 500,
            }}
          >
            CONDITION
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
      {/* Two output handles for true/false branches */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          fontSize: '10px',
          color: 'var(--color-text-muted)',
        }}
      >
        <span style={{ color: 'var(--color-error)' }}>No</span>
        <span style={{ color: 'var(--color-success)' }}>Yes</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{
          background: 'var(--color-error)',
          width: '10px',
          height: '10px',
          border: '2px solid var(--color-surface-base)',
          left: '25%',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{
          background: 'var(--color-success)',
          width: '10px',
          height: '10px',
          border: '2px solid var(--color-surface-base)',
          left: '75%',
        }}
      />
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
