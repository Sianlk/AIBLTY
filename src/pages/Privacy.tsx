import { Header } from '@/components/aiblty/Header';
import { Footer } from '@/components/aiblty/Footer';
import { GridBackground } from '@/components/atlas/GridBackground';
import { Shield, Lock, Eye, Database, Globe, Mail, AlertTriangle, FileCheck, Users, Settings } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <GridBackground />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-text">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
            <p className="text-sm text-muted-foreground mt-2">GDPR, CCPA, and UK Data Protection Act 2018 Compliant</p>
          </div>

          <div className="glass-panel p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <h4 className="font-semibold text-foreground">Personal Information You Provide:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Data:</strong> Name, email address, password (encrypted)</li>
                  <li><strong>Payment Information:</strong> Processed securely via Stripe, PayPal, or Revolut (we do not store card numbers)</li>
                  <li><strong>Profile Information:</strong> Company name, job title, preferences</li>
                  <li><strong>Communications:</strong> Support tickets, feedback, and correspondence</li>
                </ul>

                <h4 className="font-semibold text-foreground mt-6">Automatically Collected Information:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Usage Data:</strong> Features used, actions taken, timestamps</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Cookies & Tracking:</strong> Session cookies, analytics (opt-out available)</li>
                  <li><strong>AI Interactions:</strong> Prompts and responses for service improvement (anonymized)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Delivery:</strong> Providing, maintaining, and improving the Platform</li>
                  <li><strong>Personalization:</strong> Customizing your experience and AI interactions</li>
                  <li><strong>Billing:</strong> Processing payments and managing subscriptions</li>
                  <li><strong>Communication:</strong> Sending service updates, security alerts, and marketing (opt-out available)</li>
                  <li><strong>Security:</strong> Detecting fraud, abuse, and unauthorized access</li>
                  <li><strong>Legal Compliance:</strong> Fulfilling legal obligations and responding to lawful requests</li>
                  <li><strong>AI Training:</strong> Improving our models with anonymized, aggregated data only</li>
                </ul>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2">Legal Basis for Processing (GDPR)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Contract:</strong> Necessary to provide the Service</li>
                    <li>• <strong>Consent:</strong> Marketing communications (opt-in)</li>
                    <li>• <strong>Legitimate Interest:</strong> Security, fraud prevention, analytics</li>
                    <li>• <strong>Legal Obligation:</strong> Tax records, legal compliance</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                3. Data Security & Protection
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We implement industry-leading security measures to protect your data:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Technical Safeguards</h4>
                    <ul className="text-sm space-y-1">
                      <li>• AES-256 encryption at rest</li>
                      <li>• TLS 1.3 encryption in transit</li>
                      <li>• Multi-factor authentication</li>
                      <li>• Regular security audits</li>
                    </ul>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Organizational Measures</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Employee security training</li>
                      <li>• Access control policies</li>
                      <li>• Incident response procedures</li>
                      <li>• Third-party vendor assessments</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm">
                  We maintain SOC 2 Type II compliance and conduct annual penetration testing by certified security firms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                4. Your Rights (GDPR/CCPA)
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>You have the following rights regarding your personal data:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Access & Portability</h4>
                    <p className="text-sm">Request a copy of all data we hold about you in a machine-readable format.</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Rectification</h4>
                    <p className="text-sm">Correct inaccurate or incomplete personal information.</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Erasure ("Right to be Forgotten")</h4>
                    <p className="text-sm">Request deletion of your personal data, subject to legal retention requirements.</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Restriction & Objection</h4>
                    <p className="text-sm">Limit or object to processing of your data in certain circumstances.</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Withdraw Consent</h4>
                    <p className="text-sm">Withdraw consent for marketing or optional data processing at any time.</p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Non-Discrimination (CCPA)</h4>
                    <p className="text-sm">We will not discriminate against you for exercising your privacy rights.</p>
                  </div>
                </div>
                <p className="text-sm">
                  To exercise your rights, email <strong>privacy@aiblty.com</strong> or use the Privacy Settings in your account. 
                  We will respond within 30 days (GDPR) or 45 days (CCPA).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                5. Data Transfers & Storage
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Your data is primarily stored on servers in the European Union. If data is transferred outside the EEA, 
                  we ensure adequate protection through:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                  <li>Adequacy decisions for countries with equivalent data protection</li>
                  <li>Privacy Shield certifications where applicable</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" />
                6. Cookies & Tracking
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We use cookies and similar technologies for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality (cannot be disabled)</li>
                  <li><strong>Analytics Cookies:</strong> Understanding usage patterns (opt-out available)</li>
                  <li><strong>Marketing Cookies:</strong> Personalized advertising (opt-in only)</li>
                </ul>
                <p className="text-sm">
                  Manage cookie preferences in your browser settings or through our Cookie Consent banner.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-primary" />
                7. Data Retention
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Data:</strong> Retained while account is active + 30 days after deletion</li>
                  <li><strong>Payment Records:</strong> 7 years (legal requirement)</li>
                  <li><strong>AI Interaction Logs:</strong> 12 months, then anonymized for training</li>
                  <li><strong>Support Tickets:</strong> 3 years after resolution</li>
                  <li><strong>Anonymized Analytics:</strong> Indefinitely</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Third-Party Services</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We share data with trusted third parties who process it on our behalf:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Stripe, PayPal, Revolut:</strong> Payment processing</li>
                  <li><strong>AWS/Cloud Providers:</strong> Infrastructure and hosting</li>
                  <li><strong>OpenAI/AI Providers:</strong> AI model processing (no personal data shared)</li>
                  <li><strong>Analytics Services:</strong> Usage analytics (anonymized)</li>
                </ul>
                <p className="text-sm">
                  All third parties are contractually obligated to protect your data and only use it for specified purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                AIBLTY is not intended for users under 18. We do not knowingly collect personal information 
                from children. If we discover such data has been collected, we will delete it immediately.
              </p>
            </section>

            <section className="border-t border-border pt-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact & Complaints
              </h2>
              <div className="text-muted-foreground">
                <p>
                  <strong>Data Protection Officer:</strong> privacy@aiblty.com<br />
                  <strong>General Inquiries:</strong> support@aiblty.com<br />
                  <strong>Address:</strong> AIBLTY Ltd, London, United Kingdom
                </p>
                <p className="mt-4 text-sm">
                  You have the right to lodge a complaint with a supervisory authority. In the UK, contact the 
                  Information Commissioner's Office (ICO) at ico.org.uk.
                </p>
              </div>
            </section>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} AIBLTY. All rights reserved.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
