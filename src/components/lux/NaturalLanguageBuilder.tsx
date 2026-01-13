import React, { useState } from 'react';

export default function NaturalLanguageBuilder() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerateWorkflow = () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);

    // Simulate a brief loading state
    setTimeout(() => {
      setIsGenerating(false);
      setShowToast(true);

      // Hide toast after 4 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateWorkflow();
    }
  };

  const examplePrompts = [
    'When a new lead comes in, check if their score is above 80. If yes, send a welcome email and assign to sales. If no, add to nurture campaign.',
    'Every Monday at 9am, generate a report of last week\'s sales and email it to the team.',
    'When a support ticket is created, notify the support channel and create a task for the on-call engineer.',
  ];

  return (
    <>
      {/* Natural Language Input Bar */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: '#0f0f1a',
          borderBottom: '1px solid #1e1e2e',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              flex: 1,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
              }}
            >
              ✨
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your workflow in natural language... e.g., 'When a new lead arrives, send a welcome email'"
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                fontSize: '14px',
                backgroundColor: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2a2a3e';
              }}
            />
          </div>
          <button
            onClick={handleGenerateWorkflow}
            disabled={isGenerating || !prompt.trim()}
            style={{
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              background: isGenerating
                ? '#4b5563'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: !prompt.trim() ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {isGenerating ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #fff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Generating...
              </>
            ) : (
              <>
                <span>🤖</span>
                Generate Workflow
              </>
            )}
          </button>
        </div>

        {/* Example prompts */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            flexWrap: 'wrap',
            maxWidth: '1200px',
            margin: '12px auto 0',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b' }}>Try:</span>
          {examplePrompts.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(example)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '20px',
                color: '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a3e';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              {example.slice(0, 60)}...
            </button>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            backgroundColor: '#1a1a2e',
            border: '1px solid #6366f1',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            🚀
          </div>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '4px',
              }}
            >
              AI Workflow Generation Coming Soon!
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              We're working on AI-powered workflow creation. Stay tuned!
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
              marginLeft: '8px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
