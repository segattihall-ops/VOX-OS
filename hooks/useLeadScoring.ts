
import { Lead, LeadStatus } from '../types';

export const calculateLeadScore = (lead: Partial<Lead>): { score: number, temperature: Lead['temperature'], stage: LeadStatus } => {
  let score = 0;

  // 1. FIT (0–40 points)
  // ICP Fit (Max 25)
  if (lead.icpFit === 'A') score += 25;
  else if (lead.icpFit === 'B') score += 15;
  else if (lead.icpFit === 'C') score += 5;

  // Company Size (Max 10)
  if (lead.companySize === '50+') score += 10;
  else if (lead.companySize === '11–50') score += 7;
  else if (lead.companySize === '2–10') score += 4;
  else if (lead.companySize === 'Solo') score += 2;

  // Lead Volume (Max 5)
  if (lead.leadVolume === '100+/day') score += 5;
  else if (lead.leadVolume === '31–100/day') score += 4;
  else if (lead.leadVolume === '11–30/day') score += 3;
  else if (lead.leadVolume === '0–10/day') score += 1;

  // 2. INTENT & URGENCY (0–30 points)
  // Urgency Timeline (Max 20)
  if (lead.urgency === 'Now (0–7 days)') score += 20;
  else if (lead.urgency === '30 days') score += 15;
  else if (lead.urgency === '60–90 days') score += 5;

  // Pain Clarity (Max 10)
  const hasPainPoints = lead.painPoints && lead.painPoints.length > 0;
  const hasNotes = lead.notes && lead.notes.length > 20;
  if (hasPainPoints || hasNotes) score += 10;

  // 3. AUTHORITY & BUDGET (0–30 points)
  // Authority (Max 15)
  if (lead.authority === 'Decision maker') score += 15;
  else if (lead.authority === 'Influencer') score += 10;
  else if (lead.authority === 'Researcher') score += 5;

  // Budget Range (Max 15)
  if (lead.budgetRange === '$10k+') score += 15;
  else if (lead.budgetRange === '$2k–10k') score += 12;
  else if (lead.budgetRange === '$500–2k') score += 8;
  else if (lead.budgetRange === '<$500') score += 4;

  // 4. BEHAVIORAL BOOST (0–10 points)
  if (lead.tags?.includes('Hot Lead')) score += 5;
  if (lead.channel === 'WhatsApp' || lead.channel === 'Phone') score += 5;

  // Clamp 0-100
  const finalScore = Math.min(Math.max(score, 0), 100);

  // Temperature Mapping
  let temperature: Lead['temperature'] = 'Cold';
  if (finalScore >= 80) temperature = 'Hot';
  else if (finalScore >= 50) temperature = 'Warm';

  // Stage Mapping (Qualified, Engaged, Nurture, Disqualified)
  let stage: LeadStatus = 'New';
  if (finalScore >= 80) stage = 'Qualified';
  else if (finalScore >= 50) stage = 'Engaged';
  else if (finalScore >= 20) stage = 'Nurture';
  else stage = 'Disqualified';

  return { score: finalScore, temperature, stage };
};
