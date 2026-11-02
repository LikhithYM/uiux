import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { categoryExpensesData } from '../../data/mockAnalytics';
import { useBanking } from '../../context/BankingContext';

export default function CategoryPieChart({ height = 240 }) {
  const { formatINR } = useBanking();
  const total = categoryExpensesData.reduce((acc, curr) => acc + curr.value, 0);

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 text-xs shadow-xl">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="font-mono text-cyan-400 mt-0.5">{formatINR(data.value)} ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '100%', height }} className="relative">
        <ResponsiveContainer>
          <PieChart>
            <Tooltip content={<CustomPieTooltip />} />
            <Pie
              data={categoryExpensesData}
              innerRadius={65}
              outerRadius={88}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {categoryExpensesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-slate-400 font-medium">Total Spent</span>
          <span className="text-base font-bold text-white font-mono">{formatINR(total)}</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-2">
        {categoryExpensesData.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-slate-300 truncate">{cat.name}</span>
            </div>
            <span className="font-mono text-slate-400 font-medium">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
