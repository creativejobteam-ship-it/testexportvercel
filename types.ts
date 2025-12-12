

export enum Platform {
  Twitter = 'Twitter',
  Discord = 'Discord',
  Slack = 'Slack',
  Facebook = 'Facebook',
  WhatsApp = 'WhatsApp',
  LinkedIn = 'LinkedIn',
  TikTok = 'TikTok',
  Instagram = 'Instagram',
  Pinterest = 'Pinterest',
  YouTube = 'YouTube',
  GoogleBusiness = 'Google Business',
  Telegram = 'Telegram',
  Mastodon = 'Mastodon',
  WordPress = 'WordPress',
  Snapchat = 'Snapchat'
}

export interface BrandSettings {
  name: string;
  logo: string;
  primaryColor: string;
  website: string;
  toneOfVoice: string;
  targetAudience: string;
  competitors: string[];
  objectives: string;
  resources: string;
}

export interface Message {
  id: string;
  author: string;
  avatar: string;
  platform: Platform;
  content: string;
  timestamp: string;
  status: 'pending' | 'replied' | 'flagged';
  sentiment?: 'positive' | 'neutral' | 'negative';
  aiReplyDraft?: string;
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  scheduledDate: string; // ISO string
  status: 'draft' | 'scheduled' | 'published';
}

export interface CalendarPost {
  id: number;
  projectId?: string;
  projectName?: string;
  platform: Platform;
  content: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Draft' | 'Published';
  day: number;
}

export interface ModerationItem {
    id: number;
    author: string;
    content: string;
    platform: Platform;
    reason: string;
    score: number;
    time: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Community {
  id: string;
  name: string;
  platform: Platform;
  icon: string;
  members: number;
  activeMembers: number;
  automationStatus: 'active' | 'paused';
  postsToday: number;
  description: string;
}

export interface ActionItem {
  id: string;
  task: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Strategy {
  id: string;
  // UI Display Fields
  clientId?: string;
  clientName?: string;
  clientAvatar?: string;
  domain?: string;
  periodStart?: string;
  periodEnd?: string;
  performanceScore?: number; // 0-100
  
  month: string;
  year: number;
  theme: string;
  goals: string[];
  contentPillars: string[];
  actionPlan: ActionItem[];
  status: 'active' | 'archived' | 'draft' | 'completed';

  // Document Fields
  executiveSummary?: string;
  kpis?: { label: string; value: string }[];
}

export interface QuestionnaireData {
  objectives: string;
  kpis: string;
  targets: string;
  competitors: string;
  resources: string;
}

// --- Advanced Strategy Module Architecture ---

export type QuestionType = 'text' | 'textarea' | 'select' | 'multi-select' | 'number' | 'date' | 'url' | 'file' | 'multi-file' | 'boolean' | 'color' | 'color_palette' | 'radio' | 'segmented';

export interface QuestionDefinition {
  id: string; // unique slug (e.g., "cuisine_type")
  label: string;
  type: QuestionType;
  options?: string[]; // For select/multi-select
  placeholder?: string;
  required: boolean;
  order: number;
  section?: string; // 'General' | 'Specific' | 'Instagram' | 'Launch' etc.
  helperText?: string;
}

export interface ActivityDomain {
  id: string;
  name: string; // e.g. "Restoration"
  slug: string; // e.g. "restoration"
  description?: string;
  domainTemplate: QuestionDefinition[]; 
  createdAt: string;
  updatedAt: string;
}

// --- Project Types Management ---
export interface ProjectType {
  id: string;
  name: string; // e.g. "E-commerce Site"
  description?: string;
}

// --- NEW COMPOSITE BRIEFING TYPES ---

export type BriefingModuleType = 'DOMAIN' | 'PLATFORM' | 'CONTEXT';
export type ProjectContextType = 'NEW_LAUNCH' | 'MAINTENANCE' | 'REBRANDING' | 'EVENT_PROMOTION' | 'CRISIS_MANAGEMENT';

export interface BriefingModule {
  id: string;
  type: BriefingModuleType;
  triggerKey: string; // e.g., 'instagram', 'restaurant', 'NEW_LAUNCH'
  title: string;
  description: string;
  questions: QuestionDefinition[];
}

export interface CompositeBriefingSchema {
  sections: {
    title: string;
    description?: string;
    moduleType: BriefingModuleType;
    questions: QuestionDefinition[];
  }[];
}

// --- BRIEFING WORKFLOW MANAGEMENT ---

export type BriefingStatus = 'DRAFT' | 'SENT' | 'COMPLETED';

export interface BriefingRecord {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  
  // Configuration Snapshot (To re-generate schema correctly)
  config: {
    domainName: string;
    context: ProjectContextType;
    platforms: Platform[];
  };

  status: BriefingStatus;
  token: string; // Secure ID for public link
  generatedLink: string;
  
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
  
  answers?: Record<string, any>;
  locked?: boolean;
}

// -------------------------------------

export interface BriefResponse {
  id: string;
  clientId: string;
  clientName?: string; // For display convenience
  projectId?: string; // Link to specific project
  domainId: string;
  domainName?: string; // For display convenience
  answers: Record<string, string | number | string[]>;
  submittedAt: string;
  status: 'draft' | 'new' | 'reviewed' | 'converted';
  // New: Store context of brief
  projectContext?: ProjectContextType;
  targetNetworks?: Platform[];
}

export interface GeneratedStrategy {
  id: string;
  briefResponseId: string;
  executiveSummary: string;
  targetAudienceAnalysis: string;
  contentPillars: {
    title: string;
    description: string;
    keywords: string[];
  }[];
  toneOfVoice: string;
  platformStrategy: {
    platform: string;
    frequency: string;
    formatFocus: string;
  }[];
  isApproved: boolean;
  generatedAt: string;
}

export interface ActionTask {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'done';
  dueDate?: string;
  platform?: Platform;
  priority: 'low' | 'medium' | 'high';
}

export interface ActionPlan {
  id: string;
  strategyId: string;
  tasks: ActionTask[];
  createdAt: string;
  updatedAt: string;
}

export type AutopilotRotationPeriod = '15_days' | '1_month' | '3_months' | '6_months';
export type WorkflowStage = 'BRIEF_RECEIVED' | 'AUDIT_SEARCH' | 'STRATEGY_GEN' | 'ACTION_PLAN' | 'PRODUCTION' | 'REPORTING_ROTATION';

export interface Project {
    id: string;
    name: string;
    type?: string; // e.g. 'Société', 'Marque', 'Site Web'
    activitySector?: string; // Specific sector for this project
    clientId?: string;
    clientName?: string;
    status: 'active' | 'completed' | 'planned';
    platformCount: number;
    platforms?: Platform[];
    nextDeadline: string;
    autopilotEnabled?: boolean;
    briefingStatus?: 'not_sent' | 'sent' | 'completed';
    // New fields for Builder
    briefingContext?: ProjectContextType;
    
    // Autopilot Settings (The Brain)
    autopilotSettings?: {
        rotationPeriod: AutopilotRotationPeriod;
        lastRotationDate: string; // ISO
        cycleStartDate: string; // ISO
        currentWorkflowStage: WorkflowStage;
    };
    
    // Audit Results - CRITICAL FOR HANDOFF
    auditResults?: Record<string, AuditResult>;
    
    // Global Research Cache - Prevents re-running search API
    global_research_cache?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  language?: string;
  activities: string; // Keep as fallback or main summary
  country: string;
  city: string;
  questionnaireStatus: 'not_sent' | 'sent' | 'completed';
  autopilotExcluded?: boolean;
  
  // Legacy support
  questionnaireData?: QuestionnaireData;
  generatedStrategy?: any;
  
  // New Architecture
  activityDomainId?: string;
  briefResponseId?: string; // Link to the structured brief response
  
  projects?: Project[]; // Associated projects

  createdAt: string;
}

// --- Autopilot Workflow Types ---

export type AutopilotStage = 
  | 'onboarding' 
  | 'audit_benchmark' 
  | 'strategy' 
  | 'action_plan' 
  | 'editorial_plan' 
  | 'production' 
  | 'analytics';

export interface AutopilotState {
  isEnabled: boolean;
  currentStage: AutopilotStage;
  lastRun: string; // ISO Date
  cycleNumber: number;
  logs: string[];
  previousPeriodKPIs?: {
    reach: string;
    engagement: string;
    conversion: string;
  };
}

// --- Notifications ---

export type NotificationType = 'workflow' | 'system' | 'billing' | 'security' | 'info' | 'success' | 'error' | 'warning';

export interface AppNotification {
    id: string;
    title: string;
    description: string;
    time: string; // Relative string like "2m ago"
    timestamp: string; // ISO Date
    type: NotificationType;
    read: boolean;
    // For Workflow Notifications
    workflowStep?: WorkflowStage;
    projectId?: string;
    projectName?: string;
    actionLabel?: string;
}

// --- Audit & AI Results ---

export interface AuditResult {
    workflowType: string;
    summary: string;
    phase?: 'phase_1' | 'phase_2';
    score?: number;
    sources?: { title: string; url: string }[];
    tables?: { title: string; html: string }[];
    status: 'pending' | 'running' | 'completed' | 'failed';
    completedAt?: string;
}