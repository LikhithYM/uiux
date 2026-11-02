import React, { useState } from 'react';
import { Send, ArrowDownLeft, Zap, PlusCircle, ShieldCheck, QrCode } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import ThreeQuickActionIcon from '../three/ThreeQuickActionIcon';

export default function QuickActions() {
  const {
    setIsSendMoneyOpen,
    setIsRequestMoneyOpen,
    setIsPayBillsOpen,
    setIsAddMoneyOpen,
  } = useBanking();

  const [hoveredAction, setHoveredAction] = useState(null);

  const actions = [
    {
      label: 'Send Money',
      desc: 'Instant IMPS / UPI',
      icon: Send,
      threeType: 'send',
      color: 'from-cyan-500 to-blue-600',
      action: () => setIsSendMoneyOpen(true),
    },
    {
      label: 'Request Capital',
      desc: 'QR & Payment Link',
      icon: ArrowDownLeft,
      threeType: 'request',
      color: 'from-blue-600 to-indigo-600',
      action: () => setIsRequestMoneyOpen(true),
    },
    {
      label: 'Pay Bills',
      desc: 'Utilities & Subscriptions',
      icon: Zap,
      threeType: 'bills',
      color: 'from-indigo-600 to-purple-600',
      action: () => setIsPayBillsOpen(true),
    },
    {
      label: 'Add Funds',
      desc: 'NetBanking / Escrow',
      icon: PlusCircle,
      threeType: 'add',
      color: 'from-purple-600 to-pink-600',
      action: () => setIsAddMoneyOpen(true),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {actions.map((item) => {
        const isHovered = hoveredAction === item.label;

        return (
          <button
            key={item.label}
            onClick={item.action}
            onMouseEnter={() => setHoveredAction(item.label)}
            onMouseLeave={() => setHoveredAction(null)}
            className="group relative flex flex-col p-4 rounded-2xl glass-panel hover:glass-panel-glow border border-white/5 hover:border-cyan-500/40 transition-all duration-300 text-left overflow-hidden hover:-translate-y-0.5"
          >
            {/* Interactive 3D Micro Action Icon Container */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 group-hover:shadow-glow-cyan transition-all relative overflow-hidden`}>
              <ThreeQuickActionIcon type={item.threeType} isHovered={isHovered} />
            </div>

            <h4 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
              {item.label}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {item.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
}
