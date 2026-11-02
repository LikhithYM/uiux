import React, { useState } from 'react';
import { PlusCircle, Landmark, CreditCard, Smartphone, ShieldCheck } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useBanking } from '../../context/BankingContext';

export default function AddMoneyModal() {
  const { isAddMoneyOpen, setIsAddMoneyOpen, addMoney } = useBanking();

  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('HDFC Premier NetBanking');

  const sources = [
    { name: 'HDFC Premier NetBanking', icon: Landmark, desc: 'A/c ••4491' },
    { name: 'Quantum UPI AutoPay', icon: Smartphone, desc: 'Instant VPA' },
    { name: 'Corporate Debit Card', icon: CreditCard, desc: 'Mastercard ••8829' },
  ];

  const presets = [5000, 20000, 50000, 100000, 250000];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const success = addMoney({
      amount,
      source,
    });

    if (success) {
      setAmount('');
      setIsAddMoneyOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isAddMoneyOpen}
      onClose={() => setIsAddMoneyOpen(false)}
      title="Add Capital to Wallet"
      subtitle="Top up your liquid balance from connected sovereign accounts."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Funding Source
          </label>
          <div className="space-y-2">
            {sources.map((s) => {
              const Icon = s.icon;
              const isSelected = source === s.name;
              return (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => setSource(s.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan'
                      : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-cyan-400'}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.desc}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deposit Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Deposit Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-lg font-bold text-cyan-400 font-mono">
              ₹
            </span>
            <input
              type="number"
              required
              min="100"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900/80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-lg font-mono font-bold text-white"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {presets.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setAmount(p.toString())}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
              >
                +₹{p.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <ShieldCheck size={16} className="shrink-0" />
          <span>RBI-regulated sovereign escrow with immediate fund availability.</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsAddMoneyOpen(false)}
            className="w-1/3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={PlusCircle}
            className="w-2/3"
          >
            Deposit Capital
          </Button>
        </div>
      </form>
    </Modal>
  );
}
