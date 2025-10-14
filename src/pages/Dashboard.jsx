import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import Overview from '@/components/dashboard/Overview';
import POSSystem from '@/components/dashboard/POSSystem';
import Inventory from '@/components/dashboard/Inventory';
import UserManagement from '@/components/dashboard/UserManagement';
import Reports from '@/components/dashboard/Reports';
import Branches from '@/components/dashboard/Branches';
import OrderManagement from '@/components/dashboard/OrderManagement';
import TableManagement from '@/components/dashboard/TableManagement';
import HRM from '@/components/dashboard/HRM';
import Production from '@/components/dashboard/Production';
import Purchase from '@/components/dashboard/Purchase';
import Sell from '@/components/dashboard/Sell';
import RolesAndPermissions from '@/components/dashboard/RolesAndPermissions';
import ProductManagement from '@/components/dashboard/ProductManagement';
import Settings from '@/components/dashboard/Settings';
import ShiftRegister from '@/components/dashboard/ShiftRegister';
import SectionManagement from '@/components/dashboard/branches/SectionManagement';
import BusinessSettings from '@/components/dashboard/settings/BusinessSettings';
import TaxSettings from '@/components/dashboard/settings/TaxSettings';
import DiscountSettings from '@/components/dashboard/settings/DiscountSettings';
import CalendarPage from '@/components/dashboard/CalendarPage';
import Contacts from '@/components/dashboard/Contacts';
import Footer from '@/components/dashboard/Footer'; // Import the new Footer component

const Dashboard = ({ user, onLogout, theme, setTheme, draftToLoad, onSetDraftToLoad, onClearDraftToLoad }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [managingSectionsFor, setManagingSectionsFor] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleManageSections = (branch) => {
    setManagingSectionsFor(branch);
    setActiveTab('manage-sections');
  };

  const handleBackToBranches = () => {
    setManagingSectionsFor(null);
    setActiveTab('branches');
  };

  const handleBackToSettings = () => {
    setActiveTab('settings');
  };
  
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (activeTab === 'pos') {
      return <POSSystem user={user} onBackToDashboard={() => setActiveTab('overview')} theme={theme} setTheme={setTheme} draftToLoad={draftToLoad} onClearDraftToLoad={onClearDraftToLoad} />;
    }

    switch (activeTab) {
      case 'overview':
        return <Overview user={user} setActiveTab={handleSetActiveTab} />;
      case 'inventory':
        return <Inventory user={user} />;
      case 'staff':
        return <UserManagement user={user} />;
      case 'contacts':
        return <Contacts user={user} />;
      case 'roles':
        return <RolesAndPermissions user={user} />;
      case 'products':
        return <ProductManagement user={user} />;
      case 'reports':
        return <Reports user={user} />;
      case 'branches':
        return <Branches user={user} onManageSections={handleManageSections} />;
      case 'manage-sections':
        return <SectionManagement branch={managingSectionsFor} onBack={handleBackToBranches} />;
      case 'orders':
        return <OrderManagement user={user} />;
      case 'tables':
        return <TableManagement user={user} />;
      case 'hrm':
        return <HRM user={user} />;
      case 'production':
        return <Production user={user} />;
      case 'purchase':
        return <Purchase user={user} />;
      case 'sell':
        return <Sell user={user} setActiveTab={handleSetActiveTab} onSetDraftToLoad={onSetDraftToLoad} />;
      case 'shift-register':
        return <ShiftRegister user={user} />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} user={user} setActiveTab={handleSetActiveTab} />;
      case 'business-settings':
        return <BusinessSettings onBack={handleBackToSettings} />;
      case 'tax-settings':
        return <TaxSettings onBack={handleBackToSettings} />;
      case 'discount-settings':
        return <DiscountSettings onBack={handleBackToSettings} />;
      case 'calendar':
        return <CalendarPage />;
      default:
        return <Overview user={user} setActiveTab={handleSetActiveTab} />;
    }
  };

  if (activeTab === 'pos') {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-screen"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} onMenuClick={() => setSidebarOpen(true)} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer /> {/* Add the Footer component here */}
      </div>
    </div>
  );
};

export default Dashboard;
