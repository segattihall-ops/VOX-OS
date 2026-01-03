import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Leads } from './pages/Leads.tsx';
import { LeadDetail } from './pages/LeadDetail.tsx';
import { Accounts } from './pages/Accounts.tsx';
import { AccountDetail } from './pages/AccountDetail.tsx';
import { Contacts } from './pages/Contacts.tsx';
import { Opportunities } from './pages/Opportunities.tsx';
import { RevenueCommand } from './pages/RevenueCommand.tsx';
import { DeliveryPage } from './pages/Delivery.tsx';
import { DeliveryDetail } from './pages/DeliveryDetail.tsx';
import { Support } from './pages/Support.tsx';
import { Wiki } from './pages/Wiki.tsx';
import { Reports } from './pages/Reports.tsx';
import { Billing } from './pages/Billing.tsx';
import { PlaceholderPage } from './pages/PlaceholderPage.tsx';

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