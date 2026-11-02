import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Shield,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import NotificationsDropdown from './NotificationsDropdown';

export default function TopNavbar() {
  const {
    theme,
    toggleTheme,
    user,
    sidebarCollapsed,
    setMobileMenuOpen,
    setIsSearchOpen,
    notifications,
  } = useBanking();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-20 px-4 sm:px-8 flex items-center justify-between glass-panel border-b border-slate-800/80 dark:border-white/10 transition-colors">
      {/* Left: Mobile Menu Trigger + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-100 dark:text-white">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                {user.name.split(' ')[0]}
              </span>
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sovereign Shield Active
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <Calendar size={13} className="text-cyan-400" />
            <span>{currentDateFormatted}</span>
            <span className="text-slate-600 dark:text-slate-500">•</span>
            <span className="text-[11px] font-mono text-cyan-400/90 tracking-wide">
              {user.accountNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/60 dark:bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 text-slate-400 hover:text-slate-200 transition-all text-xs group"
        >
          <Search size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="hidden md:inline">Search anything...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            Ctrl K
          </kbd>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-[9px] font-bold text-white shadow-glow-cyan animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationsDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="group-hover:rotate-45 transition-transform text-amber-400" />
          ) : (
            <Moon size={18} className="group-hover:-rotate-12 transition-transform text-cyan-600" />
          )}
        </button>

        {/* User Mini Avatar */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/40"
          />
        </div>
      </div>
    </header>
  );
}
