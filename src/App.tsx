
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/flow-builder" element={<FlowBuilderPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/ai-agents" element={<AiAgentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
