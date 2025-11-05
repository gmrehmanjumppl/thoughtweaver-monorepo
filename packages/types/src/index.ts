/**
 * Type Definitions
 * 
 * Centralized type definitions for the entire application.
 * This ensures type consistency and prevents type drift across files.
 */

// ============================================================================
// User Types
// ============================================================================

/**
 * User account information
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Avatar URL or emoji */
  avatar: string;
  /** OAuth provider used for authentication */
  provider?: 'google' | 'apple';
  /** Account creation timestamp */
  createdAt?: Date;
}

// ============================================================================
// Conversation Types
// ============================================================================

/**
 * Conversation/chat session
 */
export interface Conversation {
  /** Unique conversation identifier */
  id: string;
  /** Conversation title */
  title: string;
  /** Initial prompt that started the conversation */
  prompt: string;
  /** Workflow type used */
  workflow: string;
  /** Array of assistant IDs participating */
  assistants: string[];
  /** Creation timestamp */
  timestamp: Date;
  /** Optional LLM model used */
  llm?: string;
  /** Optional project this conversation belongs to */
  projectId?: string;
}

/**
 * Individual message in a conversation
 */
export interface Message {
  /** Unique message identifier */
  id: string;
  /** Message content */
  content: string;
  /** Message sender ('user' or assistant ID) */
  sender: string;
  /** Message timestamp */
  timestamp: Date;
  /** Optional message metadata */
  metadata?: {
    /** LLM model used for this message */
    model?: string;
    /** Token count */
    tokens?: number;
    /** Processing time in milliseconds */
    processingTime?: number;
  };
}

// ============================================================================
// Assistant Types
// ============================================================================

/**
 * AI Assistant personality configuration
 */
export interface PersonalityTraits {
  /** Creativity level (0-100) */
  creativity: number;
  /** Analytical thinking (0-100) */
  analytical: number;
  /** Empathy level (0-100) */
  empathy: number;
  /** Assertiveness (0-100) */
  assertiveness: number;
  /** Detail orientation (0-100) */
  detailOriented: number;
  /** Strategic thinking (0-100) */
  strategic: number;
}

/**
 * AI Assistant configuration
 */
export interface Assistant {
  /** Unique assistant identifier */
  id: string;
  /** Assistant display name */
  name: string;
  /** Short description */
  description: string;
  /** Avatar emoji or image URL */
  avatar: string;
  /** Theme color class */
  color: string;
  /** Personality trait scores */
  personality: PersonalityTraits;
  /** System prompt for this assistant */
  systemPrompt: string;
  /** Whether this is a custom user-created assistant */
  isCustom?: boolean;
  /** Creator user ID (for custom assistants) */
  createdBy?: string;
  /** Creation timestamp */
  createdAt?: Date;
}

// ============================================================================
// Workflow Types
// ============================================================================

/**
 * Workflow configuration
 */
export interface Workflow {
  /** Unique workflow identifier */
  id: string;
  /** Workflow display name */
  name: string;
  /** Workflow description */
  description: string;
  /** Icon component or name */
  icon: string;
  /** Suggested number of assistants */
  suggestedAssistants: number;
  /** Whether this is a custom workflow */
  isCustom?: boolean;
  /** Workflow steps (for structured workflows) */
  steps?: WorkflowStep[];
}

/**
 * Step in a structured workflow
 */
export interface WorkflowStep {
  /** Step identifier */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Recommended assistants for this step */
  recommendedAssistants?: string[];
  /** Expected duration in minutes */
  estimatedDuration?: number;
}

// ============================================================================
// Project Types
// ============================================================================

/**
 * Project for organizing conversations
 */
export interface Project {
  /** Unique project identifier */
  id: string;
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Conversation IDs in this project */
  conversationIds: string[];
  /** Project color/theme */
  color?: string;
  /** Project icon */
  icon?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last updated timestamp */
  updatedAt: Date;
  /** Project owner user ID */
  ownerId?: string;
  /** Shared with user IDs (for team projects) */
  sharedWith?: string[];
}

// ============================================================================
// LLM Types
// ============================================================================

/**
 * LLM model configuration
 */
export interface LLMModel {
  /** Model identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model provider (OpenAI, Anthropic, etc.) */
  provider: string;
  /** Short description */
  description: string;
  /** Whether this model is enabled */
  enabled: boolean;
  /** Configuration parameters */
  config: LLMConfig;
  /** Cost per 1K tokens (input) */
  costPerInputToken?: number;
  /** Cost per 1K tokens (output) */
  costPerOutputToken?: number;
}

/**
 * LLM configuration parameters
 */
export interface LLMConfig {
  /** Temperature (0-2) */
  temperature: number;
  /** Maximum tokens to generate */
  maxTokens: number;
  /** Top P sampling */
  topP?: number;
  /** Frequency penalty */
  frequencyPenalty?: number;
  /** Presence penalty */
  presencePenalty?: number;
}

// ============================================================================
// Team Types
// ============================================================================

/**
 * Team member information
 */
export interface TeamMember {
  /** Member user ID */
  id: string;
  /** Member name */
  name: string;
  /** Member email */
  email: string;
  /** Member avatar */
  avatar: string;
  /** Member role */
  role: 'owner' | 'admin' | 'member';
  /** Join date */
  joinedAt: Date;
  /** Last active timestamp */
  lastActive?: Date;
}

/**
 * Team invitation
 */
export interface TeamInvitation {
  /** Invitation ID */
  id: string;
  /** Invitee email */
  email: string;
  /** Intended role */
  role: 'admin' | 'member';
  /** Invitation status */
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  /** Invitation timestamp */
  sentAt: Date;
  /** Expiration timestamp */
  expiresAt: Date;
}

// ============================================================================
// Billing Types
// ============================================================================

/**
 * User subscription information
 */
export interface Subscription {
  /** Subscription ID */
  id: string;
  /** Plan type */
  plan: 'free' | 'pro' | 'team';
  /** Subscription status */
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  /** Current billing period start */
  currentPeriodStart: Date;
  /** Current billing period end */
  currentPeriodEnd: Date;
  /** Monthly cost in cents */
  monthlyCost: number;
  /** Number of seats (for team plan) */
  seats?: number;
}

/**
 * Usage statistics
 */
export interface UsageStats {
  /** Messages sent this month */
  messagesThisMonth: number;
  /** Message limit for current plan */
  messageLimit: number;
  /** Total tokens used this month */
  tokensUsed: number;
  /** Storage used in bytes */
  storageUsed: number;
  /** Number of conversations */
  conversationCount: number;
  /** Number of custom assistants */
  customAssistantCount: number;
}

// ============================================================================
// Preferences Types
// ============================================================================

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** Theme preference */
  theme: 'light' | 'dark' | 'auto';
  /** Default workflow */
  defaultWorkflow?: string;
  /** Default assistants */
  defaultAssistants?: string[];
  /** Default LLM */
  defaultLLM?: string;
  /** Email notifications enabled */
  emailNotifications: boolean;
  /** Browser notifications enabled */
  browserNotifications: boolean;
  /** Auto-save conversations */
  autoSave: boolean;
  /** Show keyboard shortcuts */
  showShortcuts: boolean;
  /** Compact mode */
  compactMode: boolean;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Context piece for Context Builder
 */
export interface ContextPiece {
  /** Context piece ID */
  id: string;
  /** Context type */
  type: 'text' | 'file' | 'link' | 'image';
  /** Context content */
  content: string;
  /** Display title */
  title?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Application page identifiers
 */
export type Page =
  | 'signup'
  | 'home'
  | 'conversation'
  | 'context'
  | 'workflow'
  | 'workflow-editor'
  | 'preferences'
  | 'billing'
  | 'llms'
  | 'team'
  | 'account'
  | 'assistant-creator'
  | 'ai-assistants'
  | 'projects'
  | string; // Allow dynamic pages like 'ai-assistant-editor-{id}'

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
  };
}

/**
 * API Error response
 */
export interface ApiError {
  success: false;
  error: {
    code: number | string;
    message: string;
    timestamp?: string;
    path?: string;
  };
}

// ============================================================================
// API Conversation Types (matches database schema)
// ============================================================================

/**
 * Conversation from API (matches database schema)
 */
export interface ApiConversation {
  id: string;
  user_id: string;
  project_id?: string;
  team_id?: string;
  title: string;
  prompt: string;
  workflow_id?: string;
  selected_assistants: string[];
  selected_llm: string;
  context_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create conversation DTO
 */
export interface CreateConversationDto {
  title: string;
  prompt: string;
  workflowId?: string;
  selectedAssistants?: string[];
  selectedLlm?: string;
  projectId?: string;
  teamId?: string;
  contextId?: string;
}

/**
 * Update conversation DTO
 */
export interface UpdateConversationDto {
  title?: string;
  status?: string;
  selectedAssistants?: string[];
  selectedLlm?: string;
  projectId?: string;
}

// ============================================================================
// API Message Types (matches database schema)
// ============================================================================

/**
 * Message from API (matches database schema)
 */
export interface ApiMessage {
  id: string;
  conversation_id: string;
  assistant_id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  token_count?: number;
  model_used?: string;
  created_at: string;
}

/**
 * Create message DTO
 */
export interface CreateMessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistantId?: string;
  metadata?: Record<string, any>;
  modelUsed?: string;
  tokenCount?: number;
}

/**
 * Generate message DTO
 */
export interface GenerateMessageDto {
  content: string;
  assistantId?: string;
}

/**
 * Generate message response
 */
export interface GenerateMessageResponse {
  userMessage: ApiMessage;
  assistantMessage: ApiMessage;
  usage: {
    tokens: {
      prompt: number;
      completion: number;
      total: number;
    };
    cost: number;
    model: string;
    provider: string;
  };
}

/**
 * Generate multiple responses
 */
export interface GenerateMultipleResponse {
  userMessage: ApiMessage;
  assistantMessages: ApiMessage[];
  usage: Array<{
    tokens: {
      prompt: number;
      completion: number;
      total: number;
    };
    cost: number;
    model: string;
    provider: string;
  }>;
}

// ============================================================================
// API Assistant Types (matches database schema)
// ============================================================================

/**
 * Assistant from API (matches database schema)
 */
export interface ApiAssistant {
  id: string;
  user_id?: string;
  team_id?: string;
  name: string;
  description?: string;
  avatar_url?: string;
  color?: string;
  system_prompt: string;
  personality: Record<string, any>;
  is_custom: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Create assistant DTO
 */
export interface CreateAssistantDto {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  color?: string;
  systemPrompt: string;
  personality: Record<string, any>;
  isCustom?: boolean;
  isDefault?: boolean;
  teamId?: string;
}

/**
 * Update assistant DTO
 */
export interface UpdateAssistantDto {
  name?: string;
  description?: string;
  avatarUrl?: string;
  color?: string;
  systemPrompt?: string;
  personality?: Record<string, any>;
}

// ============================================================================
// API User Types (matches database schema)
// ============================================================================

/**
 * User profile from API (matches database schema)
 */
export interface ApiUser {
  id: string;
  name?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Update user DTO
 */
export interface UpdateUserDto {
  name?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
}

// ============================================================================
// API Team Types (matches database schema)
// ============================================================================

/**
 * Team from API (matches database schema)
 */
export interface ApiTeam {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

/**
 * Team member from API (matches database schema)
 */
export interface ApiTeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joined_at: string;
}

/**
 * Create team DTO
 */
export interface CreateTeamDto {
  name: string;
}

/**
 * Update team DTO
 */
export interface UpdateTeamDto {
  name?: string;
}

/**
 * Add team member DTO
 */
export interface AddTeamMemberDto {
  email: string;
  role: 'admin' | 'member';
}

// ============================================================================
// API Project Types (matches database schema)
// ============================================================================

/**
 * Project from API (matches database schema)
 */
export interface ApiProject {
  id: string;
  user_id: string;
  team_id?: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create project DTO
 */
export interface CreateProjectDto {
  name: string;
  description?: string;
  teamId?: string;
}

/**
 * Update project DTO
 */
export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: string;
}

// ============================================================================
// API Context Types (matches database schema)
// ============================================================================

/**
 * Context from API (matches database schema)
 */
export interface ApiContext {
  id: string;
  user_id: string;
  project_id?: string;
  team_id?: string;
  name: string;
  content: string;
  type: 'user' | 'system' | 'project' | 'team';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Create context DTO
 */
export interface CreateContextDto {
  name: string;
  content: string;
  type: 'user' | 'system' | 'project' | 'team';
  projectId?: string;
  teamId?: string;
}

/**
 * Update context DTO
 */
export interface UpdateContextDto {
  name?: string;
  content?: string;
  isActive?: boolean;
}

// ============================================================================
// API Workflow Types (matches database schema)
// ============================================================================

/**
 * Workflow from API (matches database schema)
 */
export interface ApiWorkflow {
  id: string;
  user_id?: string;
  team_id?: string;
  name: string;
  description?: string;
  icon?: string;
  steps: any; // JSONB
  is_custom: boolean;
  is_default: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Create workflow DTO
 */
export interface CreateWorkflowDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  steps: any;
  isCustom?: boolean;
  teamId?: string;
}

/**
 * Update workflow DTO
 */
export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  icon?: string;
  steps?: any;
}

// ============================================================================
// API Subscription Types (matches database schema)
// ============================================================================

/**
 * Subscription from API (matches database schema)
 */
export interface ApiSubscription {
  id: string;
  user_id: string;
  team_id?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API Usage Tracking Types (matches database schema)
// ============================================================================

/**
 * Usage tracking from API (matches database schema)
 */
export interface ApiUsageTracking {
  id: string;
  user_id: string;
  team_id?: string;
  conversation_id?: string;
  metric_type: 'conversation' | 'message' | 'token';
  count: number;
  cost_usd: number;
  model_used?: string;
  provider?: string;
  metadata?: Record<string, any>;
  created_at: string;
}


