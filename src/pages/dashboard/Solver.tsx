import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CapabilityWizard } from '@/components/capability/CapabilityWizard';
import { Brain } from 'lucide-react';

export default function SolverPage() {
  return (
    <DashboardLayout>
      <CapabilityWizard
        capability="intelligence-workspace"
        title="Intelligence Workspace"
        description="Analyze complex problems and generate comprehensive solutions with AI"
        placeholder="Describe your problem or challenge in detail. Include context, constraints, and desired outcomes..."
        icon={<Brain className="w-6 h-6 text-primary" />}
      />
    </DashboardLayout>
  );
}
