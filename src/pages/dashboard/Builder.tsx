import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CapabilityWizard } from '@/components/capability/CapabilityWizard';
import { Rocket } from 'lucide-react';

export default function BuilderPage() {
  return (
    <DashboardLayout>
      <CapabilityWizard
        capability="app-generator"
        title="App Generator"
        description="Generate complete full-stack application blueprints, architecture, and code scaffolds"
        placeholder="Describe the application you want to build. Include features, target users, and tech preferences..."
        icon={<Rocket className="w-6 h-6 text-primary" />}
      />
    </DashboardLayout>
  );
}
