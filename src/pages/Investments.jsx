import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  PieChart,
  ShieldCheck,
  Sparkles,
  ArrowLeftRight,
  PlusCircle,
  AlertCircle,
  Coins,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ThreeAssetOrb from '../components/three/ThreeAssetOrb';
import ThreePortfolioVisualization from '../components/three/ThreePortfolioVisualization';
import InvestmentPerformanceChart from '../components/charts/InvestmentPerformanceChart';
import MiniSparkline from '../components/charts/MiniSparkline';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { useBanking } from '../context/BankingContext';

export default function Investments() {
  const { portfolio, formatINR, showToast } = useBanking();

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [tradeAmount, setTradeAmount] = useState('');
  const [portfolioView, setPortfolioView] = useState('3d-allocation');

  const handleTradeSubmit = (e) => {
    e.preventDefault();
    if (!tradeAmount) return;

    showToast(
      `${tradeType === 'buy' ? 'Investment Allocated' : 'Asset Liquidated'}`,
      `Simulated ${tradeType} order of ₹${Number(tradeAmount).toLocaleString('en-IN')} for ${selectedAsset.ticker} executed at market price.`,
      'success'
    );
    setTradeAmount('');
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Disclaimer Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>
            Simulated Portfolio — All investment tickers, prices, and yields are modeled mock data.
          </span>
        </div>
        <Badge variant="cyan" size="xs">Simulated Environment</Badge>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Sovereign Investment Portfolio
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Automated multi-asset allocation spanning high-growth equities, digital assets, and sovereign debt.
        </p>
      </div>

      {/* Main KPI Row + 3D Holographic Vault Orb */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Stats Column */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 sm:p-8" glow>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">
                  Total Portfolio Valuation
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                  <AnimatedCounter value={portfolio.totalValue} prefix="₹" decimals={2} />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider">All-Time Returns</span>
                <div className="text-lg font-bold font-mono">
                  +{formatINR(portfolio.totalReturns)} (+{portfolio.returnPercentage}%)
                </div>
              </div>
            </div>

            {/* Performance Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400">Invested Capital</span>
                <p className="font-mono font-bold text-white mt-0.5">{formatINR(portfolio.investedAmount)}</p>
              </div>
              <div>
                <span className="text-slate-400">Today's Movement</span>
                <p className="font-mono font-bold text-emerald-400 mt-0.5">
                  +{formatINR(portfolio.dailyChange)} (+{portfolio.dailyChangePercentage}%)
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400">Sharpe Ratio</span>
                <p className="font-mono font-bold text-cyan-400 mt-0.5">2.48 (Low Volatility)</p>
              </div>
            </div>
          </Card>

          {/* Allocation Breakdown Bar & Legend */}
          <Card className="p-6">
            <h4 className="font-semibold text-sm text-white mb-3">Asset Class Distribution</h4>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-800 mb-4">
              {portfolio.categories.map((c) => (
                <div
                  key={c.name}
                  style={{ width: `${c.allocation}%`, backgroundColor: c.color }}
                  title={`${c.name}: ${c.allocation}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {portfolio.categories.map((c) => (
                <div key={c.name} className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-300 font-medium truncate">{c.name}</span>
                  </div>
                  <p className="font-mono font-bold text-white">{formatINR(c.value)}</p>
                  <p className="text-[10px] text-slate-500">{c.allocation}% allocation</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 3D Visualizer: 3D Portfolio Allocation & Holographic Wealth Orb */}
        <div className="lg:col-span-5">
          <Card className="p-6 h-full flex flex-col justify-between items-center text-center relative overflow-hidden" glow>
            <div className="w-full flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setPortfolioView('3d-allocation')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    portfolioView === '3d-allocation'
                      ? 'bg-cyan-500 text-black shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D Allocation
                </button>
                <button
                  onClick={() => setPortfolioView('orb')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    portfolioView === 'orb'
                      ? 'bg-cyan-500 text-black shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quantum Orb
                </button>
              </div>
              <Badge variant="cyan" size="xs">Interactive 3D</Badge>
            </div>

            <div className="w-full my-auto">
              {portfolioView === '3d-allocation' ? (
                <ThreePortfolioVisualization height={250} />
              ) : (
                <ThreeAssetOrb height={250} />
              )}
            </div>

            <div className="w-full pt-4 border-t border-white/5 text-xs text-slate-400">
              <p>
                {portfolioView === '3d-allocation'
                  ? 'Interactive 3D asset allocation — Hover extruded sectors to inspect valuations and weights.'
                  : 'Holographic asset distribution reflecting diversified cryptographic liquidity.'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Performance Historical Area Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Portfolio Growth vs Benchmark
            </h3>
            <p className="text-xs text-slate-400">Historical performance indexed against the Nifty 50</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Portfolio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-400">Benchmark</span>
            </div>
          </div>
        </div>
        <InvestmentPerformanceChart data={portfolio.performanceHistory} height={260} />
      </Card>

      {/* Holdings Table with Live Simulation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Active Asset Holdings</h3>
            <p className="text-xs text-slate-400">Real-time valuation, allocation weights, and order simulation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-white/5 font-semibold">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Holdings</th>
                <th className="py-3 px-4 hidden md:table-cell">Trend</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-right">Returns</th>
                <th className="py-3 px-4 text-center">Simulate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {portfolio.holdings.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] font-mono text-cyan-400">{item.ticker}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-white/5 text-[11px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {item.shares} units
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <MiniSparkline data={item.trend} color={item.sparklineColor} width={70} height={22} />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                    {formatINR(item.currentPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {formatINR(item.totalValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    +{item.returnPercentage}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAsset(item)}
                    >
                      Trade
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Simulated Trade Order Modal */}
      {selectedAsset && (
        <Modal
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          title={`Simulate Trade: ${selectedAsset.ticker}`}
          subtitle={`${selectedAsset.name} • Price: ${formatINR(selectedAsset.currentPrice)}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleTradeSubmit} className="space-y-4">
            {/* Buy / Sell toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTradeType('buy')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  tradeType === 'buy'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Buy (Simulated)
              </button>
              <button
                type="button"
                onClick={() => setTradeType('sell')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  tradeType === 'sell'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sell (Simulated)
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount to Allocate
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-lg font-bold text-cyan-400 font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="500"
                  step="any"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900/80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-lg font-mono font-bold text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedAsset(null)}
                className="w-1/3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={tradeType === 'buy' ? 'primary' : 'danger'}
                className="w-2/3"
              >
                Execute {tradeType.toUpperCase()} Order
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
