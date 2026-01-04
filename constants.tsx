
import React from 'react';
import { Lead, Account, Opportunity, Delivery, Contact, Activity, SupportTicket, Subscription } from './types';
import { 
  Users, LayoutDashboard, Briefcase, Building2, 
  BarChart3, FileText, Settings, HelpCircle, 
  TrendingUp, Calendar, Zap, CreditCard, Rocket, BookOpen, ShieldAlert
} from 'lucide-react';

export const MOCK_LEADS: Lead[] = [
  { 
    id: 'l1', 
    name: 'Alex Thompson', 
    email: 'alex@techflow.io', 
    company: 'TechFlow', 
    phone: '+1 555-0123',
    status: 'Qualified', 
    ownerId: 'usr-1', 
    createdAt: '2023-10-24T10:00:00Z',
    firstTouchDate: '2023-10-24T10:00:00Z',
    lastInteraction: '2023-10-25T14:00:00Z',
    nextAction: 'Respond Now', 
    dnaScore: 85, 
    sourceDetail: 'IG Ads – Black Friday Campaign',
    channel: 'Instagram',
    niche: 'Fintech',
    icpFit: 'A',
    urgency: 'Now (0–7 days)',
    temperature: 'Hot',
    language: 'EN',
    tags: ['Hot Lead', 'Wants Voice'],
    slaBreach: false,
    painPoints: ['delayed response times'],
    source: 'IG Ads'
  }
];

export const MOCK_ACCOUNTS: Account[] = [
  { 
    id: 'acc1', 
    name: 'Acme Corp', 
    domain: 'acme.com',
    status: 'Active',
    lifecycle: 'Customer—Active',
    industry: 'Manufacturing', 
    size: '50+', 
    primaryContact: 'Jane Smith',
    healthScore: 92,
    healthStatus: 'Green',
    revenue: 1200000, 
    mrr: 5000, 
    plan: 'Enterprise', 
    csOwner: 'John CS',
    salesOwner: 'Alice Sales',
    deliveryOwner: 'Bob Delivery',
    createdAt: '2023-01-15',
    renewalDate: '2025-01-15',
    acquisitionSource: 'Inbound - Website Form',
    nextBestAction: 'Schedule Quarterly Performance QBR',
    fitScore: 95,
    currentMrr: 5000,
    expansionPotential: 'Med',
    icpTier: 'A'
  }
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'con1',
    accountId: 'acc1',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@acme.com',
    phone: '+1 555-9876',
    roleTitle: 'Head of Operations',
    department: 'Operations',
    isPrimary: true,
    status: 'Active',
    lastContactedAt: '2023-10-20'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    type: 'Meeting',
    dateTime: '2023-10-25T14:00:00Z',
    ownerId: 'usr-1',
    accountId: 'acc1',
    outcome: 'Decision maker approved the prompt draft.',
    notes: 'Meeting with Jane to review the Voice AI scripts.'
  }
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'tix1',
    accountId: 'acc1',
    severity: 'Medium',
    status: 'Open',
    category: 'Integration',
    openedAt: '2023-10-26T09:00:00Z',
    lastUpdatedAt: '2023-10-26T11:00:00Z',
    ownerId: 'usr-1',
    slaDueAt: '2023-10-27T09:00:00Z',
    summary: 'WhatsApp sync delay on legacy CRM'
  }
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub1',
    accountId: 'acc1',
    plan: 'Enterprise',
    mrr: 5000,
    billingCycle: 'Monthly',
    status: 'Active',
    startDate: '2023-01-15',
    renewalDate: '2024-01-15',
    lastPaymentDate: '2023-10-15',
    nextInvoiceDate: '2023-11-15'
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  { 
    id: 'opp1', 
    accountId: 'acc1', 
    accountName: 'Acme Corp', 
    name: 'Acme Corp – Expansion', 
    stage: 'Discovery', 
    package: 'Enterprise', 
    amount: 2000,
    mrr: 2000, 
    probability: 30, 
    forecastCloseDate: '2023-12-15', 
    closeDateTarget: '2023-12-15',
    createdAt: '2023-10-24T10:00:00Z',
    ownerId: 'usr-1', 
    nextStep: 'Qualify expansion need'
  }
];

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'del1',
    name: 'Acme Voice Automation',
    accountId: 'acc1',
    accountName: 'Acme Corp',
    opportunityId: 'opp1',
    status: 'In Progress',
    stage: 'In Progress',
    packageTier: 'Enterprise',
    priority: 'Standard',
    ownerId: 'usr-1',
    startDate: '2023-10-25',
    goLiveTargetDate: '2023-11-15',
    dueDate: '2023-11-20',
    riskLevel: 'Low',
    qaStatus: 'In QA',
    waAccess: 'Received',
    igAccess: 'Needed',
    twilioAccess: 'Received',
    crmAccess: 'Received',
    escalationFlag: false,
    handoffToCsDone: false,
    checklistProgress: 45,
    onTime: true,
    promisedTimeline: '14d',
    dealId: 'opp1'
  }
];

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { label: 'Leads', icon: <Users size={20} />, path: '/dashboard/leads' },
  { label: 'Accounts', icon: <Building2 size={20} />, path: '/dashboard/accounts' },
  { label: 'Contacts', icon: <Users size={20} />, path: '/dashboard/contacts' },
  { label: 'Activities', icon: <Calendar size={20} />, path: '/dashboard/activities' },
  { label: 'Opportunities', icon: <Briefcase size={20} />, path: '/dashboard/opportunities' },
  { label: 'Delivery', icon: <Rocket size={20} />, path: '/dashboard/delivery' },
  { label: 'Support', icon: <ShieldAlert size={20} />, path: '/dashboard/support' },
  { label: 'Revenue Command', icon: <Zap size={20} />, path: '/dashboard/opportunities/revenue-command' },
  { label: 'Reports', icon: <BarChart3 size={20} />, path: '/dashboard/reports' },
  { label: 'Billing', icon: <CreditCard size={20} />, path: '/dashboard/billing' },
  { label: 'Wiki', icon: <BookOpen size={20} />, path: '/dashboard/wiki' }
];
