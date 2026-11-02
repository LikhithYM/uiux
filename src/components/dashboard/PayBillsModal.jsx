import React, { useState } from 'react';
import { Zap, Wifi, Smartphone, Tv, Flame, Building2, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useBanking } from '../../context/BankingContext';

export default function PayBillsModal() {
  const { isPayBillsOpen, setIsPayBillsOpen, payBill, availableBalance, formatINR } = useBanking();

  const billers = [
    { id: 'b-1', name: 'BESCOM Electricity Grid', category: 'Bills & Utilities', icon: Zap, sampleAmount: 4280 },
    { id: 'b-2', name: 'Airtel Quantum Fiber Gigabit', category: 'Bills & Utilities', icon: Wifi, sampleAmount: 1499 },
    { id: 'b-3', name: 'Jio 5G Sovereign Mobile', category: 'Bills & Utilities', icon: Smartphone, sampleAmount: 999 },
    { id: 'b-4', name: 'Amazon Web Services Cloud', category: 'Bills & Utilities', icon: Building2, sampleAmount: 18450 },
    { id: 'b-5', name: 'Indane Cyber Gas Pipeline', category: 'Bills & Utilities', icon: Flame, sampleAmount: 1150 },
  ];

  const [selectedBiller, setSelectedBiller] = useState(billers[0]);
  const [billAmount, setBillAmount] = useState(billers[0].sampleAmount.toString());
  const [accountNumber, setAccountNumber] = useState('9842109842');

  const handleBillerSelect = (b) => {
    setSelectedBiller(b);
    setBillAmount(b.sampleAmount.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!billAmount) return;

    const success = payBill({
      biller: selectedBiller.name,
      amount: billAmount,
      category: selectedBiller.category,
    });

    if (success) {
      setIsPayBillsOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isPayBillsOpen}
      onClose={() => setIsPayBillsOpen(false)}
      title="Pay Utilities & Enterprise Bills"
      subtitle="One-click instantaneous bill liquidation via Future Protocol."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bill Category Carousel / Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Biller
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {billers.map((b) => {
              const Icon = b.icon;
              const isSelected = selectedBiller.id === b.id;
              return (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => handleBillerSelect(b)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan'
                      : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-cyan-400'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-white truncate">{b.name}</p>
                    <p className="text-[10px] text-slate-400">Est. ₹{b.sampleAmount.toLocaleString('en-IN')}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Consumer ID */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Consumer Account Number / Customer ID
          </label>
          <input
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm font-mono text-white"
          />
        </div>

        {/* Amount */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Bill Amount
            </label>
            <span className="text-xs text-slate-400">
              Balance: <span className="font-mono text-cyan-400">{formatINR(availableBalance)}</span>
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-3 text-lg font-bold text-cyan-400 font-mono">
              ₹
            </span>
            <input
              type="number"
              required
              min="1"
              max={availableBalance}
              step="any"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              className="w-full bg-slate-900/80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-lg font-mono font-bold text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsPayBillsOpen(false)}
            className="w-1/3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Zap}
            className="w-2/3"
          >
            Pay Bill Now
          </Button>
        </div>
      </form>
    </Modal>
  );
}
