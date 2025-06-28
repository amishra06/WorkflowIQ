import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import WorkflowsPage from './pages/WorkflowsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PricingPage from './pages/PricingPage';
import CustomersPage from './pages/CustomersPage';
import ResourcesPage from './pages/ResourcesPage';
import ROICalculatorPage from './pages/ROICalculatorPage';
import SettingsPage from './pages/SettingsPage';
import APIDocsPage from './pages/api/APIDocsPage';
import DashboardLayout from './layouts/DashboardLayout';
import PatternSuggestionManager from './components/notifications/PatternSuggestionToast';

// Create a public favicon.svg file
import { createPublic } from './utils/createPublic';
createPublic();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/api-docs" element={<APIDocsPage />} />
          <Route path="/roi-calculator" element={<ROICalculatorPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
                <PatternSuggestionManager />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App