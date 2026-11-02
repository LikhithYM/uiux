import React, { useState } from 'react';
import { Target, Car, Plane, ShieldCheck, Cpu, Plus, Sparkles, ChevronRight, Box } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useBanking } from '../../context/BankingContext';
import ThreeSavingsVault from '../three/ThreeSavingsVault';

export default function SavingsGoals() {
  const { savingsGoals, setActiveGoalModal, formatINR } = useBanking();
  const [selectedGoalId, setSelectedGoalId] = useState(savingsGoals[0]?.id || 'goal-1');
  const [show3DVault, setShow3DVault] = useState(true);

  const activeGoal = savingsGoals.find((g) => g.id === selectedGoalId) || savingsGoals[0];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Car':
        return <Car size={18} />;
      case 'Plane':
        return <Plane size={18} />;
      case 'ShieldCheck':
        return <ShieldCheck size={18} />;
      default:
        return <Cpu size={18} />;
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Savings Vaults & Goals</h3>
          <p className="text-xs text-slate-400">Automated capital lock-in & 3D yield vaults</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShow3DVault((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
          >
            <Box size={13} />
            <span>{show3DVault ? 'Hide 3D Vault' : '3D Vault View'}</span>
          </button>
          <span className="text-xs font-semibold text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-full border border-white/5">
            {savingsGoals.length} Active Vaults
          </span>
        </div>
      </div>

      {/* Featured 3D Interactive Vault Canvas */}
      {show3DVault && (
        <div className="mb-5 p-4 rounded-2xl bg-slate-900/50 border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
              3D Quantum Reserve Vault — {activeGoal?.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Click any goal card below to inspect its 3D vault
            </span>
          </div>

          <ThreeSavingsVault goal={activeGoal} height={210} />
        </div>
      )}

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savingsGoals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isSelected = goal.id === activeGoal?.id;

          return (
            <div
              key={goal.id}
              onClick={() => setSelectedGoalId(goal.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between group border ${
                isSelected
                  ? 'bg-slate-900/80 border-cyan-500/50 shadow-glow-cyan'
                  : 'bg-slate-900/40 hover:bg-slate-900/60 border-white/5 hover:border-cyan-500/30'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: goal.color + '25', color: goal.color }}
                    >
                      {getIcon(goal.icon)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {goal.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{goal.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {progress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-2 my-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${goal.accentGradient} transition-all duration-700 shadow-glow-cyan`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Amount figures */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs font-mono gap-1">
                  <span className="text-slate-200 font-bold">
                    {formatINR(goal.currentAmount)}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Goal: {formatINR(goal.targetAmount)}
                  </span>
                </div>
              </div>

              {/* Boost button */}
              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Target: {goal.deadline}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGoalModal(goal);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 hover:translate-x-0.5 transition-transform"
                >
                  <span>Deposit Funds</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
