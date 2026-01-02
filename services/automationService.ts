
import { 
  Lead, Account, Opportunity, Delivery, 
  Subscription, SupportTicket, PlaybookInstance, PlaybookTask, Milestone, Activity
} from '../types';

const DB_KEY = 'voxmation_db';

// Fixed getDB to provide default empty arrays for all collections to prevent 'undefined' errors
const getDB = () => {
  const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  return {
    leads: [],
    accounts: [],
    opportunities: [],
    deliveries: [],
    contacts: [],
    activities: [],
    tickets: [],
    subscriptions: [],
    milestones: []
    ...db
  };
};

const saveDB = (db: any) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('voxmation_db_update'));
};

export const AutomationService = {
  /**
   * A1: Lead Created -> Dedupe + Link to Account
   */
  handleLeadCreated: (leadId: string) => {
    const db = getDB();
    const lead = db.leads.find((l: Lead) => l.id === leadId);
    if (!lead || !lead.email) return;

    const domain = lead.email.split('@')[1];
    const matchedAccount = db.accounts.find((acc: Account) => acc.domain === domain);
    
    if (matchedAccount) {
      db.leads = db.leads.map((l: Lead) => 
        l.id === leadId ? { ...l, linkedAccountId: matchedAccount.id } : l
      );
      // Fixed: Replaced 'this' with 'AutomationService' to fix undefined context
      AutomationService.logActivity(db, {
        type: 'Task',
        ownerId: 'SYSTEM',
        accountId: matchedAccount.id,
        outcome: 'Auto-Link',
        notes: `Lead ${lead.name} auto-linked to Account ${matchedAccount.name} via domain match.`
      });
    }
    saveDB(db);
  },

  /**
   * A2: Lead Qualified -> Create Deal
   */
  convertLeadToDeal: (leadId: string) => {
    const db = getDB();
    const lead = db.leads.find((l: Lead) => l.id === leadId);
    if (!lead || lead.status !== 'Qualified') return;

    const newDeal: Opportunity = {
      id: `opp-${Math.random().toString(36).substr(2, 5)}`,
      name: `${lead.company || lead.name} — AI Implementation`,
      accountId: lead.linkedAccountId || '',
      accountName: lead.company || lead.name,
      stage: 'Discovery',
      amount: 5000, // Initial estimate
      mrr: 1000,
      closeDateTarget: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 20,
      ownerId: lead.ownerId,
      nextStep: 'Discovery Call',
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    };

    db.opportunities.push(newDeal);
    db.leads = db.leads.map((l: Lead) => l.id === leadId ? { ...l, convertedDealId: newDeal.id } : l);
    saveDB(db);
    // Fixed: Replaced 'this' with 'AutomationService'
    AutomationService.runA10(newDeal.accountId);
  },

  /**
   * A3: Deal Stage Change -> Log Activity
   */
  handleDealStageChange: (dealId: string, newStage: string) => {
    const db = getDB();
    const deal = db.opportunities.find((o: Opportunity) => o.id === dealId);
    if (!deal) return;

    // Fixed: Replaced 'this' with 'AutomationService'
    AutomationService.logActivity(db, {
      type: 'Task',
      ownerId: deal.ownerId,
      accountId: deal.accountId,
      dealId: deal.id,
      outcome: 'Stage Update',
      notes: `Deal stage advanced to: ${newStage}`
    });
    saveDB(db);
  },

  /**
   * A4: Closed Won -> Delivery + Onboarding
   */
  handleClosedWon: (dealId: string) => {
    const db = getDB();
    const deal = db.opportunities.find((o: Opportunity) => o.id === dealId);
    if (!deal) return;

    // 1. Create Delivery Instance
    const newDelivery: Delivery = {
      id: `del-${Math.random().toString(36).substr(2, 5)}`,
      name: `${deal.accountName} — Neural Deployment`,
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

    // 2. Set Standard Milestones
    const milestones: Milestone[] = [
      { id: `mil-1-${newDelivery.id}`, deliveryId: newDelivery.id, name: 'Kickoff Sync', ownerId: 'usr-1', dueDate: new Date().toISOString().split('T')[0], status: 'Not Started' },
      { id: `mil-2-${newDelivery.id}`, deliveryId: newDelivery.id, name: 'Prompt Engineering', ownerId: 'usr-1', dueDate: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0], status: 'Not Started' },
      { id: `mil-3-${newDelivery.id}`, deliveryId: newDelivery.id, name: 'Final QA & Go-Live', ownerId: 'usr-1', dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0], status: 'Not Started' }
    ];
    db.milestones = [...(db.milestones || []), ...milestones];

    // 3. Update Account Lifecycle
    db.accounts = db.accounts.map((acc: Account) => {
      if (acc.id === deal.accountId) {
        return { 
          ...acc, 
          lifecycle: 'Customer—Onboarding', 
          status: 'Active', 
          mrr: acc.mrr + deal.mrr,
          nextBestAction: 'Schedule Project Kickoff'
        };
      }
      return acc;
    });

    saveDB(db);
  },

  /**
   * A5: Delivery "Live" -> Account Lifecycle "Active"
   */
  handleDeliveryLive: (deliveryId: string) => {
    const db = getDB();
    const del = db.deliveries.find((d: Delivery) => d.id === deliveryId);
    if (!del || del.stage !== 'Live') return;

    db.accounts = db.accounts.map((acc: Account) => 
      acc.id === del.accountId ? { ...acc, lifecycle: 'Customer—Active' } : acc
    );
    saveDB(db);
  },

  /**
   * A6: Critical Ticket -> Health Penalty
   */
  handleCriticalTicket: (ticketId: string) => {
    const db = getDB();
    const tix = db.tickets.find((t: SupportTicket) => t.id === ticketId);
    if (!tix || tix.severity !== 'Critical') return;

    db.accounts = db.accounts.map((acc: Account) => {
      if (acc.id === tix.accountId) {
        return { ...acc, healthScore: Math.max(0, acc.healthScore - 25), healthStatus: 'Red' };
      }
      return acc;
    });
    saveDB(db);
  },

  /**
   * A7: Billing Past Due -> Block Delivery
   */
  handlePastDueBilling: (accountId: string) => {
    const db = getDB();
    db.deliveries = db.deliveries.map((del: Delivery) => 
      del.accountId === accountId ? { ...del, status: 'Blocked', riskLevel: 'High' } : del
    );
    saveDB(db);
  },

  /**
   * A8: Neural Health Audit (Recalculate Everything)
   */
  runHealthAudit: () => {
    const db = getDB();
    db.accounts = db.accounts.map((acc: Account) => {
      let score = 85; // Starting base
      
      const tickets = db.tickets.filter((t: any) => t.accountId === acc.id && t.status !== 'Resolved');
      const delivery = db.deliveries.find((d: any) => d.accountId === acc.id);
      const pastDue = db.subscriptions.some((s: any) => s.accountId === acc.id && s.status === 'Past Due');

      if (pastDue) score -= 40;
      score -= (tickets.filter((t: any) => t.severity === 'Critical').length * 20);
      score -= (tickets.filter((t: any) => t.severity === 'High').length * 10);
      if (delivery?.riskLevel === 'High') score -= 15;
      
      const finalScore = Math.max(0, Math.min(100, score));
      return { 
        ...acc, 
        healthScore: finalScore, 
        healthStatus: finalScore >= 80 ? 'Green' : finalScore >= 55 ? 'Yellow' : 'Red',
        lifecycle: finalScore < 50 ? 'At Risk' : acc.lifecycle
      };
    });
    saveDB(db);
  },

  /**
   * A9: Renewal Engine
   */
  checkRenewals: () => {
    const db = getDB();
    const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    db.accounts.forEach((acc: Account) => {
      if (acc.renewalDate && acc.renewalDate <= sixtyDaysFromNow) {
        // Check if renewal deal already exists
        const exists = db.opportunities.some((o: Opportunity) => o.accountId === acc.id && o.name.includes('Renewal'));
        if (!exists) {
          db.opportunities.push({
            id: `renew-${acc.id}`,
            name: `${acc.name} — Annual Renewal`,
            accountId: acc.id,
            accountName: acc.name,
            stage: 'Qualified',
            amount: acc.mrr * 12,
            mrr: acc.mrr,
            closeDateTarget: acc.renewalDate,
            probability: 80,
            ownerId: acc.salesOwner || 'usr-1',
            nextStep: 'Renewal Discussion',
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    saveDB(db);
  },

  /**
   * A10: universal Activity Pulse
   */
  runA10: (accountId: string) => {
    const db = getDB();
    const now = new Date().toISOString();
    db.accounts = db.accounts.map((acc: Account) => acc.id === accountId ? { ...acc, lastActivityAt: now } : acc);
    saveDB(db);
  },

  // Helper
  logActivity: (db: any, act: Partial<Activity>) => {
    const newAct = {
      id: `act-${Math.random().toString(36).substr(2, 5)}`,
      dateTime: new Date().toISOString()
      ...act
    } as Activity;
    db.activities.push(newAct);
  },

  logFollowUpActivity: (lead: Lead, content: string) => {
    const db = getDB();
    const newAct: Activity = {
      id: `act-${Math.random().toString(36).substr(2, 5)}`,
      type: 'Email',
      dateTime: new Date().toISOString(),
      ownerId: lead.ownerId,
      accountId: lead.linkedAccountId || 'unlinked',
      outcome: 'Follow-up Sent',
      notes: `AI Follow-up: ${content.substring(0, 50)}...`
    };
    db.activities.push(newAct);
    db.leads = db.leads.map((l: Lead) => l.id === lead.id ? { ...l, lastInteraction: new Date().toISOString() } : l);
    saveDB(db);
  }
};
