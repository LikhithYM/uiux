import React, { useState } from 'react';
import { ArrowDownLeft, Copy, Check, QrCode, Share2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useBanking } from '../../context/BankingContext';

export default function RequestMoneyModal() {
  const { isRequestMoneyOpen, setIsRequestMoneyOpen, user, showToast } = useBanking();
  const [requestAmount, setRequestAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const paymentLink = `https://pay.futurebank.io/${user.upiId}?amt=${requestAmount || 0}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(paymentLink);
    setCopied(true);
    showToast('Link Copied', 'Encrypted payment link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isRequestMoneyOpen}
      onClose={() => setIsRequestMoneyOpen(false)}
      title="Request Capital & Payment Link"
      subtitle="Generate a sovereign encrypted payment link or QR code."
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Dynamic QR Code Simulation */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-center">
          <div className="p-4 bg-white rounded-xl shadow-glow-cyan mb-3">
            {/* High visual fidelity QR SVG representation */}
            <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="white" />
              <rect x="10" y="10" width="25" height="25" fill="#05070e" />
              <rect x="14" y="14" width="17" height="17" fill="white" />
              <rect x="18" y="18" width="9" height="9" fill="#00F0FF" />

              <rect x="65" y="10" width="25" height="25" fill="#05070e" />
              <rect x="69" y="14" width="17" height="17" fill="white" />
              <rect x="73" y="18" width="9" height="9" fill="#00F0FF" />

              <rect x="10" y="65" width="25" height="25" fill="#05070e" />
              <rect x="14" y="69" width="17" height="17" fill="white" />
              <rect x="18" y="73" width="9" height="9" fill="#00F0FF" />

              {/* Data modules */}
              <rect x="42" y="15" width="8" height="8" fill="#05070e" />
              <rect x="45" y="35" width="12" height="6" fill="#05070e" />
              <rect x="60" y="45" width="15" height="10" fill="#6366F1" />
              <rect x="30" y="45" width="10" height="15" fill="#05070e" />
              <rect x="45" y="65" width="8" height="18" fill="#05070e" />
              <rect x="65" y="65" width="15" height="8" fill="#05070e" />
              <rect x="75" y="80" width="12" height="10" fill="#00F0FF" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-white">{user.upiId}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Scan with any UPI / Web3 Banking App</p>
        </div>

        {/* Amount to request */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Requested Amount (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-base font-bold text-cyan-400 font-mono">
              ₹
            </span>
            <input
              type="number"
              value={requestAmount}
              onChange={(e) => setRequestAmount(e.target.value)}
              placeholder="e.g. 15000"
              className="w-full bg-slate-900/80 pl-9 pr-4 py-2.5 rounded-xl border border-slate-700/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm font-mono text-white"
            />
          </div>
        </div>

        {/* Copy Payment Link */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Encrypted Payment Link
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              type="text"
              value={paymentLink}
              className="w-full bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-300 truncate"
            />
            <Button
              variant="outline"
              size="md"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Button
            variant="primary"
            icon={Share2}
            onClick={handleCopy}
            className="w-full"
          >
            {copied ? 'Link Copied to Clipboard!' : 'Share Payment Link'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
