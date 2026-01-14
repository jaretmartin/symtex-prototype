/**
 * Agent roster and execution types
 *
 * Defines the structure for AI agent templates, instances,
 * and multi-agent verification patterns.
 */

/**
 * Verification patterns for multi-agent consensus
 */
export type VerificationPattern = 'sibling' | 'debate' | 'family' | 'waves';

/**
 * Status of an agent instance
 */
export type AgentStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'busy';

/**
 * Status of an agent template
 */
export type AgentTemplateStatus = 'draft' | 'active' | 'deprecated';

/**
 * Status of an agent execution
 */
export type AgentExecutionStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

/**
 * A template defining an agent's capabilities and defaults
 */
export interface AgentTemplate {
  /** Unique identifier for the template */
  id: string;
  /** Display name for the agent type */
  name: string;
  /** Description of what this agent does */
  description: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** List of capabilities this agent possesses */
  capabilities: string[];
  /** The default verification pattern for this agent type */
  defaultPattern: VerificationPattern;
  /** Current status of the template */
  status?: AgentTemplateStatus;
  /** Number of instances created from this template */
  instanceCount: number;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * A running or historical instance of an agent
 */
export interface AgentInstance {
  /** Unique identifier for this instance */
  id: string;
  /** The template this instance is based on */
  templateId: string;
  /** Current status of the agent */
  status: AgentStatus;
  /** ID of the mission this agent is working on */
  missionId?: string;
  /** ID of the project this agent is assigned to */
  projectId?: string;
  /** ISO timestamp when the agent started */
  startedAt?: string;
  /** ISO timestamp when the agent completed */
  completedAt?: string;
  /** The result produced by the agent */
  result?: AgentResult;
  /** Total number of executions */
  totalExecutions: number;
  /** Number of successful executions */
  successfulExecutions: number;
  /** ISO timestamp of last activity */
  lastActiveAt?: string;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * The result of an agent's execution
 */
export interface AgentResult {
  /** Whether the execution was successful */
  success: boolean;
  /** The output produced */
  output: string;
  /** Confidence score for the output (0-1) */
  confidence: number;
  /** Any errors that occurred */
  errors?: string[];
  /** Metadata about the execution */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for a multi-agent execution (store-compatible)
 */
export interface AgentExecution {
  /** Unique identifier for this execution */
  id: string;
  /** ID of the agent instance executing */
  instanceId: string;
  /** ID of the primary agent leading the execution (for multi-agent) */
  agentId?: string;
  /** The verification pattern being used */
  pattern?: VerificationPattern;
  /** IDs of all agents participating in this execution */
  agents?: string[];
  /** Whether consensus is required for completion */
  consensusRequired?: boolean;
  /** Optional timeout in milliseconds */
  timeout?: number;
  /** Current status of the execution */
  status: AgentExecutionStatus;
  /** The input/prompt that triggered this execution */
  input?: string;
  /** The output/response from the execution */
  output?: string;
  /** Error message if failed */
  error?: string;
  /** ISO timestamp when execution started */
  startedAt: string;
  /** ISO timestamp when execution completed */
  completedAt?: string;
  /** Duration in milliseconds */
  duration?: number;
}

/**
 * Multi-agent execution configuration (spec interface)
 */
export interface MultiAgentExecution {
  /** Unique identifier for this execution */
  id: string;
  /** ID of the primary agent leading the execution */
  agentId: string;
  /** The verification pattern being used */
  pattern: VerificationPattern;
  /** IDs of all agents participating in this execution */
  agents: string[];
  /** Whether consensus is required for completion */
  consensusRequired: boolean;
  /** Optional timeout in milliseconds */
  timeout?: number;
}

/**
 * Result of a multi-agent consensus process
 */
export interface ConsensusResult {
  /** Whether consensus was reached */
  reached: boolean;
  /** The agreed-upon output if consensus was reached */
  consensusOutput?: string;
  /** Individual agent outputs */
  agentOutputs: AgentOutput[];
  /** Confidence in the consensus (0-1) */
  confidence: number;
  /** Duration of the consensus process in milliseconds */
  duration: number;
}

/**
 * Output from a single agent in a multi-agent execution
 */
export interface AgentOutput {
  /** ID of the agent that produced this output */
  agentId: string;
  /** The output content */
  output: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Whether this agent agreed with the consensus */
  agreedWithConsensus: boolean;
  /** Reasoning for disagreement if applicable */
  dissent?: string;
}

/**
 * Configuration for agent behavior
 */
export interface AgentConfig {
  /** Maximum execution time in milliseconds */
  maxExecutionTime: number;
  /** Number of retries on failure */
  retryCount: number;
  /** Delay between retries in milliseconds */
  retryDelay: number;
  /** Minimum confidence threshold for outputs */
  confidenceThreshold: number;
  /** Whether to log detailed execution steps */
  verboseLogging: boolean;
}

/**
 * Roster of available agents
 */
export interface AgentRoster {
  /** All available agent templates */
  templates: AgentTemplate[];
  /** Currently active agent instances */
  activeInstances: AgentInstance[];
  /** Recently completed agent instances */
  recentInstances: AgentInstance[];
  /** Default configuration for new agents */
  defaultConfig: AgentConfig;
}
