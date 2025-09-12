
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import CampaignsPage from './pages/CampaignsPage';
import FlowBuilderPage from './pages/FlowBuilderPage';
import InboxPage from './pages/InboxPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import AiAgentsPage from './pages/AiAgentsPage';
import SettingsPage from './pages/SettingsPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute>
              <MainLayout>
                <LeadsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/campaigns" element={
            <ProtectedRoute>
              <MainLayout>
                <CampaignsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/flow-builder" element={
            <ProtectedRoute>
              <MainLayout>
                <FlowBuilderPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/inbox" element={
            <ProtectedRoute>
              <MainLayout>
                <InboxPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <MainLayout>
                <AnalyticsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/integrations" element={
            <ProtectedRoute>
              <MainLayout>
                <IntegrationsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/ai-agents" element={
            <ProtectedRoute>
              <MainLayout>
                <AiAgentsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
