import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ShieldCheck,
  Plus,
  Send,
  Zap,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import AnimatedCounter from '../common/AnimatedCounter';
import Button from '../common/Button';
import { useBanking } from '../../context/BankingContext';

export default function HeroBalance() {
  const {
    totalBalance,
    availableBalance,
    investedAmount,
    monthlyChange,
    setIsSendMoneyOpen,
    setIsRequestMoneyOpen,
    setIsPayBillsOpen,
    setIsAddMoneyOpen,
    formatINR,
  } = useBanking();

  return (
    <div className="relative rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
      {/* Background Holographic Glow Flares */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Main Balance Display */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-sans">
              Total Consolidated Net Worth
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} />
              {monthlyChange} this month
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 font-display">
              <AnimatedCounter value={totalBalance} prefix="₹" decimals={2} />
            </span>
            <span className="text-xs font-mono text-cyan-400/80 font-medium">INR</span>
          </div>

          {/* Sub Balances: Available vs Invested */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
                <span>Available Liquid Balance</span>
              </div>
              <p className="text-lg sm:text-xl font-bold font-mono text-white">
                <AnimatedCounter value={availableBalance} prefix="₹" decimals={2} />
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-glow-purple" />
                <span>Invested Assets</span>
              </div>
              <p className="text-lg sm:text-xl font-bold font-mono text-cyan-300">
                <AnimatedCounter value={investedAmount} prefix="₹" decimals={2} />
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row lg:grid lg:grid-cols-2">
            <Button
              variant="primary"
              size="md"
              icon={Send}
              onClick={() => setIsSendMoneyOpen(true)}
              className="w-full shadow-glow-cyan"
            >
              Send Money
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={Plus}
              onClick={() => setIsAddMoneyOpen(true)}
              className="w-full border-cyan-500/30 hover:border-cyan-400"
            >
              Add Money
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={ArrowDownLeft}
              onClick={() => setIsRequestMoneyOpen(true)}
              className="w-full"
            >
              Request
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={Zap}
              onClick={() => setIsPayBillsOpen(true)}
              className="w-full"
            >
              Pay Bills
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
