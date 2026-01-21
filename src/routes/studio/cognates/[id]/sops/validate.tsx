/**
 * SOP Validation Dashboard Route
 *
 * Provides a comprehensive validation interface for SOPs including:
 * - Rule syntax validation
 * - Conflict detection
 * - Coverage analysis
 * - Test execution
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  ChevronRight,
  Code2,
  Pencil,
  FileCheck,
  AlertCircle,
  Zap,
  Target,
  Clock,
} from 'lucide-react';
import { useCognateStore } from '@/store';

interface ValidationResult {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  category: 'syntax' | 'conflict' | 'coverage' | 'performance';
  title: string;
  description: string;
  ruleIndex?: number;
  suggestion?: string;
}

interface ValidationSummary {
  total: number;
  passed: number;
  warnings: number;
  errors: number;
  score: number;
}

export function SOPValidationDashboardRoute(): JSX.Element {
  const { id, sopId } = useParams<{ id: string; sopId: string }>();
  const navigate = useNavigate();
  const { cognates, sops } = useCognateStore();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const cognate = cognates.find((c) => c.id === id);
  const sop = sops.find((s) => s.id === sopId);

  // Run validation on mount
  useEffect(() => {
    if (sop) {
      runValidation();
    }
  }, [sop?.id]);

  // Calculate summary from results
  const summary: ValidationSummary = useMemo(() => {
    const errors = validationResults.filter((r) => r.type === 'error').length;
    const warnings = validationResults.filter((r) => r.type === 'warning').length;
    const passed = validationResults.filter((r) => r.type === 'success').length;
    const total = validationResults.length;
    const score = total > 0 ? Math.round(((passed / total) * 100)) : 0;

    return { total, passed, warnings, errors, score };
  }, [validationResults]);

  // Filter results by category
  const filteredResults = useMemo(() => {
    if (!selectedCategory) return validationResults;
    return validationResults.filter((r) => r.category === selectedCategory);
  }, [validationResults, selectedCategory]);

  const runValidation = async (): Promise<void> => {
    setIsValidating(true);

    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const results: ValidationResult[] = [];

    // Check if SOP has rules
    if (!sop?.rules || sop.rules.length === 0) {
      results.push({
        id: 'no-rules',
        type: 'error',
        category: 'syntax',
        title: 'No Rules Defined',
        description: 'This SOP has no rules. Add at least one rule to make it functional.',
        suggestion: 'Use the SOP Editor to add rules to this SOP.',
      });
    } else {
      // Validate each rule
      sop.rules.forEach((rule, index) => {
        // Check for rule name
        if (!rule.name || rule.name.trim() === '') {
          results.push({
            id: `rule-${index}-name`,
            type: 'warning',
            category: 'syntax',
            title: `Rule ${index + 1}: Missing Name`,
            description: 'Rules should have descriptive names for better maintainability.',
            ruleIndex: index,
            suggestion: 'Add a meaningful name that describes what this rule does.',
          });
        } else {
          results.push({
            id: `rule-${index}-name-ok`,
            type: 'success',
            category: 'syntax',
            title: `Rule "${rule.name}": Valid Name`,
            description: 'Rule has a descriptive name.',
            ruleIndex: index,
          });
        }

        // Check for conditions
        if (!rule.conditions || rule.conditions.length === 0) {
          results.push({
            id: `rule-${index}-condition`,
            type: 'error',
            category: 'syntax',
            title: `Rule ${index + 1}: Missing Condition`,
            description: 'Every rule must have a condition (when clause) to trigger.',
            ruleIndex: index,
            suggestion: 'Define when this rule should be activated.',
          });
        } else {
          results.push({
            id: `rule-${index}-condition-ok`,
            type: 'success',
            category: 'syntax',
            title: `Rule "${rule.name || index + 1}": Valid Condition`,
            description: 'Rule has a trigger condition defined.',
            ruleIndex: index,
          });
        }

        // Check for actions
        if (!rule.thenActions || rule.thenActions.length === 0) {
          results.push({
            id: `rule-${index}-action`,
            type: 'error',
            category: 'syntax',
            title: `Rule ${index + 1}: Missing Action`,
            description: 'Every rule must have an action (then clause) to execute.',
            ruleIndex: index,
            suggestion: 'Define what this rule should do when triggered.',
          });
        } else {
          results.push({
            id: `rule-${index}-action-ok`,
            type: 'success',
            category: 'syntax',
            title: `Rule "${rule.name || index + 1}": Valid Action`,
            description: 'Rule has an action defined.',
            ruleIndex: index,
          });
        }
      });

      // Check for potential conflicts (same conditions)
      const conditionMap = new Map<string, number[]>();
      sop.rules.forEach((rule, index) => {
        if (rule.conditions && rule.conditions.length > 0) {
          const key = JSON.stringify(rule.conditions);
          if (!conditionMap.has(key)) {
            conditionMap.set(key, []);
          }
          conditionMap.get(key)!.push(index);
        }
      });

      conditionMap.forEach((indices, _condition) => {
        if (indices.length > 1) {
          results.push({
            id: `conflict-${indices.join('-')}`,
            type: 'warning',
            category: 'conflict',
            title: 'Potential Rule Conflict',
            description: `Rules ${indices.map((i) => i + 1).join(', ')} have identical conditions and may conflict.`,
            suggestion: 'Review these rules to ensure they work together as intended, or add priority to control execution order.',
          });
        }
      });

      // Coverage analysis
      if (sop.rules.length < 3) {
        results.push({
          id: 'coverage-low',
          type: 'info',
          category: 'coverage',
          title: 'Low Rule Coverage',
          description: 'This SOP has few rules. Consider adding more rules to handle edge cases.',
          suggestion: 'Analyze common scenarios and add rules to handle them.',
        });
      } else {
        results.push({
          id: 'coverage-ok',
          type: 'success',
          category: 'coverage',
          title: 'Adequate Rule Coverage',
          description: `This SOP has ${sop.rules.length} rules providing reasonable coverage.`,
        });
      }

      // Performance check
      if (sop.rules.length > 50) {
        results.push({
          id: 'performance-rules',
          type: 'warning',
          category: 'performance',
          title: 'Large Rule Set',
          description: 'This SOP has many rules which may impact evaluation performance.',
          suggestion: 'Consider splitting into multiple SOPs or optimizing rule conditions.',
        });
      } else {
        results.push({
          id: 'performance-ok',
          type: 'success',
          category: 'performance',
          title: 'Performance Acceptable',
          description: 'Rule count is within acceptable limits for efficient evaluation.',
        });
      }
    }

    // Check SOP metadata
    if (!sop?.description || sop.description.length < 10) {
      results.push({
        id: 'meta-description',
        type: 'warning',
        category: 'syntax',
        title: 'Missing or Short Description',
        description: 'A detailed description helps others understand this SOP.',
        suggestion: 'Add a comprehensive description explaining the purpose and use cases.',
      });
    }

    if (!sop?.tags || sop.tags.length === 0) {
      results.push({
        id: 'meta-tags',
        type: 'info',
        category: 'syntax',
        title: 'No Tags',
        description: 'Tags help organize and discover SOPs.',
        suggestion: 'Add relevant tags to improve discoverability.',
      });
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  if (!cognate) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">Cognate Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested Cognate does not exist.</p>
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

  if (!sop) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">SOP Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested SOP does not exist.</p>
        <Link
          to={`/studio/cognates/${id}/sops`}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to SOPs
        </Link>
      </div>
    );
  }

  const getTypeIcon = (type: ValidationResult['type']): JSX.Element => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getCategoryIcon = (category: ValidationResult['category']): JSX.Element => {
    switch (category) {
      case 'syntax':
        return <Code2 className="w-4 h-4" />;
      case 'conflict':
        return <AlertTriangle className="w-4 h-4" />;
      case 'coverage':
        return <Target className="w-4 h-4" />;
      case 'performance':
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-surface-base/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/studio/cognates/${id}/sops`}
              className="p-2 hover:bg-card rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link to="/studio/cognates" className="hover:text-foreground transition-colors">
                  Cognates
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                  to={`/studio/cognates/${id}/sops`}
                  className="hover:text-foreground transition-colors"
                >
                  {cognate.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{sop.name}</span>
              </div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Validation Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/studio/cognates/${id}/sops/${sopId}/rules`)}
              className="flex items-center gap-2 px-3 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
            >
              <Code2 className="w-4 h-4" />
              View S1
            </button>
            <button
              type="button"
              onClick={() => navigate(`/studio/cognates/${id}/sops/${sopId}/edit`)}
              className="flex items-center gap-2 px-3 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit SOP
            </button>
            <button
              type="button"
              onClick={runValidation}
              disabled={isValidating}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-foreground rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {isValidating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isValidating ? 'Validating...' : 'Run Validation'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Validation Score</span>
              <FileCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {summary.score}%
            </div>
          </div>

          <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Passed</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{summary.passed}</div>
          </div>

          <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Warnings</span>
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400">{summary.warnings}</div>
          </div>

          <div className="p-4 bg-surface-base/50 border border-card rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Errors</span>
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">{summary.errors}</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground mr-2">Filter:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-foreground'
                : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {(['syntax', 'conflict', 'coverage', 'performance'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors capitalize ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        {isValidating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-muted-foreground">Running validation checks...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No validation results yet. Click "Run Validation" to start.</p>
              </div>
            ) : (
              filteredResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 bg-surface-base/50 border rounded-lg ${
                    result.type === 'error'
                      ? 'border-red-500/30'
                      : result.type === 'warning'
                      ? 'border-yellow-500/30'
                      : result.type === 'success'
                      ? 'border-green-500/30'
                      : 'border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getTypeIcon(result.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{result.title}</h3>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-card text-muted-foreground capitalize">
                          {getCategoryIcon(result.category)}
                          {result.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      {result.suggestion && (
                        <p className="text-sm text-blue-400">
                          <strong>Suggestion:</strong> {result.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SOPValidationDashboardRoute;
