import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CodeGenerator } from '@/components/generator/CodeGenerator';

export default function GeneratorPage() {
  return (
    <DashboardLayout>
      <CodeGenerator />
    </DashboardLayout>
  );
}
