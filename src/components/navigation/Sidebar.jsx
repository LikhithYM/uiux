import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BarChart3,
  CreditCard,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
    showToast
  } = useBanking();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleHelpClick = () => {
    showToast(
      '24/7 Concierge Support',
      'Quantum Sovereign priority hotline: +91 1800-FUTURE-01 is available 24/7.',
      'info'
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between transition-all duration-300 glass-panel border-r border-slate-800/80 dark:border-white/10 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform">
                <Zap className="text-white fill-white" size={20} />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-base tracking-wider text-slate-100 dark:text-white group-hover:text-cyan-400 transition-colors">
                    FUTURE BANKING
                  </span>
                  <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-semibold">
                    Beyond Boundaries
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  {/* Active Indicator Glow Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/30 shadow-glow-cyan"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 z-10 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  {!sidebarCollapsed && (
                    <span className="z-10 tracking-wide">{item.label}</span>
                  )}

                  {/* Active dot on right */}
                  {isActive && !sidebarCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-glow-cyan z-10" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Support & Profile */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {/* Help & Support */}
          <button
            onClick={handleHelpClick}
            title={sidebarCollapsed ? 'Help & Support' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors text-sm font-medium ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <HelpCircle size={18} className="shrink-0 text-slate-400" />
            {!sidebarCollapsed && <span>Help & Support</span>}
          </button>

          {/* User Profile Card */}
          <div
            onClick={() => handleNavClick('settings')}
            className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                    {user.name}
                  </span>
                  <ShieldCheck size={13} className="text-cyan-400 shrink-0" />
                </div>
                <span className="text-[10px] text-cyan-400 font-medium truncate">
                  {user.accountType}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
