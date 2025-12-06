import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import AuthPage from "./pages/Auth";
import PricingPage from "./pages/Pricing";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import ProjectsPage from "./pages/dashboard/Projects";
import ProjectDetailPage from "./pages/dashboard/ProjectDetail";
import SolverPage from "./pages/dashboard/Solver";
import BuilderPage from "./pages/dashboard/Builder";
import AutomationPage from "./pages/dashboard/Automation";
import InsightsPage from "./pages/dashboard/Insights";
import SettingsPage from "./pages/dashboard/Settings";
import AdminPage from "./pages/dashboard/Admin";

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
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/dashboard/projects/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/dashboard/solver" element={<ProtectedRoute><SolverPage /></ProtectedRoute>} />
            <Route path="/dashboard/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
            <Route path="/dashboard/automation" element={<ProtectedRoute><AutomationPage /></ProtectedRoute>} />
            <Route path="/dashboard/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;