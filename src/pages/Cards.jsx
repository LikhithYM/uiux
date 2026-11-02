import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Unlock,
  Sliders,
  Copy,
  Check,
  Eye,
  EyeOff,
  Globe,
  Radio,
  ShoppingBag,
  Landmark,
  ShieldCheck,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ThreeCardCanvas from '../components/three/ThreeCardCanvas';
import { useBanking } from '../context/BankingContext';

export default function Cards() {
  const {
    cards,
    toggleCardStatus,
    updateCardLimit,
    toggleCardFeature,
    formatINR,
    showToast,
  } = useBanking();

  const [selectedCardId, setSelectedCardId] = useState(cards[0].id);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [copied, setCopied] = useState(false);

  const currentCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleCopyNumber = () => {
    navigator.clipboard?.writeText(currentCard.number.replace(/\s+/g, ''));
    setCopied(true);
    showToast('Card Number Copied', 'Sovereign card number copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (newPin.length === 4) {
      showToast('PIN Updated', 'Your quantum encrypted card PIN has been updated.', 'success');
      setNewPin('');
      setIsPinModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Sovereign Card Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize hardware physical metals, single-use cyber cards, and spending boundaries.
        </p>
      </div>

      {/* Main Grid: 3D Centerpiece + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: 3D Card Interactive Canvas & Switcher */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 relative overflow-hidden" glow>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Interactive 3D Hardware Render
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-0.5">
                  {currentCard.name}
                </h3>
              </div>
              <Badge variant={currentCard.status === 'Active' ? 'emerald' : 'rose'} size="sm">
                {currentCard.status}
              </Badge>
            </div>

            {/* 3D Card Scene */}
            <ThreeCardCanvas />

            {/* Sensitive Data Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5 mt-4 text-xs">
              <button
                onClick={handleCopyNumber}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Number'}</span>
              </button>

              <button
                onClick={() => setShowCVV((prev) => !prev)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-colors"
              >
                {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showCVV ? `CVV: ${currentCard.cvv}` : 'Reveal CVV'}</span>
              </button>

              <button
                onClick={() => setIsPinModalOpen(true)}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-colors"
              >
                <KeyRound size={14} className="text-cyan-400" />
                <span>Reset PIN</span>
              </button>
            </div>
          </Card>

          {/* Cards Switcher Horizontal Carousel */}
          <div>
            <h4 className="font-semibold text-sm text-slate-300 mb-3">Your Digital & Metal Cards</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cards.map((c) => {
                const isSelected = c.id === currentCard.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCardId(c.id)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan'
                        : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{c.tier}</span>
                      <span className={`w-2 h-2 rounded-full ${c.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    </div>
                    <p className="font-mono text-sm font-bold text-white">{c.maskedNumber}</p>
                    <p className="text-[11px] text-cyan-400 mt-1">{c.type}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Freeze Toggle, Limit Slider & Permissions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Freeze/Unfreeze Action Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-white">Card Status</h4>
                <p className="text-xs text-slate-400">Instantly halt all outgoing authorizations</p>
              </div>
              <Button
                variant={currentCard.status === 'Active' ? 'danger' : 'primary'}
                icon={currentCard.status === 'Active' ? Lock : Unlock}
                size="sm"
                onClick={() => toggleCardStatus(currentCard.id)}
              >
                {currentCard.status === 'Active' ? 'Freeze Card' : 'Unfreeze Card'}
              </Button>
            </div>
          </Card>

          {/* Spending Limit Dynamic Slider */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-display font-bold text-base text-white">Daily Spending Limit</h4>
              <span className="font-mono text-sm font-bold text-cyan-400">
                {formatINR(currentCard.dailyLimit)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Currently utilized: <span className="font-mono text-white">{formatINR(currentCard.currentSpent)}</span>
            </p>

            <input
              type="range"
              min="50000"
              max="1500000"
              step="50000"
              value={currentCard.dailyLimit}
              onChange={(e) => updateCardLimit(currentCard.id, Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>₹50,000</span>
              <span>₹7,50,000</span>
              <span>₹15,00,000</span>
            </div>
          </Card>

          {/* Security Permissions Toggle List */}
          <Card className="p-6">
            <h4 className="font-display font-bold text-base text-white mb-4">
              Security & Channel Toggles
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Online E-Commerce</p>
                    <p className="text-[10px] text-slate-400">Digital websites & recurring billing</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentCard.onlinePurchases}
                  onChange={() => toggleCardFeature(currentCard.id, 'onlinePurchases')}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">International Usage</p>
                    <p className="text-[10px] text-slate-400">Cross-border foreign exchange settlement</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentCard.internationalUsage}
                  onChange={() => toggleCardFeature(currentCard.id, 'internationalUsage')}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <Radio size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Contactless Tap-to-Pay</p>
                    <p className="text-[10px] text-slate-400">NFC point of sale contactless waves</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentCard.contactless}
                  onChange={() => toggleCardFeature(currentCard.id, 'contactless')}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <Landmark size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">ATM Cash Liquidation</p>
                    <p className="text-[10px] text-slate-400">Physical terminal cash dispensation</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentCard.atmWithdrawals}
                  onChange={() => toggleCardFeature(currentCard.id, 'atmWithdrawals')}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Reset PIN Modal */}
      {isPinModalOpen && (
        <Modal
          isOpen={isPinModalOpen}
          onClose={() => setIsPinModalOpen(false)}
          title="Update Sovereign Card PIN"
          subtitle="Set a new 4-digit PIN for ATM and retail terminals."
          maxWidth="max-w-sm"
        >
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                New 4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-[1em] text-2xl font-mono bg-slate-900/80 py-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsPinModalOpen(false)}
                className="w-1/3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={newPin.length !== 4}
                className="w-2/3"
              >
                Update PIN
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
