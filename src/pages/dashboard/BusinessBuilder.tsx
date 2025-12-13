import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CapabilityWizard } from '@/components/capability/CapabilityWizard';
import { Briefcase } from 'lucide-react';

export default function BusinessBuilderPage() {
  return (
    <DashboardLayout>
      <CapabilityWizard
        capability="business-builder"
        title="Business Builder"
        description="Generate comprehensive business plans, strategies, and monetization frameworks"
        placeholder="Describe your business idea. Include target market, unique value proposition, and goals..."
        icon={<Briefcase className="w-6 h-6 text-primary" />}
      />
    </DashboardLayout>
  );
}
