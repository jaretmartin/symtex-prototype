/**
 * Bootstrap Wizard Page
 *
 * 5-step wizard to bootstrap a Cognate with industry-specific
 * and role-specific SOP configurations.
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Building2,
  User,
  Package,
  ClipboardCheck,
} from 'lucide-react';
import { useCognateStore } from '@/store';

type BootstrapStep = 0 | 1 | 2 | 3 | 4;

const STEPS = [
  { id: 0, title: 'Welcome', icon: Sparkles },
  { id: 1, title: 'Industry', icon: Building2 },
  { id: 2, title: 'Role', icon: User },
  { id: 3, title: 'Packs', icon: Package },
  { id: 4, title: 'Review', icon: ClipboardCheck },
] as const;

const INDUSTRIES = [
  { id: 'healthcare', name: 'Healthcare', description: 'Medical, clinical, and health services' },
  { id: 'finance', name: 'Finance', description: 'Banking, investments, and financial services' },
  { id: 'ecommerce', name: 'E-Commerce', description: 'Online retail and digital commerce' },
  { id: 'technology', name: 'Technology', description: 'Software, IT, and tech services' },
  { id: 'marketing', name: 'Marketing', description: 'Advertising, PR, and brand management' },
  { id: 'general', name: 'General', description: 'Cross-industry applications' },
];

const ROLES = [
  { id: 'customer-support', name: 'Customer Support', description: 'Handle inquiries and support tickets' },
  { id: 'sales', name: 'Sales', description: 'Lead qualification and sales outreach' },
  { id: 'analyst', name: 'Analyst', description: 'Data analysis and reporting' },
  { id: 'researcher', name: 'Researcher', description: 'Information gathering and research' },
  { id: 'writer', name: 'Writer', description: 'Content creation and copywriting' },
  { id: 'coordinator', name: 'Coordinator', description: 'Action coordination and scheduling' },
  { id: 'custom', name: 'Custom', description: 'Define your own role' },
];

const SUGGESTED_PACKS = [
  { id: 'greeting-basics', name: 'Greeting Basics', sopCount: 3 },
  { id: 'escalation-handling', name: 'Escalation Handling', sopCount: 5 },
  { id: 'faq-automation', name: 'FAQ Automation', sopCount: 8 },
  { id: 'sentiment-routing', name: 'Sentiment Routing', sopCount: 4 },
  { id: 'compliance-checks', name: 'Compliance Checks', sopCount: 6 },
  { id: 'feedback-collection', name: 'Feedback Collection', sopCount: 3 },
];

export function BootstrapWizardPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cognates, updateCognate } = useCognateStore();

  const cognate = cognates.find((c) => c.id === id);

  const [currentStep, setCurrentStep] = useState<BootstrapStep>(0);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);

  if (!cognate) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">Cognate Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested cognate does not exist.</p>
        <Link
          to="/studio/cognates"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cognates
        </Link>
      </div>
    );
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return selectedIndustry !== null;
      case 2:
        return selectedRole !== null;
      case 3:
        return true; // Packs are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = (): void => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as BootstrapStep);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as BootstrapStep);
    }
  };

  const handleComplete = (): void => {
    // Update cognate with bootstrap configuration
    updateCognate(id!, {
      industry: selectedIndustry || undefined,
      role: selectedRole || undefined,
    });

    // Navigate to SOPs page
    navigate(`/studio/cognates/${id}/sops`);
  };

  const togglePack = (packId: string): void => {
    setSelectedPacks((prev) =>
      prev.includes(packId)
        ? prev.filter((p) => p !== packId)
        : [...prev, packId]
    );
  };

  const renderStepContent = (): JSX.Element => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bootstrap Your Cognate
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Configure <span className="text-foreground font-medium">{cognate.name}</span> with
              industry-specific and role-specific SOPs to get started quickly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
                <Building2 className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-medium text-foreground mb-1">Industry SOPs</h3>
                <p className="text-sm text-muted-foreground">Domain-specific rules and compliance</p>
              </div>
              <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
                <User className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="font-medium text-foreground mb-1">Role SOPs</h3>
                <p className="text-sm text-muted-foreground">Task-specific behaviors and responses</p>
              </div>
              <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
                <Package className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-medium text-foreground mb-1">SOP Packs</h3>
                <p className="text-sm text-muted-foreground">Pre-built collections for common use cases</p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Select Industry
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Choose the primary industry for this Cognate
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`
                    p-4 rounded-lg border text-left transition-all
                    ${selectedIndustry === industry.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-border bg-surface-base/50 hover:border-muted'
                    }
                  `}
                >
                  <h3 className="font-medium text-foreground mb-1">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                  {selectedIndustry === industry.id && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-blue-400">
                      <Check className="w-4 h-4" />
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Select Role
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Choose the primary role for this Cognate
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`
                    p-4 rounded-lg border text-left transition-all
                    ${selectedRole === role.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border bg-surface-base/50 hover:border-muted'
                    }
                  `}
                >
                  <h3 className="font-medium text-foreground mb-1">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  {selectedRole === role.id && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-green-400">
                      <Check className="w-4 h-4" />
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Select SOP Packs
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Choose pre-built SOP packs to install (optional)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUGGESTED_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => togglePack(pack.id)}
                  className={`
                    p-4 rounded-lg border text-left transition-all flex items-center justify-between
                    ${selectedPacks.includes(pack.id)
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border bg-surface-base/50 hover:border-muted'
                    }
                  `}
                >
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{pack.name}</h3>
                    <p className="text-sm text-muted-foreground">{pack.sopCount} SOPs included</p>
                  </div>
                  <div
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center
                      ${selectedPacks.includes(pack.id)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-border'
                      }
                    `}
                  >
                    {selectedPacks.includes(pack.id) && (
                      <Check className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {selectedPacks.length > 0 && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {selectedPacks.length} pack{selectedPacks.length !== 1 ? 's' : ''} selected
                ({SUGGESTED_PACKS.filter((p) => selectedPacks.includes(p.id)).reduce(
                  (acc, p) => acc + p.sopCount,
                  0
                )} SOPs total)
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Review Configuration
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Confirm your bootstrap settings
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Industry</span>
                </div>
                <p className="font-medium text-foreground">
                  {INDUSTRIES.find((i) => i.id === selectedIndustry)?.name || 'Not selected'}
                </p>
              </div>

              <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-muted-foreground">Role</span>
                </div>
                <p className="font-medium text-foreground">
                  {ROLES.find((r) => r.id === selectedRole)?.name || 'Not selected'}
                </p>
              </div>

              <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-muted-foreground">SOP Packs</span>
                </div>
                {selectedPacks.length === 0 ? (
                  <p className="text-muted-foreground">No packs selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedPacks.map((packId) => {
                      const pack = SUGGESTED_PACKS.find((p) => p.id === packId);
                      return (
                        <span
                          key={packId}
                          className="px-2 py-1 text-sm bg-purple-500/20 text-purple-400 rounded"
                        >
                          {pack?.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return <div />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            to={`/studio/cognates/${id}/sops`}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Bootstrap Wizard</h1>
            <p className="text-sm text-muted-foreground">{cognate.name}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg
                    ${isActive ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${isCompleted ? 'text-green-400' : ''}
                    ${!isActive && !isCompleted ? 'text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 ${
                      isCompleted ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">{renderStepContent()}</div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentStep === 0
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-muted-foreground hover:bg-card'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${canProceed()
                  ? 'bg-blue-600 text-foreground hover:bg-blue-500'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-foreground rounded-lg hover:bg-green-500 transition-colors"
            >
              <Check className="w-4 h-4" />
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BootstrapWizardPage;
