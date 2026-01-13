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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)',
        border: selected ? '2px solid #8b5cf6' : '1px solid #2a2a3e',
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
          background: '#8b5cf6',
          width: '12px',
          height: '12px',
          border: '2px solid #0a0a0f',
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
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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
              color: '#8b5cf6',
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
            color: '#94a3b8',
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
          color: '#64748b',
        }}
      >
        <span style={{ color: '#ef4444' }}>No</span>
        <span style={{ color: '#22c55e' }}>Yes</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{
          background: '#ef4444',
          width: '10px',
          height: '10px',
          border: '2px solid #0a0a0f',
          left: '25%',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{
          background: '#22c55e',
          width: '10px',
          height: '10px',
          border: '2px solid #0a0a0f',
          left: '75%',
        }}
      />
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
