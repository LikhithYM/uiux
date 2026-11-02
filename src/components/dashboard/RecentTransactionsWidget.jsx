import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronRight, Filter, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useBanking } from '../../context/BankingContext';
import { transactionCategories } from '../../data/mockTransactions';
import { ThreeCategoryAvatar } from '../three/ThreeTransactionFlow';

export default function RecentTransactionsWidget({ limit = 6, showFilters = true }) {
  const { transactions, setActiveTab, formatINR } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('date-desc'); // 'date-desc', 'amount-desc', 'amount-asc'

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesCategory =
          selectedCategory === 'All' || tx.category === selectedCategory;
        const matchesSearch =
          tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
        if (sortOrder === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
        return new Date(b.date) - new Date(a.date);
      });
  }, [transactions, searchTerm, selectedCategory, sortOrder]);

  const displayedList = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Real-time ledger updates & settlements</p>
        </div>

        {limit && (
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View Full Ledger</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Search & Category Filter Pills */}
      {showFilters && (
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full bg-slate-900/60 pl-9 pr-4 py-2 rounded-xl border border-white/5 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={() =>
                setSortOrder((prev) =>
                  prev === 'date-desc' ? 'amount-desc' : prev === 'amount-desc' ? 'amount-asc' : 'date-desc'
                )
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 text-xs text-slate-300 transition-colors"
              title="Toggle sorting"
            >
              <ArrowUpDown size={14} className="text-cyan-400" />
              <span className="hidden sm:inline">Sort: {sortOrder.replace('-', ' ')}</span>
            </button>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {transactionCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black font-semibold shadow-glow-cyan'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Table / List */}
      <div className="divide-y divide-white/5 overflow-x-auto">
        {displayedList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No transactions found matching your criteria.
          </div>
        ) : (
          displayedList.map((tx) => {
            const isIncome = tx.amount > 0;
            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-colors group"
              >
                {/* Left: 3D Category Avatar + Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <ThreeCategoryAvatar category={tx.category} avatar={tx.avatar} />
                  <div className="min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                      {tx.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Status Badge */}
                <div className="text-right shrink-0">
                  <p
                    className={`font-mono font-bold text-xs sm:text-sm ${
                      isIncome ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {isIncome ? '+' : ''}
                    {formatINR(tx.amount)}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <Badge variant={isIncome ? 'emerald' : 'slate'} size="xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
