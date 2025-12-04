export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong>Last updated:</strong> December 2024</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (email, name)</li>
            <li>Payment information (processed securely via Stripe)</li>
            <li>Content you create on the Platform</li>
            <li>Usage data and analytics</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our services</li>
            <li>To process payments and subscriptions</li>
            <li>To communicate with you about your account</li>
            <li>To ensure security and prevent fraud</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">3. Data Storage and Security</h2>
          <p>Your data is stored securely on our servers. We use industry-standard encryption and security measures to protect your information.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">4. Your Rights (GDPR)</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">5. Data Retention</h2>
          <p>We retain your data as long as your account is active. You can request deletion at any time.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">6. Third-Party Services</h2>
          <p>We use third-party services for payment processing (Stripe) and AI capabilities (OpenAI). These services have their own privacy policies.</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8">7. Contact</h2>
          <p>For privacy inquiries, contact us at privacy@aiblty.com</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
