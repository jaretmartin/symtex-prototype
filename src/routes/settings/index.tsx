/**
 * Settings Page
 *
 * User settings and preferences including theme, notifications, and account management.
 */

import { useState } from 'react';
import { Settings as SettingsIcon, Palette, Bell, User, Mail, Smartphone, Shield, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useToast } from '@/store/useUIStore';

/**
 * Settings card wrapper component for consistent section styling
 */
function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/**
 * Toggle switch component for settings
 */
function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${enabled ? 'bg-primary' : 'bg-muted'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0
          transition duration-200 ease-in-out
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

/**
 * Settings row item component
 */
function SettingsRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0 border-b border-border last:border-0">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-muted/50">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );
}

/**
 * Placeholder link button for navigation to other settings pages
 */
function SettingsLink({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-between py-4 first:pt-0 last:pb-0 border-b border-border last:border-0 hover:bg-muted/30 -mx-6 px-6 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-muted/50">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="text-left">
          <p className="font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

/**
 * Settings Page Component
 */
export default function SettingsPage(): JSX.Element {
  const { success, info, warning } = useToast();

  // Notification toggle states
  // In production, these would be connected to a settings store/API
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  const handleEmailNotificationsChange = (enabled: boolean): void => {
    setEmailNotifications(enabled);
    success(
      enabled ? 'Email notifications enabled' : 'Email notifications disabled',
      'Your preference has been saved'
    );
  };

  const handlePushNotificationsChange = (enabled: boolean): void => {
    setPushNotifications(enabled);
    success(
      enabled ? 'Push notifications enabled' : 'Push notifications disabled',
      'Your preference has been saved'
    );
  };

  const handleInAppNotificationsChange = (enabled: boolean): void => {
    setInAppNotifications(enabled);
    success(
      enabled ? 'In-app notifications enabled' : 'In-app notifications disabled',
      'Your preference has been saved'
    );
  };

  const handleProfileClick = (): void => {
    info('Coming Soon', 'Profile settings will be available in a future update');
  };

  const handleSecurityClick = (): void => {
    info('Coming Soon', 'Security settings will be available in a future update');
  };

  const handleDeleteAccount = (): void => {
    warning(
      'Demo Mode',
      'Account deletion is disabled in demo mode'
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your preferences and account settings
          </p>
        </div>
      </div>

      {/* Appearance Section */}
      <SettingsCard
        title="Appearance"
        description="Customize how Symtex looks on your device"
      >
        <SettingsRow
          icon={Palette}
          label="Theme"
          description="Choose between light, dark, or system theme"
        >
          <ThemeToggle size="default" />
        </SettingsRow>
      </SettingsCard>

      {/* Notifications Section */}
      <SettingsCard
        title="Notifications"
        description="Configure how you want to receive updates and alerts"
      >
        <div className="space-y-0">
          <SettingsRow
            icon={Mail}
            label="Email Notifications"
            description="Receive updates and alerts via email"
          >
            <ToggleSwitch
              enabled={emailNotifications}
              onChange={handleEmailNotificationsChange}
            />
          </SettingsRow>

          <SettingsRow
            icon={Smartphone}
            label="Push Notifications"
            description="Receive push notifications on your devices"
          >
            <ToggleSwitch
              enabled={pushNotifications}
              onChange={handlePushNotificationsChange}
            />
          </SettingsRow>

          <SettingsRow
            icon={Bell}
            label="In-App Notifications"
            description="Show notifications within the application"
          >
            <ToggleSwitch
              enabled={inAppNotifications}
              onChange={handleInAppNotificationsChange}
            />
          </SettingsRow>
        </div>
      </SettingsCard>

      {/* Account Section */}
      <SettingsCard
        title="Account"
        description="Manage your account information and security"
      >
        <div className="space-y-0">
          <SettingsLink
            icon={User}
            label="Profile"
            description="Update your name, email, and avatar"
            onClick={handleProfileClick}
          />

          <SettingsLink
            icon={Shield}
            label="Security"
            description="Password, two-factor authentication, and sessions"
            onClick={handleSecurityClick}
          />
        </div>
      </SettingsCard>

      {/* Danger Zone - Optional */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-destructive/20">
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Irreversible actions for your account
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
