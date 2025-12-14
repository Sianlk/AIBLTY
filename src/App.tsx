import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AIChatWidget } from "@/components/chat/AIChatWidget";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import AuthPage from "./pages/Auth";
import PricingPage from "./pages/Pricing";
import DocsPage from "./pages/Docs";
import ApiReferencePage from "./pages/ApiReference";
import SupportPage from "./pages/Support";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import ProjectsPage from "./pages/dashboard/Projects";
import ProjectDetailPage from "./pages/dashboard/ProjectDetail";
import SolverPage from "./pages/dashboard/Solver";
import BuilderPage from "./pages/dashboard/Builder";
import BusinessBuilderPage from "./pages/dashboard/BusinessBuilder";
import AutomationPage from "./pages/dashboard/Automation";
import InsightsPage from "./pages/dashboard/Insights";
import SettingsPage from "./pages/dashboard/Settings";
import AdminPage from "./pages/dashboard/Admin";
import QuantumPage from "./pages/dashboard/Quantum";
import AIWorkforcePage from "./pages/dashboard/AIWorkforce";
import SocialPage from "./pages/dashboard/Social";
import ResearchPage from "./pages/dashboard/Research";
import RevenuePage from "./pages/dashboard/Revenue";
import IntegrationsPage from "./pages/dashboard/Integrations";
import SecurityPage from "./pages/dashboard/Security";
import EvolutionPage from "./pages/dashboard/Evolution";
import NetworkPage from "./pages/dashboard/Network";
import BillingPage from "./pages/dashboard/Billing";
import MarketingPage from "./pages/dashboard/Marketing";
import DebugPage from "./pages/dashboard/Debug";
import HistoryPage from "./pages/dashboard/History";
import GeneratorPage from "./pages/dashboard/Generator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/forgot-password" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/api" element={<ApiReferencePage />} />
            <Route path="/support" element={<SupportPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/dashboard/projects/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/dashboard/solver" element={<ProtectedRoute><SolverPage /></ProtectedRoute>} />
            <Route path="/dashboard/builder" element={<ProtectedRoute><GeneratorPage /></ProtectedRoute>} />
            <Route path="/dashboard/generator" element={<ProtectedRoute><GeneratorPage /></ProtectedRoute>} />
            <Route path="/dashboard/business-builder" element={<ProtectedRoute><BusinessBuilderPage /></ProtectedRoute>} />
            <Route path="/dashboard/automation" element={<ProtectedRoute><AutomationPage /></ProtectedRoute>} />
            <Route path="/dashboard/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/dashboard/quantum" element={<ProtectedRoute><QuantumPage /></ProtectedRoute>} />
            <Route path="/dashboard/ai-workforce" element={<ProtectedRoute><AIWorkforcePage /></ProtectedRoute>} />
            <Route path="/dashboard/social" element={<ProtectedRoute><SocialPage /></ProtectedRoute>} />
            <Route path="/dashboard/research" element={<ProtectedRoute><ResearchPage /></ProtectedRoute>} />
            <Route path="/dashboard/revenue" element={<ProtectedRoute><RevenuePage /></ProtectedRoute>} />
            <Route path="/dashboard/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
            <Route path="/dashboard/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
            <Route path="/dashboard/evolution" element={<ProtectedRoute><EvolutionPage /></ProtectedRoute>} />
            <Route path="/dashboard/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
            <Route path="/dashboard/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
            <Route path="/dashboard/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
            <Route path="/dashboard/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/dashboard/debug" element={<ProtectedRoute requireAdmin><DebugPage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/plans" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/modules" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/ai-workforce" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/evolution" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/ledger" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global AI Chat Widget */}
          <AIChatWidget 
            title="AIBLTY Assistant" 
            placeholder="Ask AIBLTY anything..."
            mode="general"
          />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
