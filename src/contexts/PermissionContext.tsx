/**
 * Permission Context
 *
 * Provides centralized permission management for the application.
 * Components can check permissions using the usePermissions hook or
 * declaratively with the PermissionGate component.
 */

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

/**
 * Available permissions in the Symtex system.
 * Extend this type as new permissions are added.
 */
export type Permission =
  | 'read'
  | 'write'
  | 'delete'
  | 'admin'
  | 'approve'
  | 'manage_cognates'
  | 'manage_automations'
  | 'view_audit'
  | 'manage_narratives'
  | 'manage_sops'
  | 'view_insights'
  | 'manage_team';

export interface PermissionContextValue {
  /** Current user's permissions */
  permissions: Permission[];

  /** Check if user has a specific permission */
  hasPermission: (permission: Permission) => boolean;

  /** Check if user has ALL of the specified permissions */
  hasAllPermissions: (permissions: Permission[]) => boolean;

  /** Check if user has ANY of the specified permissions */
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export interface PermissionProviderProps {
  children: ReactNode;
  /** Permissions granted to the current user */
  permissions: Permission[];
}

/**
 * Provider component that supplies permission context to the application.
 * Wrap your app or authenticated sections with this provider.
 *
 * @example
 * ```tsx
 * <PermissionProvider permissions={currentUser.permissions}>
 *   <App />
 * </PermissionProvider>
 * ```
 */
export function PermissionProvider({
  children,
  permissions,
}: PermissionProviderProps): JSX.Element {
  const value = useMemo<PermissionContextValue>(() => {
    const permissionSet = new Set(permissions);

    return {
      permissions,
      hasPermission: (permission: Permission) => permissionSet.has(permission),
      hasAllPermissions: (perms: Permission[]) =>
        perms.every((p) => permissionSet.has(p)),
      hasAnyPermission: (perms: Permission[]) =>
        perms.some((p) => permissionSet.has(p)),
    };
  }, [permissions]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

/**
 * Hook to access permission checking utilities.
 * Must be used within a PermissionProvider.
 *
 * @example
 * ```tsx
 * function AdminButton() {
 *   const { hasPermission } = usePermissions();
 *
 *   if (!hasPermission('admin')) {
 *     return null;
 *   }
 *
 *   return <Button>Admin Settings</Button>;
 * }
 * ```
 */
export function usePermissions(): PermissionContextValue {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }

  return context;
}

/**
 * Hook to check if context is available (for optional permission checks).
 * Returns null if not within a PermissionProvider.
 */
export function usePermissionsOptional(): PermissionContextValue | null {
  return useContext(PermissionContext);
}

// Re-export context for advanced use cases
export { PermissionContext };
