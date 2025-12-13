import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CapabilityWizard } from '@/components/capability/CapabilityWizard';
import { Zap } from 'lucide-react';

export default function AutomationPage() {
  return (
    <DashboardLayout>
      <CapabilityWizard
        capability="automation-engine"
        title="Automation Engine"
        description="Design powerful automation workflows and process optimizations"
        placeholder="Describe the process or workflow you want to automate. Include current steps, triggers, and desired outcomes..."
        icon={<Zap className="w-6 h-6 text-primary" />}
      />
    </DashboardLayout>
  );
}
