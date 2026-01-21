/**
 * Collaboration Store
 *
 * Zustand store for managing collaboration features including:
 * - Pending approvals
 * - Upcoming events
 * - Cognate statuses
 * - Inbox messages
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// =============================================================================
// Types
// =============================================================================

export type ApprovalType = 'email' | 'document' | 'action' | 'purchase' | 'meeting';
export type ApprovalPriority = 'low' | 'medium' | 'high' | 'critical';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'modified';

export interface ApprovalPreview {
  type: 'email' | 'document' | 'text';
  to?: string;
  subject?: string;
  content: string;
  attachments?: string[];
}

export interface PendingApproval {
  id: string;
  type: ApprovalType;
  title: string;
  description: string;
  cognateId: string;
  cognateName: string;
  cognateAvatar?: string;
  policyReason: string;
  policyId?: string;
  policyTriggers?: string[];
  riskLevel: ApprovalPriority;
  preview: ApprovalPreview;
  status: ApprovalStatus;
  requestedAt: string;
  expiresAt?: string;
  runId?: string;
  rerunCount?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number; // minutes
  participants: string[];
  type: 'meeting' | 'call' | 'review' | 'deadline';
  location?: string;
  meetingUrl?: string;
  cognateAssigned?: string;
}

export type CognateStatus = 'working' | 'idle' | 'training' | 'waiting' | 'error';
export type CognateHealth = 'healthy' | 'warning' | 'critical';

export interface CognateStatusItem {
  id: string;
  name: string;
  avatar?: string;
  status: CognateStatus;
  health: CognateHealth;
  currentAction?: string;
  progress?: number;
  lastActivity: string;
}

export type InboxItemType = 'approval' | 'notification' | 'message' | 'alert';
export type InboxPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface InboxItem {
  id: string;
  type: InboxItemType;
  title: string;
  preview: string;
  cognateId?: string;
  cognateName?: string;
  priority: InboxPriority;
  read: boolean;
  timestamp: string;
  actionRequired?: boolean;
  relatedApprovalId?: string;
}

// =============================================================================
// Mock Data
// =============================================================================

export const mockPendingApprovals: PendingApproval[] = [
  // WF5 Demo: Policy-blocked run awaiting approval
  {
    id: 'approval-wf5-demo',
    type: 'action',
    title: 'Data Export to External System',
    description: 'Automated export of customer records to Salesforce integration',
    cognateId: 'cognate-ops',
    cognateName: 'OpsBot',
    cognateAvatar: undefined,
    policyReason: 'External data transfers require approval for PII compliance',
    policyId: 'policy-data-export-001',
    policyTriggers: ['Contains PII fields', 'External destination', 'Over 1000 records'],
    riskLevel: 'critical',
    preview: {
      type: 'text',
      content: 'Export Details:\n- Records: 2,450 customer records\n- Fields: name, email, company, purchase_history\n- Destination: Salesforce CRM\n- Scheduled: Immediate execution\n\nThis export was blocked because it contains personally identifiable information (PII) and targets an external system.',
    },
    status: 'pending',
    requestedAt: '2026-01-21T10:15:00Z',
    expiresAt: '2026-01-21T18:00:00Z',
    runId: 'run-export-001',
    rerunCount: 0,
  },
  {
    id: 'approval-1',
    type: 'email',
    title: 'Send Email to VIP Client',
    description: 'Follow-up email to John Chen regarding Q4 proposal discussion',
    cognateId: 'cognate-aria',
    cognateName: 'Aria',
    cognateAvatar: undefined,
    policyReason: 'VIP communications require human approval',
    policyId: 'policy-vip-comms-001',
    policyTriggers: ['VIP recipient detected', 'External communication'],
    riskLevel: 'high',
    preview: {
      type: 'email',
      to: 'john.chen@acme.com',
      subject: 'Follow-up on Q4 Proposal Discussion',
      content: 'Dear John,\n\nThank you for taking the time to discuss our Q4 proposal yesterday. I wanted to follow up on the key points we covered...\n\nBest regards,\nAria (on behalf of your team)',
    },
    status: 'pending',
    requestedAt: '2026-01-21T09:30:00Z',
    expiresAt: '2026-01-21T17:00:00Z',
    runId: 'run-email-001',
    rerunCount: 0,
  },
  {
    id: 'approval-2',
    type: 'document',
    title: 'Quarterly Report Summary',
    description: 'Executive summary document for Q4 2025 performance review',
    cognateId: 'cognate-max',
    cognateName: 'Max',
    cognateAvatar: undefined,
    policyReason: 'External-facing documents require review',
    riskLevel: 'medium',
    preview: {
      type: 'document',
      subject: 'Q4 2025 Executive Summary',
      content: '## Q4 2025 Performance Highlights\n\n- Revenue: $2.4M (+18% YoY)\n- Customer Acquisition: 47 new accounts\n- Retention Rate: 94.2%\n\n### Key Achievements...',
    },
    status: 'pending',
    requestedAt: '2026-01-21T08:15:00Z',
  },
  {
    id: 'approval-3',
    type: 'purchase',
    title: 'Software License Renewal',
    description: 'Annual renewal for Figma Enterprise license',
    cognateId: 'cognate-ops',
    cognateName: 'OpsBot',
    cognateAvatar: undefined,
    policyReason: 'Purchases over $500 require approval',
    riskLevel: 'medium',
    preview: {
      type: 'text',
      content: 'Vendor: Figma Inc.\nProduct: Figma Enterprise (50 seats)\nAmount: $7,500/year\nRenewal Date: January 25, 2026\n\nThis renewal maintains current team access to collaborative design tools.',
    },
    status: 'pending',
    requestedAt: '2026-01-20T16:45:00Z',
    expiresAt: '2026-01-25T00:00:00Z',
  },
  {
    id: 'approval-4',
    type: 'action',
    title: 'Schedule Client Demo',
    description: 'Book conference room and send invites for product demo',
    cognateId: 'cognate-aria',
    cognateName: 'Aria',
    cognateAvatar: undefined,
    policyReason: 'External meeting scheduling requires confirmation',
    riskLevel: 'low',
    preview: {
      type: 'text',
      content: 'Meeting: Product Demo with Acme Corp\nDate: January 24, 2026\nTime: 2:00 PM - 3:30 PM\nRoom: Conference Room A\nAttendees: 5 external, 3 internal',
    },
    status: 'pending',
    requestedAt: '2026-01-21T10:00:00Z',
  },
  {
    id: 'approval-5',
    type: 'email',
    title: 'Newsletter Campaign',
    description: 'Monthly product update newsletter to subscriber list',
    cognateId: 'cognate-luna',
    cognateName: 'Luna',
    cognateAvatar: undefined,
    policyReason: 'Mass communications require approval',
    riskLevel: 'high',
    preview: {
      type: 'email',
      to: '2,450 subscribers',
      subject: 'January Product Updates & What\'s Coming',
      content: 'Hi there!\n\nWe\'ve been busy this month, and we\'re excited to share what\'s new...\n\n- New dashboard analytics\n- API v2 beta access\n- Improved automation templates',
    },
    status: 'pending',
    requestedAt: '2026-01-21T07:00:00Z',
  },
];

export const mockUpcomingEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Team Standup',
    time: '2026-01-21T10:00:00Z',
    duration: 30,
    participants: ['You', 'Sarah', 'Mike', 'Aria'],
    type: 'meeting',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 'event-2',
    title: 'Client Call - Acme Corp',
    time: '2026-01-21T14:00:00Z',
    duration: 60,
    participants: ['You', 'John Chen', 'Lisa Wang'],
    type: 'call',
    meetingUrl: 'https://zoom.us/j/123456789',
    cognateAssigned: 'Aria',
  },
  {
    id: 'event-3',
    title: 'Q4 Report Review',
    time: '2026-01-21T16:00:00Z',
    duration: 45,
    participants: ['You', 'Finance Team'],
    type: 'review',
  },
  {
    id: 'event-4',
    title: 'Product Roadmap Planning',
    time: '2026-01-22T09:00:00Z',
    duration: 120,
    participants: ['You', 'Product Team', 'Engineering'],
    type: 'meeting',
    location: 'Conference Room B',
  },
  {
    id: 'event-5',
    title: 'Newsletter Send Deadline',
    time: '2026-01-22T17:00:00Z',
    duration: 0,
    participants: ['Luna'],
    type: 'deadline',
    cognateAssigned: 'Luna',
  },
  {
    id: 'event-6',
    title: 'Weekly Sync with Investors',
    time: '2026-01-23T11:00:00Z',
    duration: 30,
    participants: ['You', 'Board Members'],
    type: 'call',
    meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
  },
];

export const mockCognateStatuses: CognateStatusItem[] = [
  {
    id: 'cognate-aria',
    name: 'Aria',
    status: 'working',
    health: 'healthy',
    currentAction: 'Drafting client follow-up emails',
    progress: 65,
    lastActivity: '2026-01-21T09:45:00Z',
  },
  {
    id: 'cognate-max',
    name: 'Max',
    status: 'idle',
    health: 'healthy',
    currentAction: 'Report generation complete',
    lastActivity: '2026-01-21T08:30:00Z',
  },
  {
    id: 'cognate-luna',
    name: 'Luna',
    status: 'training',
    health: 'healthy',
    currentAction: 'Learning new content guidelines',
    progress: 40,
    lastActivity: '2026-01-21T09:00:00Z',
  },
  {
    id: 'cognate-ops',
    name: 'OpsBot',
    status: 'working',
    health: 'warning',
    currentAction: 'Processing license renewals',
    progress: 80,
    lastActivity: '2026-01-21T09:50:00Z',
  },
  {
    id: 'cognate-sage',
    name: 'Sage',
    status: 'waiting',
    health: 'healthy',
    currentAction: 'Awaiting data pipeline completion',
    lastActivity: '2026-01-21T09:15:00Z',
  },
];

export const mockInboxItems: InboxItem[] = [
  {
    id: 'inbox-1',
    type: 'approval',
    title: 'VIP Email Ready for Review',
    preview: 'Aria has drafted a follow-up email to John Chen...',
    cognateId: 'cognate-aria',
    cognateName: 'Aria',
    priority: 'high',
    read: false,
    timestamp: '2026-01-21T09:30:00Z',
    actionRequired: true,
    relatedApprovalId: 'approval-1',
  },
  {
    id: 'inbox-2',
    type: 'notification',
    title: 'Report Generated Successfully',
    preview: 'Q4 2025 Executive Summary is ready for review',
    cognateId: 'cognate-max',
    cognateName: 'Max',
    priority: 'normal',
    read: false,
    timestamp: '2026-01-21T08:15:00Z',
    actionRequired: true,
    relatedApprovalId: 'approval-2',
  },
  {
    id: 'inbox-3',
    type: 'alert',
    title: 'License Expiring Soon',
    preview: 'Figma Enterprise license expires in 4 days',
    cognateId: 'cognate-ops',
    cognateName: 'OpsBot',
    priority: 'urgent',
    read: false,
    timestamp: '2026-01-20T16:45:00Z',
    actionRequired: true,
    relatedApprovalId: 'approval-3',
  },
  {
    id: 'inbox-4',
    type: 'message',
    title: 'Training Progress Update',
    preview: 'Luna has completed 40% of content guideline training',
    cognateId: 'cognate-luna',
    cognateName: 'Luna',
    priority: 'low',
    read: true,
    timestamp: '2026-01-21T09:00:00Z',
  },
  {
    id: 'inbox-5',
    type: 'notification',
    title: 'Automation Completed',
    preview: 'Weekly data sync finished without errors',
    cognateId: 'cognate-sage',
    cognateName: 'Sage',
    priority: 'normal',
    read: true,
    timestamp: '2026-01-21T06:00:00Z',
  },
  {
    id: 'inbox-6',
    type: 'approval',
    title: 'Meeting Scheduling Request',
    preview: 'Aria wants to schedule a demo with Acme Corp',
    cognateId: 'cognate-aria',
    cognateName: 'Aria',
    priority: 'normal',
    read: false,
    timestamp: '2026-01-21T10:00:00Z',
    actionRequired: true,
    relatedApprovalId: 'approval-4',
  },
  {
    id: 'inbox-7',
    type: 'alert',
    title: 'API Rate Limit Warning',
    preview: 'Approaching 80% of daily API quota',
    priority: 'high',
    read: false,
    timestamp: '2026-01-21T09:55:00Z',
  },
  {
    id: 'inbox-8',
    type: 'message',
    title: 'Action Completed: Data Export',
    preview: 'Customer data export finished (2,450 records)',
    cognateId: 'cognate-max',
    cognateName: 'Max',
    priority: 'normal',
    read: true,
    timestamp: '2026-01-20T17:30:00Z',
  },
  {
    id: 'inbox-9',
    type: 'notification',
    title: 'Newsletter Draft Ready',
    preview: 'Luna has prepared the January newsletter for review',
    cognateId: 'cognate-luna',
    cognateName: 'Luna',
    priority: 'normal',
    read: false,
    timestamp: '2026-01-21T07:00:00Z',
    actionRequired: true,
    relatedApprovalId: 'approval-5',
  },
  {
    id: 'inbox-10',
    type: 'message',
    title: 'Learning Complete: API Integration',
    preview: 'OpsBot has mastered Stripe webhook handling',
    cognateId: 'cognate-ops',
    cognateName: 'OpsBot',
    priority: 'low',
    read: true,
    timestamp: '2026-01-20T14:00:00Z',
  },
  {
    id: 'inbox-11',
    type: 'alert',
    title: 'Performance Anomaly Detected',
    preview: 'OpsBot response time increased by 40%',
    cognateId: 'cognate-ops',
    cognateName: 'OpsBot',
    priority: 'high',
    read: false,
    timestamp: '2026-01-21T09:50:00Z',
  },
];

// =============================================================================
// Store Interface
// =============================================================================

interface CollaborationState {
  // Data
  pendingApprovals: PendingApproval[];
  upcomingEvents: CalendarEvent[];
  cognateStatuses: CognateStatusItem[];
  inboxItems: InboxItem[];

  // Loading states
  isLoading: boolean;

  // Actions
  loadMockData: () => void;
  approveItem: (id: string) => void;
  rejectItem: (id: string, reason?: string) => void;
  modifyAndApprove: (id: string, modifications: Partial<ApprovalPreview>) => void;
  markInboxAsRead: (id: string) => void;
  markAllInboxAsRead: () => void;
  batchApprove: (ids: string[]) => void;
  updateCognateStatus: (id: string, status: Partial<CognateStatusItem>) => void;

  // WF5: Policy block and rerun
  rerunApprovedItem: (id: string) => void;
  addPolicyBlockedApproval: (approval: Omit<PendingApproval, 'id' | 'status' | 'requestedAt'>) => string;
}

// =============================================================================
// Store Implementation
// =============================================================================

export const useCollaborationStore = create<CollaborationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      pendingApprovals: [],
      upcomingEvents: [],
      cognateStatuses: [],
      inboxItems: [],
      isLoading: false,

      // Load mock data
      loadMockData: () => {
        set({
          pendingApprovals: mockPendingApprovals,
          upcomingEvents: mockUpcomingEvents,
          cognateStatuses: mockCognateStatuses,
          inboxItems: mockInboxItems,
          isLoading: false,
        });
      },

      // Approve an item
      approveItem: (id: string) => {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.map((item) =>
            item.id === id ? { ...item, status: 'approved' as const } : item
          ),
          inboxItems: state.inboxItems.map((item) =>
            item.relatedApprovalId === id
              ? { ...item, actionRequired: false, read: true }
              : item
          ),
        }));
      },

      // Reject an item
      rejectItem: (id: string, _reason?: string) => {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.map((item) =>
            item.id === id ? { ...item, status: 'rejected' as const } : item
          ),
          inboxItems: state.inboxItems.map((item) =>
            item.relatedApprovalId === id
              ? { ...item, actionRequired: false, read: true }
              : item
          ),
        }));
      },

      // Modify and approve
      modifyAndApprove: (id: string, modifications: Partial<ApprovalPreview>) => {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: 'modified' as const,
                  preview: { ...item.preview, ...modifications },
                }
              : item
          ),
          inboxItems: state.inboxItems.map((item) =>
            item.relatedApprovalId === id
              ? { ...item, actionRequired: false, read: true }
              : item
          ),
        }));
      },

      // Mark inbox item as read
      markInboxAsRead: (id: string) => {
        set((state) => ({
          inboxItems: state.inboxItems.map((item) =>
            item.id === id ? { ...item, read: true } : item
          ),
        }));
      },

      // Mark all inbox items as read
      markAllInboxAsRead: () => {
        set((state) => ({
          inboxItems: state.inboxItems.map((item) => ({ ...item, read: true })),
        }));
      },

      // Batch approve multiple items
      batchApprove: (ids: string[]) => {
        const { approveItem } = get();
        ids.forEach((id) => approveItem(id));
      },

      // Update Cognate status
      updateCognateStatus: (id: string, statusUpdate: Partial<CognateStatusItem>) => {
        set((state) => ({
          cognateStatuses: state.cognateStatuses.map((item) =>
            item.id === id ? { ...item, ...statusUpdate } : item
          ),
        }));
      },

      // WF5: Rerun an approved item
      rerunApprovedItem: (id: string) => {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.map((item) =>
            item.id === id
              ? { ...item, rerunCount: (item.rerunCount || 0) + 1 }
              : item
          ),
        }));
        // In a real implementation, this would trigger the actual rerun
        // dispatchEvent({ type: 'run_started', cognateId, payload: { runId: `${runId}-retry` } });
      },

      // WF5: Add a new policy-blocked approval
      addPolicyBlockedApproval: (approval) => {
        const id = `approval-${Date.now()}`;
        const newApproval: PendingApproval = {
          ...approval,
          id,
          status: 'pending',
          requestedAt: new Date().toISOString(),
        };

        set((state) => ({
          pendingApprovals: [newApproval, ...state.pendingApprovals],
          inboxItems: [
            {
              id: `inbox-${Date.now()}`,
              type: 'approval' as const,
              title: `Policy Blocked: ${approval.title}`,
              preview: approval.policyReason,
              cognateId: approval.cognateId,
              cognateName: approval.cognateName,
              priority: approval.riskLevel === 'critical' ? 'urgent' : approval.riskLevel === 'high' ? 'high' : 'normal',
              read: false,
              timestamp: new Date().toISOString(),
              actionRequired: true,
              relatedApprovalId: id,
            },
            ...state.inboxItems,
          ],
        }));

        return id;
      },
    }),
    { name: 'collaboration-store' }
  )
);
