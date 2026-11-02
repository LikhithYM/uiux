import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Shield,
  FileText,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useBanking } from '../context/BankingContext';
import { transactionCategories } from '../data/mockTransactions';
import ThreeTransactionFlowBanner, { ThreeCategoryAvatar } from '../components/three/ThreeTransactionFlow';

export default function Transactions() {
  const { transactions, formatINR, showToast } = useBanking();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortKey, setSortKey] = useState('date-desc');
  const [selectedTx, setSelectedTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & sort
  const filteredList = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesCategory =
          selectedCategory === 'All' || tx.category === selectedCategory;
        const matchesSearch =
          tx.name.toLowerCase().includes(search.toLowerCase()) ||
          tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
          tx.refId?.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortKey === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
        if (sortKey === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
        if (sortKey === 'date-asc') return new Date(a.date) - new Date(b.date);
        return new Date(b.date) - new Date(a.date);
      });
  }, [transactions, search, selectedCategory, sortKey]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const csvHeader = 'ID,Name,Merchant,Category,Date,Amount,Status,RefId\n';
    const csvRows = filteredList
      .map(
        (t) =>
          `"${t.id}","${t.name}","${t.merchant}","${t.category}","${t.date}",${t.amount},"${t.status}","${t.refId}"`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FutureBanking_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Export Complete', 'Encrypted transaction ledger downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Transaction Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete chronological audit trail of all sovereign settlements and transfers.
          </p>
        </div>

        <Button
          variant="outline"
          icon={Download}
          onClick={handleExportCSV}
          size="md"
        >
          Export CSV Ledger
        </Button>
      </div>

      {/* 3D Quantum Ledger Pipeline Banner */}
      <ThreeTransactionFlowBanner />

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by transaction, merchant, or reference ID..."
              className="w-full bg-slate-900/80 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder:text-slate-500"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="bg-slate-900/80 text-xs text-slate-300 py-2.5 px-4 rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-white/5 mt-4 no-scrollbar">
          {transactionCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-semibold shadow-glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-white/5 font-semibold">
              <tr>
                <th className="py-4 px-6">Transaction & Merchant</th>
                <th className="py-4 px-6 hidden sm:table-cell">Category</th>
                <th className="py-4 px-6 hidden md:table-cell">Payment Method</th>
                <th className="py-4 px-6 hidden lg:table-cell">Timestamp</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions matched your search query.
                  </td>
                </tr>
              ) : (
                paginatedList.map((tx) => {
                  const isIncome = tx.amount > 0;
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-cyan-500/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <ThreeCategoryAvatar category={tx.category} avatar={tx.avatar} />
                          <div>
                            <p className="font-semibold text-white group-hover:text-cyan-300">
                              {tx.name}
                            </p>
                            <p className="text-[11px] text-slate-400">{tx.merchant}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 hidden sm:table-cell">
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-white/5 text-[11px]">
                          {tx.category}
                        </span>
                      </td>

                      <td className="py-4 px-6 hidden md:table-cell text-slate-400 font-mono text-[11px]">
                        {tx.paymentMethod}
                      </td>

                      <td className="py-4 px-6 hidden lg:table-cell text-slate-400">
                        <div>{tx.date}</div>
                        <div className="text-[10px] text-slate-500">{tx.time}</div>
                      </td>

                      <td className="py-4 px-6 text-right font-mono font-bold text-sm">
                        <span className={isIncome ? 'text-emerald-400' : 'text-slate-100'}>
                          {isIncome ? '+' : ''}
                          {formatINR(tx.amount)}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <Badge variant={isIncome ? 'emerald' : 'slate'} size="xs">
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredList.length)} of {filteredList.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-white/5 text-white"
            >
              Previous
            </button>
            <span className="font-mono text-cyan-400 font-semibold px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-white/5 text-white"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title="Transaction Receipt"
          subtitle={`Reference ID: ${selectedTx.refId || 'TXN-984210982'}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-4xl mb-2 inline-block">{selectedTx.avatar || '💳'}</span>
              <h4 className="font-display font-bold text-xl text-white">{selectedTx.name}</h4>
              <p className="text-xs text-slate-400">{selectedTx.merchant}</p>
              <div
                className={`text-2xl font-mono font-extrabold mt-3 ${
                  selectedTx.amount > 0 ? 'text-emerald-400' : 'text-white'
                }`}
              >
                {selectedTx.amount > 0 ? '+' : ''}
                {formatINR(selectedTx.amount)}
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold text-white">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Payment Instrument</span>
                <span className="font-mono text-cyan-400">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Settlement Date</span>
                <span className="text-white">{selectedTx.date} at {selectedTx.time || '12:00'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">Network Fee</span>
                <span className="font-mono text-emerald-400">₹0.00 (Zero Fee)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Verification</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <Shield size={13} />
                  Quantum Consensus Confirmed
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => setSelectedTx(null)}
            >
              Close Receipt
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
