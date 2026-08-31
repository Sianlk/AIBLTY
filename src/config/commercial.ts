export type AibltyHealthPlanId = 'free' | 'plus' | 'family' | 'provider' | 'enterprise';

export type CommercialFeature =
  | 'health_workspace'
  | 'medicine_tools'
  | 'ai_assistant'
  | 'history'
  | 'family_spaces'
  | 'care_team_sharing'
  | 'automations'
  | 'export'
  | 'provider_workspace'
  | 'api'
  | 'white_label'
  | 'priority_support';

export interface PlanDefinition {
  id: AibltyHealthPlanId;
  name: string;
  audience: string;
  monthlyPriceGBP: number | null;
  annualPriceGBP: number | null;
  includedMembers: number;
  limits: { aiActionsPerMonth: number | null; workspaces: number | null };
  features: readonly CommercialFeature[];
  expansion: readonly ('member' | 'usage' | 'provider_seat' | 'api' | 'white_label')[];
}

/**
 * Client-side catalogue/entitlement contract. Payment-provider product IDs and
 * subscription truth remain server-side. No health information is used to decide
 * price or eligibility.
 */
export const AIBLTY_HEALTH_PLANS: Record<AibltyHealthPlanId, PlanDefinition> = {
  free: {
    id: 'free', name: 'Free', audience: 'Individuals starting a private health workspace',
    monthlyPriceGBP: 0, annualPriceGBP: 0, includedMembers: 1,
    limits: { aiActionsPerMonth: 10, workspaces: 1 },
    features: ['health_workspace', 'medicine_tools', 'export'], expansion: [],
  },
  plus: {
    id: 'plus', name: 'Plus', audience: 'Individuals using AIBLTY Health regularly',
    monthlyPriceGBP: 19, annualPriceGBP: 190, includedMembers: 1,
    limits: { aiActionsPerMonth: 300, workspaces: 1 },
    features: ['health_workspace', 'medicine_tools', 'ai_assistant', 'history', 'automations', 'export', 'priority_support'],
    expansion: ['usage'],
  },
  family: {
    id: 'family', name: 'Family', audience: 'Households managing separate private member spaces',
    monthlyPriceGBP: 39, annualPriceGBP: 390, includedMembers: 5,
    limits: { aiActionsPerMonth: 1000, workspaces: 5 },
    features: ['health_workspace', 'medicine_tools', 'ai_assistant', 'history', 'family_spaces', 'care_team_sharing', 'automations', 'export', 'priority_support'],
    expansion: ['member', 'usage'],
  },
  provider: {
    id: 'provider', name: 'Provider', audience: 'Authorised professional/care organisations',
    monthlyPriceGBP: 149, annualPriceGBP: 1490, includedMembers: 5,
    limits: { aiActionsPerMonth: 3000, workspaces: null },
    features: ['health_workspace', 'medicine_tools', 'ai_assistant', 'history', 'care_team_sharing', 'automations', 'export', 'provider_workspace', 'api', 'priority_support'],
    expansion: ['provider_seat', 'usage', 'api'],
  },
  enterprise: {
    id: 'enterprise', name: 'Enterprise', audience: 'Large authorised organisations and platform partners',
    monthlyPriceGBP: null, annualPriceGBP: null, includedMembers: 20,
    limits: { aiActionsPerMonth: null, workspaces: null },
    features: ['health_workspace', 'medicine_tools', 'ai_assistant', 'history', 'family_spaces', 'care_team_sharing', 'automations', 'export', 'provider_workspace', 'api', 'white_label', 'priority_support'],
    expansion: ['provider_seat', 'usage', 'api', 'white_label'],
  },
};

export function hasFeature(planId: AibltyHealthPlanId, feature: CommercialFeature): boolean {
  return AIBLTY_HEALTH_PLANS[planId].features.includes(feature);
}

/**
 * Defensibility must come from owned workflows, model-evaluation results,
 * de-identified/aggregated product-performance signals and distribution — not
 * selling or repurposing identifiable health information.
 */
export const DATA_OWNERSHIP_POLICY = {
  neverGrowthAnalytics: [
    'symptom text', 'diagnoses', 'medicine names', 'health-record contents',
    'clinical documents', 'free-text health conversations',
  ],
  allowedOperationalSignals: [
    'feature adoption', 'latency bands', 'model quality ratings', 'subscription lifecycle',
    'retention cohorts', 'consent-state changes', 'de-identified workflow completion rates',
  ],
  requiresExplicitConsent: true,
  supportsExportAndDeletion: true,
} as const;

export const COMMERCIAL_ARCHITECTURE = {
  revenueFloorTargetMRRGBP: 100_000,
  wealthEquation: 'Value × Reach × Repeatability × Ownership',
  growthLoops: [
    'trusted free utility → private workspace adoption → subscription',
    'repeat workflows → retained history/automation value → renewal',
    'invited family/care collaborators → organic distribution → paid expansion',
    'provider/API partnerships → distribution → recurring B2B revenue',
    'quality feedback → safer/better owned workflows → stronger retention',
  ] as const,
} as const;
