/**
 * Approval Queue Route
 *
 * Control > Approvals page that displays pending approvals from Cognates.
 * Part of WF5: Policy Blocks -> Request Approval -> Approve -> Rerun
 */

import { ApprovalQueue } from '@/features/collaboration/ApprovalQueue';

export default function ApprovalsRoute(): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto">
      <ApprovalQueue />
    </div>
  );
}
