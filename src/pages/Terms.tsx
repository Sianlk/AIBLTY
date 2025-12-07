import { Header } from '@/components/aiblty/Header';
import { Footer } from '@/components/aiblty/Footer';
import { GridBackground } from '@/components/atlas/GridBackground';
import { Shield, Scale, Lock, FileText, AlertTriangle, Globe, Users, Gavel } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <GridBackground />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-text">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="glass-panel p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using AIBLTY ("the Platform", "the Service"), you agree to be bound by these Terms of Service ("Terms"), 
                our Privacy Policy, and all applicable laws and regulations. If you do not agree to these Terms, you must not use the Service.
                These Terms constitute a legally binding agreement between you and AIBLTY Ltd ("we", "us", "our").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                2. Intellectual Property & Copyright Protection
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  All content, features, functionality, software, algorithms, machine learning models, system prompts, 
                  user interfaces, and underlying technology of AIBLTY are owned by us and protected by international 
                  copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Strictly Prohibited Activities
                  </h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reverse engineering, decompiling, disassembling, or attempting to derive source code</li>
                    <li>Scraping, copying, or reproducing the Platform's content, layouts, designs, or functionality</li>
                    <li>Extracting, reproducing, or attempting to discover internal prompts, algorithms, or orchestration logic</li>
                    <li>Cloning, mirroring, or creating derivative works based on the Platform</li>
                    <li>Using automated tools, bots, or scripts to access the Platform without authorization</li>
                    <li>Circumventing any security measures or access controls</li>
                    <li>Sublicensing, selling, or distributing any part of the Service</li>
                  </ul>
                </div>
                <p>
                  Violation of these provisions may result in immediate termination of your account, legal action, 
                  and claims for damages including but not limited to statutory damages up to £150,000 per infringement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                3. User Accounts & Responsibilities
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You must provide accurate, complete, and current information when creating an account. 
                  You are responsible for maintaining the confidentiality of your credentials and for all activities under your account.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 18 years old to use the Service</li>
                  <li>You must provide valid payment information to access premium features</li>
                  <li>You are responsible for all content you create or upload</li>
                  <li>You must not share account credentials or allow unauthorized access</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                4. Fair Use Policy
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  While we offer "unlimited" features on certain plans, all usage is subject to our Fair Use Policy 
                  designed to ensure quality service for all users:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Usage must be for legitimate business or personal purposes</li>
                  <li>Automated or programmatic access must use our official API</li>
                  <li>Excessive usage that impacts system performance may be throttled</li>
                  <li>Abuse of AI features to generate harmful, illegal, or malicious content is prohibited</li>
                  <li>Reselling or redistributing AI-generated outputs in bulk is not permitted</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Gavel className="w-6 h-6 text-primary" />
                5. Limitation of Liability
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
                  <li>We do not guarantee accuracy, reliability, or completeness of AI-generated content</li>
                  <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Our total liability shall not exceed the amount paid by you in the 12 months prior to the claim</li>
                  <li>AI outputs are suggestions only; you are responsible for reviewing and validating all content</li>
                </ul>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm">
                    <strong>Medical & Legal Disclaimer:</strong> AIBLTY is not a substitute for professional medical, legal, 
                    financial, or other expert advice. AI-generated content should not be relied upon for critical decisions. 
                    Always consult qualified professionals for medical diagnoses, legal matters, or financial planning.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                6. Governing Law & Dispute Resolution
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of England and Wales, 
                  without regard to conflict of law principles. Any disputes arising from these Terms shall be 
                  resolved through binding arbitration in London, UK, except where prohibited by law.
                </p>
                <p>
                  You agree to waive any right to participate in class action lawsuits or class-wide arbitration 
                  against us. For EU consumers, mandatory consumer protection laws of your country of residence apply.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless AIBLTY, its officers, directors, employees, 
                and agents from any claims, damages, losses, or expenses (including legal fees) arising from your 
                use of the Service, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these Terms 
                or for any reason at our sole discretion. Upon termination, your right to use the Service ceases 
                immediately. Provisions that by their nature should survive termination shall survive.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may modify these Terms at any time. We will notify you of material changes via email or 
                prominent notice on the Platform. Continued use after changes constitutes acceptance of new Terms.
              </p>
            </section>

            <section className="border-t border-border pt-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, contact us at:<br />
                <strong>Email:</strong> legal@aiblty.com<br />
                <strong>Address:</strong> AIBLTY Ltd, London, United Kingdom
              </p>
            </section>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} AIBLTY. All rights reserved. "AIBLTY" and the AIBLTY logo are trademarks of AIBLTY Ltd.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
