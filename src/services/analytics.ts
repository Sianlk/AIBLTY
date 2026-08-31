// Analytics Service — AIBLTY Health
import { Platform } from 'react-native';

type EventProperties = Record<string, string | number | boolean | null>;

const queue: Array<{name:string; props:EventProperties; ts:number}> = [];
let timer: ReturnType<typeof setTimeout> | null = null;

export type GrowthStage = 'acquisition' | 'activation' | 'revenue' | 'retention' | 'referral' | 'expansion';

/**
 * IMPORTANT: callers must never send symptoms, diagnoses, medicines, health-record
 * contents or free-text health conversations to this growth analytics service.
 */
export function track(name: string, props?: EventProperties): void {
  queue.push({
    name,
    props: {
      ...props,
      platform: Platform.OS,
      app: 'AIBLTY Health',
      domain: 'health',
      event_schema_version: 2,
      ts: Date.now(),
    },
    ts: Date.now(),
  });
  if (queue.length >= 30) flush();
  else if (!timer) timer = setTimeout(flush, 5000);
}

async function flush(): Promise<void> {
  if (timer) { clearTimeout(timer); timer = null; }
  if (!queue.length) return;
  const batch = queue.splice(0);
  try {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/analytics/batch`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ events: batch }),
    });
  } catch {
    // Telemetry never blocks a health workflow.
  }
}

function growth(stage: GrowthStage, action: string, props?: EventProperties): void {
  track(`growth_${stage}`, { action, ...props });
}

export const Analytics = {
  screen: (name: string, p?: EventProperties) => track('screen_view', { screen_name: name, ...p }),
  appOpened: (authenticated: boolean) => growth('retention', 'app_opened', { authenticated }),
  acquired: (source: string, campaign?: string, referralCode?: string) => growth('acquisition', 'visit_attributed', {
    source, campaign: campaign ?? '', referral_code: referralCode ?? '',
  }),
  activated: (milestone: 'workspace_created' | 'first_safe_tool_complete' | 'first_automation' | 'first_share') =>
    growth('activation', milestone),
  checkoutStarted: (plan: string, interval: 'month' | 'year') => growth('revenue', 'checkout_started', { plan, interval }),
  subscriptionChanged: (fromPlan: string, toPlan: string, change: 'upgrade' | 'downgrade' | 'reactivate' | 'cancel') =>
    growth(change === 'upgrade' ? 'expansion' : 'revenue', 'subscription_changed', { from_plan: fromPlan, to_plan: toPlan, change }),
  usageLimitReached: (feature: string, plan: string) => growth('expansion', 'usage_limit_reached', { feature, plan }),
  collaboratorInvited: (kind: 'family' | 'care_team' | 'provider') => growth('referral', 'collaborator_invited', { kind }),
  referralConverted: (referralCode: string) => growth('referral', 'referral_converted', { referral_code: referralCode }),
  workflowQualityRated: (workflow: string, useful: boolean) => track('owned_quality_signal', { workflow, useful }),
  consentChanged: (analyticsAllowed: boolean) => track('consent_state_changed', { analytics_allowed: analyticsAllowed }),
  aiResponse: (ok: boolean, model: string, tokens?: number) => track('ai_response_metadata', { ok, model, tokens: tokens??0 }),
  agentTask: (type: string, ok: boolean, ms?: number) => track('agent_task_metadata', { type, ok, ms: ms??0 }),
  login: (method: string) => track('login', { method }),
  logout: () => track('logout'),
  featureUsed: (f: string, p?: EventProperties) => track('feature_used', { feature: f, ...p }),
  error: (code: string, screen?: string) => track('app_error', { code, screen: screen??'' }),
};

export default Analytics;
