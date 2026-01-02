
import { Lead, LeadStatus } from '../types';

export const calculateLeadScore = (lead: Partial<Lead>): { score: number, temperature: Lead['temperature'], stage: LeadStatus } => {
  let score = 0;

  // A) Fit (0–40)
  // Industry / Niche (até 25)
  if (lead.icpFit === 'A') score += 25;
  else if (lead.icpFit === 'B') score += 15;
  else if (lead.icpFit === 'C') score += 5;

  // Company Size (até 10)
  if (lead.companySize === '11–50') score += 10;
  else if (lead.companySize === '2–10') score += 7;
  else if (lead.companySize === '50+') score += 8;
  else if (lead.companySize === 'Solo') score += 3;

  // Lead Volume (até 5)
  if (lead.leadVolume === '100+/day') score += 5;
  else if (lead.leadVolume === '31–100/day') score += 4;
  else if (lead.leadVolume === '11–30/day') score += 3;
  else if (lead.leadVolume === '0–10/day') score += 1;

  // B) Intent & Urgency (0–30)
  // Urgency (até 20)
  if (lead.urgency === 'Now (0–7 days)') score += 20;
  else if (lead.urgency === '30 days') score += 15;
  else if (lead.urgency === '60–90 days') score += 8;

  // Pain clarity (até 10) - Using tags or explicit check
  if (lead.tags?.includes('High Priority') || (lead.painPoints && lead.painPoints.length > 2)) score += 10;
  else if (lead.painPoints && lead.painPoints.length > 0) score += 6;

  // C) Authority & Budget (0–30)
  // Authority (até 15)
  if (lead.authority === 'Decision maker') score += 15;
  else if (lead.authority === 'Influencer') score += 8;
  else if (lead.authority === 'Researcher') score += 2;

  // Budget signal (até 15)
  if (lead.budgetRange === '$2k–10k') score += 15;
  else if (lead.budgetRange === '$500–2k') score += 10;
  else if (lead.budgetRange === '$10k+') score += 12;
  else if (lead.budgetRange === '<$500') score += 3;
  
  // D) Behavioral Boost (bônus 0–10)
  if (lead.tags?.includes('Hot Lead')) score += 5;

  // Clamp 0-100
  const finalScore = Math.min(Math.max(score, 0), 100);

  // Mapping
  let temperature: Lead['temperature'] = 'Cold';
  if (finalScore >= 80) temperature = 'Hot';
  else if (finalScore >= 55) temperature = 'Warm';

  // Fix: Corrected 'Nurture' to 'Engaged' which is a valid LeadStatus
  let stage: LeadStatus = 'New';
  if (finalScore >= 80) stage = 'Qualified';
  else if (finalScore >= 55) stage = 'Engaged';
  
  if (lead.budgetRange === '<$500' && lead.icpFit === 'C') stage = 'Disqualified';

  return { score: finalScore, temperature, stage };
};
