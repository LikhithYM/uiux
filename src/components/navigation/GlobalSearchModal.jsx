import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ArrowLeftRight, CreditCard, TrendingUp, Wallet, ShieldCheck, X } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export default function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    transactions,
    cards,
    portfolio,
    savingsGoals,
    setActiveTab,
    setIsSendMoneyOpen,
    setIsAddMoneyOpen,
    formatINR,
  } = useBanking();

  const [query, setQuery] = useState('');

  // Handle ESC or keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches = [];

    // Transactions
    transactions.forEach((tx) => {
      if (
        tx.name.toLowerCase().includes(q) ||
        tx.merchant.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'transaction',
          title: tx.name,
          subtitle: `${tx.category} • ${tx.date}`,
          amount: tx.amount,
          id: tx.id,
          icon: ArrowLeftRight,
          action: () => {
            setActiveTab('transactions');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Cards
    cards.forEach((card) => {
      if (
        card.name.toLowerCase().includes(q) ||
        card.tier.toLowerCase().includes(q) ||
        card.number.includes(q)
      ) {
        matches.push({
          type: 'card',
          title: card.name,
          subtitle: `${card.tier} • ${card.maskedNumber}`,
          id: card.id,
          icon: CreditCard,
          action: () => {
            setActiveTab('cards');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Investments
    portfolio.holdings.forEach((inv) => {
      if (
        inv.name.toLowerCase().includes(q) ||
        inv.ticker.toLowerCase().includes(q) ||
        inv.type.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'investment',
          title: `${inv.name} (${inv.ticker})`,
          subtitle: `${inv.type} • Value ${formatINR(inv.totalValue)}`,
          id: inv.id,
          icon: TrendingUp,
          action: () => {
            setActiveTab('investments');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // Savings Goals
    savingsGoals.forEach((goal) => {
      if (goal.name.toLowerCase().includes(q) || goal.subtitle.toLowerCase().includes(q)) {
        matches.push({
          type: 'goal',
          title: goal.name,
          subtitle: `Target: ${formatINR(goal.targetAmount)}`,
          id: goal.id,
          icon: Wallet,
          action: () => {
            setActiveTab('overview');
            setIsSearchOpen(false);
          },
        });
      }
    });

    return matches.slice(0, 8);
  }, [query, transactions, cards, portfolio, savingsGoals, setActiveTab, setIsSearchOpen, formatINR]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.96 }}
        className="relative w-full max-w-2xl rounded-2xl glass-panel-glow border border-cyan-500/30 shadow-2xl p-4 z-10 text-white"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-cyan-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, cards, investments, or type 'Send'..."
            className="w-full bg-slate-900/60 pl-12 pr-10 py-3.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm placeholder:text-slate-500 text-white"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          ) : (
            <kbd className="absolute right-4 px-2 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-400 border border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Quick Actions */}
        <div className="mt-4 max-h-96 overflow-y-auto divide-y divide-white/5">
          {query.trim() === '' ? (
            <div className="py-4">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-2">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsSendMoneyOpen(true);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 text-left transition-colors"
                >
                  <ArrowRight size={16} className="text-cyan-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Send Money</p>
                    <p className="text-[11px] text-slate-400">Transfer instant funds</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsAddMoneyOpen(true);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 text-left transition-colors"
                >
                  <Wallet size={16} className="text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Add Funds</p>
                    <p className="text-[11px] text-slate-400">Top up available cash</p>
                  </div>
                </button>
              </div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="py-2 space-y-1">
              {filteredResults.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={item.action}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-cyan-500/10 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon size={16} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-xs text-white group-hover:text-cyan-300">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                      </div>
                    </div>
                    {item.amount !== undefined && (
                      <span
                        className={`text-xs font-mono font-bold ${
                          item.amount >= 0 ? 'text-emerald-400' : 'text-slate-300'
                        }`}
                      >
                        {item.amount >= 0 ? '+' : ''}
                        {formatINR(item.amount)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No financial records found matching "{query}"
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
