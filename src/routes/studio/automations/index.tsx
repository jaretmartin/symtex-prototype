import { useState } from 'react';

interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggerType: string;
  lastRun?: string;
  runs: number;
  createdAt: string;
  updatedAt: string;
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popularity: 'popular' | 'new' | 'recommended';
}

// Mock saved automations
const mockAutomations: Automation[] = [
  {
    id: 'auto-1',
    name: 'Lead Qualification Flow',
    description: 'Automatically scores and routes new leads based on criteria',
    status: 'active',
    triggerType: 'New Lead',
    lastRun: '2 hours ago',
    runs: 1247,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: 'auto-2',
    name: 'Welcome Email Sequence',
    description: 'Sends personalized welcome emails to new customers',
    status: 'active',
    triggerType: 'New Customer',
    lastRun: '30 minutes ago',
    runs: 3892,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
  },
  {
    id: 'auto-3',
    name: 'Weekly Sales Report',
    description: 'Generates and emails weekly sales performance report',
    status: 'active',
    triggerType: 'Schedule',
    lastRun: '3 days ago',
    runs: 52,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20',
  },
  {
    id: 'auto-4',
    name: 'Support Ticket Escalation',
    description: 'Escalates high-priority tickets to senior support',
    status: 'paused',
    triggerType: 'Ticket Created',
    lastRun: '1 week ago',
    runs: 156,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
  },
  {
    id: 'auto-5',
    name: 'Cart Abandonment Follow-up',
    description: 'Sends reminder emails for abandoned shopping carts',
    status: 'draft',
    triggerType: 'Cart Abandoned',
    runs: 0,
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19',
  },
];

// Automation templates
const automationTemplates: AutomationTemplate[] = [
  {
    id: 'template-1',
    name: 'Lead Nurture Campaign',
    description: 'Multi-step email sequence to nurture cold leads',
    category: 'Marketing',
    icon: '📧',
    popularity: 'popular',
  },
  {
    id: 'template-2',
    name: 'Customer Onboarding',
    description: 'Guide new customers through product setup',
    category: 'Customer Success',
    icon: '🎯',
    popularity: 'recommended',
  },
  {
    id: 'template-3',
    name: 'Invoice Follow-up',
    description: 'Automated payment reminders for overdue invoices',
    category: 'Finance',
    icon: '💰',
    popularity: 'popular',
  },
  {
    id: 'template-4',
    name: 'Feedback Collection',
    description: 'Request feedback after purchase or interaction',
    category: 'Customer Success',
    icon: '⭐',
    popularity: 'new',
  },
  {
    id: 'template-5',
    name: 'Team Notifications',
    description: 'Notify team members about important events',
    category: 'Operations',
    icon: '🔔',
    popularity: 'popular',
  },
  {
    id: 'template-6',
    name: 'Data Sync Workflow',
    description: 'Keep data synchronized across multiple systems',
    category: 'Operations',
    icon: '🔄',
    popularity: 'new',
  },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [activeTab, setActiveTab] = useState<'my-automations' | 'templates'>('my-automations');
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAutomations = automations.filter((auto) => {
    const matchesFilter = filter === 'all' || auto.status === filter;
    const matchesSearch =
      auto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auto.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: Automation['status']) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'paused':
        return '#f59e0b';
      case 'draft':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const getPopularityBadge = (popularity: AutomationTemplate['popularity']) => {
    switch (popularity) {
      case 'popular':
        return { text: 'Popular', color: '#f59e0b', bg: '#f59e0b20' };
      case 'new':
        return { text: 'New', color: '#22c55e', bg: '#22c55e20' };
      case 'recommended':
        return { text: 'Recommended', color: '#6366f1', bg: '#6366f120' };
      default:
        return null;
    }
  };

  const handleToggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id
          ? {
              ...auto,
              status: auto.status === 'active' ? 'paused' : 'active',
            }
          : auto
      )
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        color: '#fff',
        padding: '32px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Automations
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Manage your automated workflows and discover new templates
          </p>
        </div>
        <a
          href="/studio/lux"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>+</span>
          Create New Automation
        </a>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {[
          { label: 'Total Automations', value: automations.length, icon: '⚡' },
          { label: 'Active', value: automations.filter((a) => a.status === 'active').length, icon: '✅' },
          { label: 'Total Runs', value: automations.reduce((sum, a) => sum + a.runs, 0).toLocaleString(), icon: '🔄' },
          { label: 'Time Saved', value: '~48 hrs', icon: '⏱️' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '20px',
              backgroundColor: '#0f0f1a',
              borderRadius: '12px',
              border: '1px solid #1e1e2e',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{stat.icon}</span>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          backgroundColor: '#0f0f1a',
          padding: '4px',
          borderRadius: '10px',
          width: 'fit-content',
        }}
      >
        {[
          { id: 'my-automations', label: 'My Automations' },
          { id: 'templates', label: 'Templates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#1e1e2e' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'my-automations' && (
        <>
          {/* Filters and Search */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Search automations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                width: '300px',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'active', 'paused', 'draft'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: filter === f ? '#6366f1' : '#2a2a3e',
                    backgroundColor: filter === f ? '#6366f120' : 'transparent',
                    color: filter === f ? '#6366f1' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textTransform: 'capitalize',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Automations List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAutomations.map((automation) => (
              <div
                key={automation.id}
                style={{
                  padding: '20px',
                  backgroundColor: '#0f0f1a',
                  borderRadius: '12px',
                  border: '1px solid #1e1e2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: `linear-gradient(135deg, ${getStatusColor(automation.status)}40, ${getStatusColor(automation.status)}20)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                        {automation.name}
                      </h3>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 500,
                          backgroundColor: `${getStatusColor(automation.status)}20`,
                          color: getStatusColor(automation.status),
                          textTransform: 'capitalize',
                        }}
                      >
                        {automation.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                      {automation.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#4b5563',
                      }}
                    >
                      <span>Trigger: {automation.triggerType}</span>
                      <span>Runs: {automation.runs.toLocaleString()}</span>
                      {automation.lastRun && <span>Last run: {automation.lastRun}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`/studio/lux?id=${automation.id}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #6366f1',
                      backgroundColor: 'transparent',
                      color: '#6366f1',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    Open in LUX
                  </a>
                  <button
                    onClick={() => handleToggleStatus(automation.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #2a2a3e',
                      backgroundColor: '#1a1a2e',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {automation.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}

            {filteredAutomations.length === 0 && (
              <div
                style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p>No automations found matching your criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
            Start with a pre-built template to create automations faster
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {automationTemplates.map((template) => {
              const badge = getPopularityBadge(template.popularity);
              return (
                <div
                  key={template.id}
                  style={{
                    padding: '24px',
                    backgroundColor: '#0f0f1a',
                    borderRadius: '12px',
                    border: '1px solid #1e1e2e',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1e1e2e';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        backgroundColor: '#1a1a2e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      {template.icon}
                    </div>
                    {badge && (
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '10px',
                          fontWeight: 600,
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.text}
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '8px',
                    }}
                  >
                    {template.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      marginBottom: '16px',
                      lineHeight: 1.5,
                    }}
                  >
                    {template.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#4b5563',
                        backgroundColor: '#1a1a2e',
                        padding: '4px 10px',
                        borderRadius: '4px',
                      }}
                    >
                      {template.category}
                    </span>
                    <a
                      href={`/studio/lux?template=${template.id}`}
                      style={{
                        fontSize: '13px',
                        color: '#6366f1',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Use Template →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
