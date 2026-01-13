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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)',
        border: selected ? '2px solid #64748b' : '1px solid #2a2a3e',
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
          background: '#64748b',
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
            background: 'linear-gradient(135deg, #64748b, #475569)',
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
              color: '#64748b',
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
            color: '#94a3b8',
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
            color: '#f59e0b',
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
          background: '#64748b',
          width: '12px',
          height: '12px',
          border: '2px solid #0a0a0f',
        }}
      />
    </div>
  );
});

DelayNode.displayName = 'DelayNode';

export default DelayNode;
