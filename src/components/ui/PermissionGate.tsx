/**
 * PermissionGate Component
 *
 * A declarative authorization wrapper that controls content visibility
 * based on user permissions. Works with PermissionContext or accepts
 * permissions directly via props.
 */

import { type ReactNode } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button/Button';
import {
  type Permission,
  usePermissionsOptional,
} from '@/contexts/PermissionContext';

export interface PermissionGateProps {
  /** Required permission(s) to view the content */
  requires: Permission | Permission[];
  /** If true, ALL permissions must be present (AND logic). Default is OR logic. */
  requireAll?: boolean;

  /** Content to render when permission is granted */
  children: ReactNode;

  /** Content to render when permission is denied */
  fallback?: ReactNode;
  /** If true, render nothing when permission is denied */
  hideWhenDenied?: boolean;
  /** If true, render children in a disabled state when denied */
  disabledState?: boolean;

  /**
   * Override permissions (bypasses PermissionContext).
   * Useful for components that receive permissions via props.
   */
  userPermissions?: Permission[];
}

/**
 * PermissionGate controls content visibility based on user permissions.
 *
 * @example
 * ```tsx
 * // Show admin panel only to admins
 * <PermissionGate requires="admin" fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </PermissionGate>
 *
 * // Require multiple permissions (AND)
 * <PermissionGate requires={['write', 'approve']} requireAll>
 *   <ApproveButton />
 * </PermissionGate>
 *
 * // Hide completely when no permission
 * <PermissionGate requires="delete" hideWhenDenied>
 *   <DeleteButton />
 * </PermissionGate>
 *
 * // Render disabled state
 * <PermissionGate requires="edit" disabledState>
 *   <EditForm />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  requires,
  requireAll = false,
  children,
  fallback,
  hideWhenDenied = false,
  disabledState = false,
  userPermissions: propPermissions,
}: PermissionGateProps): JSX.Element | null {
  // Try to get permissions from context, fall back to props
  const contextPermissions = usePermissionsOptional();
  const permissions = propPermissions ?? contextPermissions?.permissions ?? [];

  // Normalize requires to array
  const requiredPermissions = Array.isArray(requires) ? requires : [requires];
  const permissionSet = new Set(permissions);

  // Check permission based on requireAll flag
  const hasPermission = requireAll
    ? requiredPermissions.every((p) => permissionSet.has(p))
    : requiredPermissions.some((p) => permissionSet.has(p));

  // Permission granted - render children
  if (hasPermission) {
    return <>{children}</>;
  }

  // Permission denied - handle based on props

  // Option 1: Hide completely
  if (hideWhenDenied) {
    return null;
  }

  // Option 2: Render disabled state
  if (disabledState) {
    return (
      <div
        className="opacity-50 pointer-events-none select-none"
        aria-disabled="true"
        title="You do not have permission to access this feature"
      >
        {children}
      </div>
    );
  }

  // Option 3: Render custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: Render default AccessDenied component
  return <AccessDenied />;
}

PermissionGate.displayName = 'PermissionGate';

// =============================================================================
// AccessDenied Component
// =============================================================================

export interface AccessDeniedProps {
  /** Title text */
  title?: string;
  /** Description message */
  message?: string;
  /** Show "Request Access" button */
  showRequestAccess?: boolean;
  /** Callback when request access is clicked */
  onRequestAccess?: () => void;
  /** Use compact layout */
  compact?: boolean;
  /** Use inline layout (for embedding in content) */
  inline?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AccessDenied displays a message when the user lacks permission.
 * Can be used as a fallback for PermissionGate or standalone.
 *
 * @example
 * ```tsx
 * <AccessDenied
 *   title="Admin Access Required"
 *   message="Contact your administrator to gain access."
 *   showRequestAccess
 *   onRequestAccess={() => openAccessRequest()}
 * />
 * ```
 */
export function AccessDenied({
  title = 'Access Denied',
  message = 'You do not have permission to view this content.',
  showRequestAccess = true,
  onRequestAccess,
  compact = false,
  inline = false,
  className,
}: AccessDeniedProps): JSX.Element {
  if (inline) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-sm text-muted-foreground',
          className
        )}
      >
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{message}</span>
      </span>
    );
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border',
          className
        )}
        role="alert"
      >
        <Lock
          className="h-5 w-5 text-muted-foreground flex-shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
        {showRequestAccess && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onRequestAccess}
            className="flex-shrink-0"
          >
            Request Access
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
      role="alert"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
        <ShieldAlert
          className="w-8 h-8 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{message}</p>
      {showRequestAccess && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRequestAccess}
          className="mt-4"
          leftIcon={<Lock className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Request Access
        </Button>
      )}
    </div>
  );
}

AccessDenied.displayName = 'AccessDenied';

// =============================================================================
// Utility Components
// =============================================================================

export interface RequirePermissionProps {
  /** Required permission */
  permission: Permission;
  /** Content to render when permitted */
  children: ReactNode;
  /** Optional permissions override */
  userPermissions?: Permission[];
}

/**
 * Simple utility component for single permission checks.
 * Hides content when permission is missing (no fallback).
 *
 * @example
 * ```tsx
 * <RequirePermission permission="delete">
 *   <DeleteButton />
 * </RequirePermission>
 * ```
 */
export function RequirePermission({
  permission,
  children,
  userPermissions,
}: RequirePermissionProps): JSX.Element | null {
  return (
    <PermissionGate
      requires={permission}
      hideWhenDenied
      userPermissions={userPermissions}
    >
      {children}
    </PermissionGate>
  );
}

RequirePermission.displayName = 'RequirePermission';
