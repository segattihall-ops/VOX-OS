
import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadDetail } from './pages/LeadDetail';
import { Accounts } from './pages/Accounts';
import { AccountDetail } from './pages/AccountDetail';
import { Contacts } from './pages/Contacts';
import { Opportunities } from './pages/Opportunities';
import { RevenueCommand } from './pages/RevenueCommand';
import { DeliveryPage } from './pages/Delivery';
import { DeliveryDetail } from './pages/DeliveryDetail';
import { Support } from './pages/Support';
import { Wiki } from './pages/Wiki';
import { Reports } from './pages/Reports';
import { Billing } from './pages/Billing';
import { PlaceholderPage } from './pages/PlaceholderPage';

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard/leads" element={<Layout><Leads /></Layout>} />
        <Route path="/dashboard/leads/:leadId" element={<Layout><LeadDetail /></Layout>} />
        <Route path="/dashboard/accounts" element={<Layout><Accounts /></Layout>} />
        <Route path="/dashboard/accounts/:accountId" element={<Layout><AccountDetail /></Layout>} />
        <Route path="/dashboard/contacts" element={<Layout><Contacts /></Layout>} />
        <Route path="/dashboard/opportunities" element={<Layout><Opportunities /></Layout>} />
        <Route path="/dashboard/opportunities/revenue-command" element={<Layout><RevenueCommand /></Layout>} />
        <Route path="/dashboard/delivery" element={<Layout><DeliveryPage /></Layout>} />
        <Route path="/dashboard/delivery/:deliveryId" element={<Layout><DeliveryDetail /></Layout>} />
        <Route path="/dashboard/wiki" element={<Layout><Wiki /></Layout>} />
        <Route path="/dashboard/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/dashboard/billing" element={<Layout><Billing /></Layout>} />
        <Route path="/dashboard/support" element={<Layout><Support /></Layout>} />
        
        <Route path="/dashboard/activities" element={<Layout><PlaceholderPage title="Activities" /></Layout>} />
        <Route path="/dashboard/support/:ticketId" element={<Layout><PlaceholderPage title="Ticket Detail" /></Layout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
};

export default App;
