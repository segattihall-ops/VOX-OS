
export type LeadChannel = 'WhatsApp' | 'Instagram' | 'Webchat' | 'Phone' | 'Email' | 'LinkedIn' | 'Referral';
export type UTMMedium = 'cpc' | 'paid_social' | 'organic_social' | 'seo' | 'referral' | 'email' | 'direct' | 'affiliate' | 'partners' | 'event' | 'cold_outreach';
export type LeadStatus = 'New' | 'Engaged' | 'Qualified' | 'Disqualified' | 'Nurture';
export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export type OpportunityStage = 'Discovery' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type LossReason = 'Budget' | 'Timing' | 'No Fit' | 'Competitor' | 'No Decision' | 'Ghosted' | 'Technical limitation' | 'Compliance constraints';

export type DeliveryStatus = 'Planning' | 'In Progress' | 'QA' | 'Live' | 'Monitoring (7d)' | 'Completed' | 'Blocked';
export type BlockerType = 'Missing access' | 'Client delay' | 'Billing' | 'Scope creep' | 'Integration issue' | 'Internal capacity';
export type DeliveryPriority = 'Standard' | 'Priority';
export type RiskLevel = 'Low' | 'Med' | 'High';

export type AccountStatus = 'Prospect' | 'Active' | 'Paused' | 'Churned' | 'Partner';
export type AccountLifecycle = 'Target' | 'Engaged' | 'Qualified' | 'Proposal Sent' | 'Customer—Onboarding' | 'Customer—Active' | 'Customer—Expansion' | 'At Risk' | 'Churned' | 'Partner';
export type ICPTier = 'A' | 'B' | 'C';

export type TicketStatus = 'Open' | 'In Progress' | 'Waiting on Client' | 'Resolved';
export type TicketSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Bug' | 'Integration' | 'Billing' | 'Feature Request' | 'Training/How-to';

export type ActivityType = 'Call' | 'Meeting' | 'Email' | 'WhatsApp' | 'Task';
export type PackagePlan = 'Essential' | 'Pro' | 'Enterprise';
export type BillingCycle = 'Monthly' | 'Annual';
export type SubscriptionStatus = 'Active' | 'Past Due' | 'Canceled';

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleTitle: string;
  department: string;
  linkedin?: string;
  isPrimary: boolean;
  status: 'Active' | 'Left' | 'Unknown';
  lastContactedAt?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  dateTime: string;
  ownerId: string;
  accountId: string;
  contactId?: string;
  dealId?: string;
  deliveryId?: string;
  outcome: string;
  notes: string;
  nextActionDate?: string;
}

export interface SupportTicket {
  id: string;
  accountId: string;
  deliveryId?: string;
  severity: TicketSeverity;
  status: TicketStatus;
  category: TicketCategory;
  openedAt: string;
  lastUpdatedAt: string;
  ownerId: string;
  slaDueAt: string;
  summary: string;
}

export interface Subscription {
  id: string;
  accountId: string;
  plan: string;
  mrr: number;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string;
  lastPaymentDate: string;
  nextInvoiceDate: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: string;
  channel: LeadChannel;
  campaignUTM?: string;
  status: LeadStatus;
  temperature: LeadTemperature;
  notes?: string;
  createdAt: string;
  linkedAccountId?: string;
  linkedContactId?: string;
  convertedDealId?: string;
  dnaScore: number;
  icpFit: ICPTier;
  urgency: string;
  painPoints: string[];
  ownerId: string;
  firstTouchDate?: string;
  lastInteraction?: string;
  nextAction?: string;
  sourceDetail?: string;
  niche?: string;
  mainPain?: string;
  language?: 'PT' | 'EN';
  tags?: string[];
  slaBreach?: boolean;
  authority?: string;
  budgetRange?: string;
  companySize?: string;
  leadVolume?: string;
  currentStack?: string[];
  conversationSummary?: string;
  website?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  primaryContactId?: string;
  stage: OpportunityStage;
  amount: number;
  mrr: number;
  closeDateTarget: string;
  probability: number;
  ownerId: string;
  lastActivityAt?: string;
  nextStep: string;
  lossReason?: LossReason;
  createdAt: string;
  closedAt?: string;
  package?: string;
  forecastCloseDate?: string;
}

export interface Account {
  id: string;
  name: string;
  domain: string;
  website?: string;
  industry: string;
  size: 'Solo' | '2–10' | '11–50' | '50+';
  lifecycle: AccountLifecycle;
  status: AccountStatus;
  icpTier: ICPTier;
  fitScore: number;
  healthScore: number;
  healthStatus: 'Green' | 'Yellow' | 'Red';
  salesOwner: string;
  deliveryOwner: string;
  csOwner: string;
  createdAt: string;
  lastActivityAt?: string;
  currentMrr: number;
  renewalDate: string;
  expansionPotential: 'Low' | 'Med' | 'High';
  mrr: number;
  plan: string;
  revenue?: number;
  primaryContact?: string;
  acquisitionSource?: string;
  nextBestAction?: string;
}

export interface Milestone {
  id: string;
  deliveryId: string;
  name: string;
  ownerId: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Waiting' | 'Done';
  acceptanceCriteria?: string;
  blocker?: string;
}

export interface Delivery {
  id: string;
  name: string;
  accountId: string;
  dealId: string;
  packageTier: PackagePlan;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  ownerId: string;
  startDate: string;
  goLiveTargetDate: string;
  completedDate?: string;
  riskLevel: RiskLevel;
  blockerType?: BlockerType;
  escalationFlag: boolean;
  handoffToCsDone: boolean;
  stage: DeliveryStatus;
  accountName: string;
  checklistProgress: number;
  dueDate: string;
  onTime: boolean;
  qaStatus: string;
  promisedTimeline: string;
  businessSummary?: string;
  offerSummary?: string;
  qaPassRate?: number;
  kpiSlaResponse?: string;
  kpiQualifiedRate?: string;
  kpiMeetingRate?: string;
  outcomeTarget?: string;
  primaryChannel?: string;
  successMetric?: string;
  opportunityId?: string;
  waAccess?: string;
  igAccess?: string;
  twilioAccess?: string;
  crmAccess?: string;
  gCalAccess?: string;
}

export interface PlaybookTemplate {
  id: string;
  name: string;
  trigger: 'Closed Won' | 'Health Red' | 'Renewal' | 'Manual';
  appliesTo: 'Account' | 'Delivery';
}

export interface PlaybookInstance {
  id: string;
  templateId: string;
  relatedId: string;
  ownerId: string;
  status: 'Active' | 'Completed';
  createdAt: string;
}

export interface PlaybookTask {
  id: string;
  instanceId: string;
  name: string;
  ownerId: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}
