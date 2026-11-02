import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CreditCard,
  Building,
  RefreshCw,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { useBanking } from '../context/BankingContext';

export default function Wallet() {
  const {
    availableBalance,
    totalBalance,
    user,
    cards,
    setIsAddMoneyOpen,
    setIsSendMoneyOpen,
    formatINR,
    showToast,
    transactions,
  } = useBanking();

  const [copiedField, setCopiedField] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(cards[0].id);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    showToast('Copied to Clipboard', `${fieldName} copied successfully.`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          My Quantum Wallet
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your high-liquidity fiat, digital vaults, and multi-currency accounts.
        </p>
      </div>

      {/* Top Main Cards: Liquid Balance + Account Identifiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Available Balance Card */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8 relative overflow-hidden" glow>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">
                  Liquid Available Capital
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                  <AnimatedCounter value={availableBalance} prefix="₹" decimals={2} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  icon={ArrowDownLeft}
                  size="sm"
                  onClick={() => setIsAddMoneyOpen(true)}
                >
                  Deposit Funds
                </Button>
                <Button
                  variant="secondary"
                  icon={ArrowUpRight}
                  size="sm"
                  onClick={() => setIsSendMoneyOpen(true)}
                >
                  Withdraw / Send
                </Button>
              </div>
            </div>

            {/* Sovereign Account Identifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Account Number</p>
                  <p className="font-mono text-xs font-semibold text-white mt-0.5">
                    {user.accountNumber}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(user.accountNumber, 'Account Number')}
                  className="p-1.5 text-slate-400 hover:text-cyan-400"
                >
                  {copiedField === 'Account Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">IFSC / Routing Code</p>
                  <p className="font-mono text-xs font-semibold text-white mt-0.5">
                    {user.ifsc}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(user.ifsc, 'IFSC Code')}
                  className="p-1.5 text-slate-400 hover:text-cyan-400"
                >
                  {copiedField === 'IFSC Code' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">UPI Virtual ID</p>
                  <p className="font-mono text-xs font-semibold text-white mt-0.5 truncate max-w-[120px]">
                    {user.upiId}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(user.upiId, 'UPI ID')}
                  className="p-1.5 text-slate-400 hover:text-cyan-400"
                >
                  {copiedField === 'UPI ID' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Security & Multi-Currency Status */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={20} className="text-cyan-400" />
                <h3 className="font-display font-bold text-base text-white">Quantum Escrow Vault</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Your wallet is secured by hardware security modules and multi-signatory quantum cryptographic protocols.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Daily Withdrawal Cap</span>
                  <span className="font-mono font-semibold text-white">₹10,00,000.00</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Yield Accrual</span>
                  <span className="font-mono font-semibold text-emerald-400">3.85% APY Daily</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Settlement Speed</span>
                  <span className="font-mono font-semibold text-cyan-400">&lt; 300 ms Instant</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Audit Status: Cleared</span>
              <Badge variant="emerald" size="xs">Verified Sovereign</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Connected Cards Switcher & Card Details */}
      <div>
        <h3 className="font-display font-bold text-lg text-white mb-4">
          Linked Sovereign Cards & Limits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const isSelected = card.id === selectedCard.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-glow-cyan'
                    : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-slate-300">{card.name}</span>
                  <Badge variant={card.status === 'Active' ? 'emerald' : 'rose'} size="xs">
                    {card.status}
                  </Badge>
                </div>
                <p className="font-mono text-base font-bold text-white tracking-wider my-2">
                  {card.maskedNumber}
                </p>
                <div className="flex justify-between items-end text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                  <span>Exp: {card.expiry}</span>
                  <span className="font-bold text-cyan-400">{card.network}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Card Realtime Spent Progress */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-base text-white">
              Daily Spending Utilization — {selectedCard.name}
            </h4>
            <p className="text-xs text-slate-400">Real-time spend against sovereign daily limit</p>
          </div>
          <span className="font-mono text-sm font-bold text-cyan-400">
            {formatINR(selectedCard.currentSpent)} / {formatINR(selectedCard.dailyLimit)}
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full transition-all duration-700 shadow-glow-cyan"
            style={{
              width: `${Math.min(100, Math.round((selectedCard.currentSpent / selectedCard.dailyLimit) * 100))}%`,
            }}
          />
        </div>
      </Card>
    </div>
  );
}
