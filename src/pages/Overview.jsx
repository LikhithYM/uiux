import React from 'react';
import HeroBalance from '../components/dashboard/HeroBalance';
import ThreeCardCanvas from '../components/three/ThreeCardCanvas';
import QuickActions from '../components/dashboard/QuickActions';
import CashFlowChart from '../components/charts/CashFlowChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import SavingsGoals from '../components/dashboard/SavingsGoals';
import InvestmentOverviewWidget from '../components/dashboard/InvestmentOverviewWidget';
import RecentTransactionsWidget from '../components/dashboard/RecentTransactionsWidget';
import Card from '../components/common/Card';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { aiFinancialInsights } from '../data/mockAnalytics';

export default function Overview() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Top Hero Balance Section + 3D Card Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        <div className="xl:col-span-2">
          <HeroBalance />
        </div>
        <div className="xl:col-span-1">
          <Card className="p-6 h-full flex flex-col justify-between" glow>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" />
                <h3 className="font-display font-bold text-base text-white">3D Sovereign Card</h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Interactive
              </span>
            </div>
            <ThreeCardCanvas />
          </Card>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Instant Financial Operations
        </h3>
        <QuickActions />
      </div>

      {/* Spending Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Cash Flow Analytics</h3>
                <p className="text-xs text-slate-400">Monthly capital inflows vs operational expenditure</p>
              </div>
            </div>
            <CashFlowChart height={280} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 flex flex-col justify-between">
            <div className="mb-2">
              <h3 className="font-display font-bold text-lg text-white">Category Outflow</h3>
              <p className="text-xs text-slate-400">Highest expenditure distributions</p>
            </div>
            <CategoryPieChart height={220} />
          </Card>
        </div>
      </div>

      {/* Savings Goals & Investment Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <SavingsGoals />
        <InvestmentOverviewWidget />
      </div>

      {/* Transaction History & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <RecentTransactionsWidget limit={5} showFilters={true} />
        </div>

        {/* AI Financial Advisor Insights Box */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 shadow-glow-purple">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">AI Financial Copilot</h3>
                  <p className="text-xs text-slate-400">Real-time yield and frugality recommendations</p>
                </div>
              </div>

              <div className="space-y-3">
                {aiFinancialInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{insight.title}</span>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                        {insight.impact}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{insight.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-cyan-400" />
                Adaptive Yield Engine
              </span>
              <span className="text-[11px] text-cyan-400 font-semibold cursor-pointer hover:underline">
                Explore Advisory
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
