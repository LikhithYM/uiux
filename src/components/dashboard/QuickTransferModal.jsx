import React, { useState } from 'react';
import { Send, User, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useBanking } from '../../context/BankingContext';

export default function QuickTransferModal() {
  const { isSendMoneyOpen, setIsSendMoneyOpen, sendMoney, availableBalance, formatINR } = useBanking();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Instant UPI / IMPS');

  const frequentRecipients = [
    { name: 'Priya Sharma', handle: '@priya.tech', avatar: '👩‍💻' },
    { name: 'Arjun Mehta', handle: '@arjun.m', avatar: '👨‍💼' },
    { name: 'Sarah Jenkins', handle: '@s.jenkins', avatar: '👩‍🔬' },
    { name: 'Neural Dynamics', handle: '@neural.corp', avatar: '⚡' },
  ];

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipient.trim() || !amount) return;

    const success = sendMoney({
      recipient,
      amount,
      note,
      paymentMethod,
    });

    if (success) {
      setRecipient('');
      setAmount('');
      setNote('');
      setIsSendMoneyOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isSendMoneyOpen}
      onClose={() => setIsSendMoneyOpen(false)}
      title="Instant Quantum Transfer"
      subtitle="Send funds securely via high-speed zero-latency settlement."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Frequent Contacts */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Frequent Recipients
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {frequentRecipients.map((rec) => (
              <button
                type="button"
                key={rec.name}
                onClick={() => setRecipient(rec.name)}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all text-center ${
                  recipient === rec.name
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan'
                    : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xl mb-1">{rec.avatar}</span>
                <span className="text-xs font-semibold text-white truncate w-full">
                  {rec.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate w-full">
                  {rec.handle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Recipient Name or UPI ID
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-3.5 text-cyan-400" />
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Priya Sharma or name@okhdfc"
              className="w-full bg-slate-900/80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm text-white"
            />
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Transfer Amount
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
              min="1"
              max={availableBalance}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900/80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-lg font-mono font-bold text-white"
            />
          </div>

          {/* Quick Amount Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickAmounts.map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => setAmount(q.toString())}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
              >
                +₹{q.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Note / Purpose */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Reference Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Design consulting / Project milestone"
            className="w-full bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm text-white"
          />
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
          <Shield size={16} className="shrink-0" />
          <span>Zero-fee real-time IMPS settlement encrypted via 256-bit Quantum Shield.</span>
        </div>

        {/* Submit */}
        <div className="pt-2 flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsSendMoneyOpen(false)}
            className="w-1/3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Send}
            className="w-2/3"
          >
            Send Money Now
          </Button>
        </div>
      </form>
    </Modal>
  );
}
