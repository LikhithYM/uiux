import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ShieldCheck, ChevronRight, PieChart } from 'lucide-react';
import Card from '../common/Card';
import MiniSparkline from '../charts/MiniSparkline';
import { useBanking } from '../../context/BankingContext';
import ThreePortfolioVisualization from '../three/ThreePortfolioVisualization';

export default function InvestmentOverviewWidget() {
  const { portfolio, setActiveTab, formatINR } = useBanking();
  const [show3D, setShow3D] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Investment Portfolio</h3>
          <p className="text-xs text-slate-400">Multi-asset sovereign wealth & digital yield</p>
        </div>
        <button
          onClick={() => setActiveTab('investments')}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group"
        >
          <span>View All Holdings</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main KPI Row */}
      <div className="flex flex-wrap items-end justify-between p-4 rounded-xl bg-slate-900/40 border border-white/5 mb-4">
        <div>
          <span className="text-xs text-slate-400">Total Portfolio Valuation</span>
          <p className="text-2xl font-bold font-mono text-white mt-0.5">
            {formatINR(portfolio.totalValue)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Total Returns</span>
            <p className="text-sm font-mono font-bold text-emerald-400">
              +{formatINR(portfolio.totalReturns)} (+{portfolio.returnPercentage}%)
            </p>
          </div>
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={18} />
          </span>
        </div>
      </div>

      {/* Asset Allocation Mini Progress Bar & 3D Visualizer */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
          <span>Asset Allocation</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShow3D((prev) => !prev)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
            >
              {show3D ? '2D Bar' : '3D Orbit'}
            </button>
            <span>4 Asset Classes</span>
          </div>
        </div>

        {show3D ? (
          <ThreePortfolioVisualization height={160} />
        ) : (
          <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-800">
            {portfolio.categories.map((c) => (
              <div
                key={c.name}
                style={{ width: `${c.allocation}%`, backgroundColor: c.color }}
                title={`${c.name}: ${c.allocation}%`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Holdings List (Top 3) */}
      <div className="space-y-2.5">
        {portfolio.holdings.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/20 hover:bg-slate-900/40 border border-white/5 transition-all text-xs"
          >
            <div>
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-[10px] text-slate-400">{item.ticker} • {item.shares} units</p>
            </div>
            <div className="hidden sm:block">
              <MiniSparkline data={item.trend} color={item.sparklineColor} width={70} height={22} />
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold text-white">{formatINR(item.totalValue)}</p>
              <p className="font-mono text-[11px] text-emerald-400">+{item.returnPercentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
