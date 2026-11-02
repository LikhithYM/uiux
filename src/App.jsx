import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import Sidebar from './components/navigation/Sidebar';
import TopNavbar from './components/navigation/TopNavbar';
import GlobalSearchModal from './components/navigation/GlobalSearchModal';
import ToastContainer from './components/common/Toast';
import ThreeBackgroundMesh from './components/three/ThreeBackgroundMesh';

// Modals
import QuickTransferModal from './components/dashboard/QuickTransferModal';
import RequestMoneyModal from './components/dashboard/RequestMoneyModal';
import PayBillsModal from './components/dashboard/PayBillsModal';
import AddMoneyModal from './components/dashboard/AddMoneyModal';
import DepositGoalModal from './components/dashboard/DepositGoalModal';

// Pages
import Overview from './pages/Overview';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Cards from './pages/Cards';
import Investments from './pages/Investments';
import Settings from './pages/Settings';

function AppContent() {
  const { activeTab, sidebarCollapsed } = useBanking();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'wallet':
        return <Wallet />;
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'cards':
        return <Cards />;
      case 'investments':
        return <Investments />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F0F4F9] dark:bg-[#05070E] text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      {/* 3D Floating Particle Constellation Background */}
      <ThreeBackgroundMesh />

      {/* Futuristic Ambient Glow Spots */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-400/15 dark:bg-cyan-600/10 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-300/15 dark:bg-indigo-600/10 blur-[150px] pointer-events-none" />

      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals & Portals */}
      <QuickTransferModal />
      <RequestMoneyModal />
      <PayBillsModal />
      <AddMoneyModal />
      <DepositGoalModal />
      <GlobalSearchModal />

      {/* Notification Toast Stack */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BankingProvider>
      <AppContent />
    </BankingProvider>
  );
}
