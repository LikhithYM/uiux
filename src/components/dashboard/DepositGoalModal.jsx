import React, { useState } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useBanking } from '../../context/BankingContext';

export default function DepositGoalModal() {
  const { activeGoalModal, setActiveGoalModal, depositToGoal, availableBalance, formatINR } = useBanking();
  const [amount, setAmount] = useState('');

  if (!activeGoalModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const success = depositToGoal(activeGoalModal.id, amount);
    if (success) {
      setAmount('');
      setActiveGoalModal(null);
    }
  };

  const remaining = Math.max(0, activeGoalModal.targetAmount - activeGoalModal.currentAmount);

  return (
    <Modal
      isOpen={!!activeGoalModal}
      onClose={() => setActiveGoalModal(null)}
      title={`Boost: ${activeGoalModal.name}`}
      subtitle={activeGoalModal.subtitle}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Progress summary */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Current Saved</p>
            <p className="text-base font-bold text-white font-mono">{formatINR(activeGoalModal.currentAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Target Amount</p>
            <p className="text-base font-bold text-cyan-400 font-mono">{formatINR(activeGoalModal.targetAmount)}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Allocation Amount
            </label>
            <span className="text-xs text-slate-400">
              Available: <span className="font-mono text-cyan-400">{formatINR(availableBalance)}</span>
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-3 text-lg font-bold text-cyan-400 font-mono">
              ₹
            </span>
            <input
              type="number"
              required
              min="500"
              max={availableBalance}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900/80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-lg font-mono font-bold text-white"
            />
          </div>

          <div className="flex gap-2 mt-2">
            {[5000, 15000, 25000, Math.min(50000, remaining)].map((preset, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setAmount(preset.toString())}
                className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/30 transition-colors"
              >
                +₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setActiveGoalModal(null)}
            className="w-1/3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Target}
            className="w-2/3"
          >
            Allocate Funds
          </Button>
        </div>
      </form>
    </Modal>
  );
}
