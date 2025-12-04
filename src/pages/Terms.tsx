export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong>Last updated:</strong> December 2024</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
          <p>By accessing or using AIBLTY ("the Platform"), you agree to be bound by these Terms of Service.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">2. Intellectual Property</h2>
          <p>All content, features, and functionality of AIBLTY are owned by the Platform owner. You may not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
            <li>Scrape, copy, or reproduce the Platform's content, layouts, or designs</li>
            <li>Attempt to extract or reproduce internal prompts, algorithms, or orchestration logic</li>
            <li>Clone, mirror, or create derivative works based on the Platform</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">3. User Content</h2>
          <p>You retain ownership of content you create using the Platform. However, you grant us a license to process your content to provide the service.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">4. Prohibited Activities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Using the Platform for illegal purposes</li>
            <li>Attempting to gain unauthorized access to systems</li>
            <li>Distributing malware or harmful code</li>
            <li>Violating intellectual property rights</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">5. Limitation of Liability</h2>
          <p>AIBLTY is provided "as is" without warranties. We are not liable for any damages arising from your use of the Platform.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">6. Contact</h2>
          <p>For questions about these terms, contact us at legal@aiblty.com</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
