import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CapabilityWizard } from '@/components/capability/CapabilityWizard';
import { Search } from 'lucide-react';

export default function ResearchPage() {
  return (
    <DashboardLayout>
      <CapabilityWizard
        capability="research-engine"
        title="Research Engine"
        description="Deep research across science, technology, business, and more with comprehensive reports"
        placeholder="What would you like to research? Be as specific as possible about the topic and scope..."
        icon={<Search className="w-6 h-6 text-primary" />}
      />
    </DashboardLayout>
  );
}
