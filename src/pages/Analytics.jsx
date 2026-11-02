import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Zap,
  ShoppingBag,
  Car,
  Activity,
  Utensils,
  Film,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import CashFlowChart from '../components/charts/CashFlowChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import Badge from '../components/common/Badge';
import { useBanking } from '../context/BankingContext';
import {
  weeklySpendingData,
  categoryExpensesData,
  aiFinancialInsights,
} from '../data/mockAnalytics';

export default function Analytics() {
  const { theme, formatINR } = useBanking();
  const isDark = theme === 'dark';

  const categoryIcons = {
    Shopping: ShoppingBag,
    'Bills & Utilities': Zap,
    Healthcare: Activity,
    Transportation: Car,
    'Food & Dining': Utensils,
    Entertainment: Film,
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 text-xs shadow-xl">
          <p className="font-semibold text-white">{label}</p>
          <p className="font-mono text-cyan-400 font-bold mt-0.5">
            ₹{Number(payload[0].value).toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Spending & Cash Flow Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deep-dive algorithmic diagnostics into your liquidity patterns and expenditure velocity.
        </p>
      </div>

      {/* Top 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Monthly Inflow</span>
            <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
              <TrendingUp size={13} /> +14.2%
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-white">₹3,85,000.00</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Consistently outperforming baseline</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Operational Burn Rate</span>
            <span className="text-cyan-400 flex items-center gap-0.5 font-bold">
              -6.5% lower
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-cyan-300">₹1,64,200.00</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Well within target threshold of ₹1.8L</span>
        </Card>

        <Card className="p-5" glow>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Sovereign Savings Rate</span>
            <Badge variant="cyan" size="xs">Optimal</Badge>
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">57.4%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Top 1% fiscal efficiency tier</span>
        </Card>
      </div>

      {/* Primary Cashflow Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-display font-bold text-lg text-white">
            Capital Velocity: Inflow vs Expenditure
          </h3>
          <p className="text-xs text-slate-400">
            Interactive multi-horizon timeline tracking net surplus generation.
          </p>
        </div>
        <CashFlowChart height={300} />
      </Card>

      {/* Split Grid: Category Breakdown + Daily Spending Intensity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Category Pie & Details */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-lg text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Proportional allocation across lifestyle and operational buckets.
            </p>
          </div>

          <CategoryPieChart height={240} />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 pt-6 border-t border-white/5">
            {categoryExpensesData.map((cat) => {
              const Icon = categoryIcons[cat.name] || ShoppingBag;
              return (
                <div
                  key={cat.name}
                  className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="p-1.5 rounded-lg text-xs"
                      style={{ backgroundColor: cat.color + '20', color: cat.color }}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{cat.percentage}%</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-300 truncate">{cat.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{formatINR(cat.value)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Weekly Day-by-Day Burn Intensity */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Intra-Week Spending Intensity
                </h3>
                <p className="text-xs text-slate-400">Expenditure pattern across days of the week</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Peak: Saturday
              </span>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={weeklySpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="amount"
                    fill="#00F0FF"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 mt-4 flex items-center gap-3">
            <Sparkles size={18} className="text-cyan-400 shrink-0" />
            <span>
              Your weekend velocity increases by 44%. Automated budget buffers have been assigned.
            </span>
          </div>
        </Card>
      </div>

      {/* AI Financial Copilot Insights Full Grid */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shadow-glow-cyan">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              AI Algorithmic Fiscal Insights
            </h3>
            <p className="text-xs text-slate-400">Machine-learning generated actions to optimize your balance sheet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiFinancialInsights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="cyan" size="xs">{insight.tag}</Badge>
                  <span className="font-mono text-xs font-bold text-emerald-400">{insight.impact}</span>
                </div>
                <h4 className="font-semibold text-sm text-white">{insight.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-cyan-400 hover:underline cursor-pointer font-medium">Apply Recommendation</span>
                <ArrowUpRight size={14} className="text-cyan-400" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
