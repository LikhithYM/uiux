import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useBanking } from '../../context/BankingContext';
import { monthlyCashflowData, weeklySpendingData } from '../../data/mockAnalytics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 shadow-2xl text-xs space-y-1.5 font-sans">
        <p className="font-semibold text-white border-b border-white/10 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-300 capitalize">{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-white">
              ₹{Number(entry.value).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CashFlowChart({ height = 280 }) {
  const { theme } = useBanking();
  const [timeRange, setTimeRange] = useState('monthly');

  const isDark = theme === 'dark';

  const chartData =
    timeRange === 'weekly'
      ? weeklySpendingData.map((d) => ({
          month: d.day,
          income: d.amount * 1.6,
          expenses: d.amount,
        }))
      : timeRange === 'yearly'
      ? [
          { month: '2023', income: 2800000, expenses: 1450000 },
          { month: '2024', income: 3600000, expenses: 1820000 },
          { month: '2025', income: 4400000, expenses: 2100000 },
          { month: '2026', income: 5100000, expenses: 2340000 },
        ]
      : monthlyCashflowData;

  return (
    <div className="w-full flex flex-col">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
            <span className="text-slate-300 font-medium">Income Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-glow-purple" />
            <span className="text-slate-300 font-medium">Outflow Expenses</span>
          </div>
        </div>

        <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-white/5">
          {['weekly', 'monthly', 'yearly'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                timeRange === t
                  ? 'bg-cyan-500 text-black font-semibold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGlowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGlowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
              vertical={false}
            />

            <XAxis
              dataKey="month"
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
              tickFormatter={(v) => (v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${v / 1000}k`)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="income"
              name="income"
              stroke="#00F0FF"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGlowGrad)"
            />

            <Area
              type="monotone"
              dataKey="expenses"
              name="expenses"
              stroke="#6366F1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expenseGlowGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
