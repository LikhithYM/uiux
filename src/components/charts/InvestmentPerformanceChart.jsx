import React from 'react';
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

export default function InvestmentPerformanceChart({ data = [], height = 240 }) {
  const { theme, formatINR } = useBanking();
  const isDark = theme === 'dark';

  const CustomInvTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 text-xs shadow-xl space-y-1">
          <p className="font-semibold text-white">{label}</p>
          <div className="flex justify-between gap-4">
            <span className="text-cyan-400">Portfolio Value:</span>
            <span className="font-mono font-bold text-white">{formatINR(payload[0].value)}</span>
          </div>
          {payload[1] && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Benchmark Index:</span>
              <span className="font-mono text-slate-300">{formatINR(payload[1].value)}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="invPerfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
            vertical={false}
          />
          <XAxis
            dataKey="date"
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
            domain={['dataMin - 10000', 'dataMax + 10000']}
            tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`}
          />
          <Tooltip content={<CustomInvTooltip />} />
          <Area
            type="monotone"
            dataKey="portfolio"
            stroke="#10B981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#invPerfGrad)"
          />
          <Area
            type="monotone"
            dataKey="benchmark"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fillOpacity={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
