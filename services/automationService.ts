import { 
  Lead, Account, Opportunity, Delivery, Activity, LeadStatus
} from '../types';

const DB_KEY = 'voxmation_db';

const getDB = () => {
  const dbStr = localStorage.getItem(DB_KEY);
  const db = dbStr ? JSON.parse(dbStr) : {};
  return {
    leads: [],
    accounts: [],
    opportunities: [],
    deliveries: [],
    activities: [],
    ...db
  };
};

const saveDB = (db: any) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('voxmation_db_update'));
};

export const AutomationService = {
  logFollowUpActivity: (lead: Lead, content: string) => {
    const db = getDB();
    const now = new Date().toISOString();
    
    const newAct: Activity = {
      id: `act-${Math.random().toString(36).substring(2, 7)}`,
      type: 'Email',
      dateTime: now,
      ownerId: lead.ownerId,
      accountId: lead.linkedAccountId || 'unlinked',
      outcome: 'Neural AI Follow-up Sent',
      notes: `Automated re-engagement draft generated and sent. Excerpt: ${content.substring(0, 80)}...`
    };
    
    db.activities.push(newAct);
    
    // Reset inactivity monitor by updating lastInteraction
    db.leads = db.leads.map((l: Lead) => 
      l.id === lead.id ? { ...l, lastInteraction: now, status: l.status === 'New' ? 'Engaged' : l.status } : l
    );
    
    saveDB(db);
  },

  convertLeadToDeal: (leadId: string) => {
    const db = getDB();
    const lead = db.leads.find((l: Lead) => l.id === leadId);
    if (!lead) return;

    const newDeal: Opportunity = {
      id: `opp-${Math.random().toString(36).substring(2, 7)}`,
      name: `${lead.company || lead.name} — Expansion`,
      accountId: lead.linkedAccountId || '',
      accountName: lead.company || lead.name,
      stage: 'Discovery',
      amount: 5000,
      mrr: 1000,
      closeDateTarget: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 20,
      ownerId: lead.ownerId,
      nextStep: 'Qualification Call',
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    };

    db.opportunities.push(newDeal);
    db.leads = db.leads.map((l: Lead) => l.id === leadId ? { ...l, convertedDealId: newDeal.id, status: 'Qualified' as LeadStatus } : l);
    saveDB(db);
  },

  handleClosedWon: (dealId: string) => {
    const db = getDB();
    const deal = db.opportunities.find((o: Opportunity) => o.id === dealId);
    if (!deal) return;

    const newDelivery: Delivery = {
      id: `del-${Math.random().toString(36).substring(2, 7)}`,
      name: `${deal.accountName} — Implementation`,
      accountId: deal.accountId,
      accountName: deal.accountName,
      dealId: deal.id,
      packageTier: 'Pro',
      status: 'Planning',
      stage: 'Planning',
      priority: 'Standard',
      ownerId: 'usr-1',
      startDate: new Date().toISOString().split('T')[0],
      goLiveTargetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      riskLevel: 'Low',
      escalationFlag: false,
      handoffToCsDone: false,
      checklistProgress: 0,
      onTime: true,
      qaStatus: 'Pending',
      promisedTimeline: '14d'
    };
    db.deliveries.push(newDelivery);
    saveDB(db);
  },

  runHealthAudit: () => {
    const db = getDB();
    db.accounts = db.accounts.map((acc: any) => {
      let score = 80;
      return { ...acc, healthScore: score, healthStatus: 'Green' };
    });
    saveDB(db);
  }
};