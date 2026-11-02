import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Palette,
  Key,
  Smartphone,
  Laptop,
  Check,
  Moon,
  Sun,
  Lock,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useBanking } from '../context/BankingContext';

export default function Settings() {
  const { user, setUser, theme, toggleTheme, showToast } = useBanking();

  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [largeTxAlerts, setLargeTxAlerts] = useState(true);
  const [weeklyBriefing, setWeeklyBriefing] = useState(true);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, name, role }));
    showToast('Profile Updated', 'Your identity preferences have been saved.', 'success');
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled((prev) => {
      const next = !prev;
      showToast(
        next ? '2FA Activated' : '2FA Deactivated',
        `Quantum hardware token authentication is ${next ? 'enabled' : 'disabled'}.`,
        next ? 'success' : 'warning'
      );
      return next;
    });
  };

  const handleToggleBio = () => {
    setBiometricsEnabled((prev) => {
      const next = !prev;
      showToast(
        next ? 'Biometrics Enabled' : 'Biometrics Disabled',
        `FaceID & TouchID biometric verification is ${next ? 'enabled' : 'disabled'}.`,
        next ? 'success' : 'warning'
      );
      return next;
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Preferences & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure sovereign authentication keys, appearance themes, and identity details.
        </p>
      </div>

      {/* Profile Settings Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <User size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Identity Profile</h3>
            <p className="text-xs text-slate-400">Manage cardholder display name and executive role</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-400/40"
            />
            <div>
              <p className="font-semibold text-sm text-white">{user.name}</p>
              <p className="text-xs text-cyan-400">{user.accountType}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Avatar verified via sovereign key</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Executive Title / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Identity Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance & Theme System */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Palette size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Visual Interface Theme</h3>
            <p className="text-xs text-slate-400">Toggle between Cyber Midnight Dark and Titanium Crisp Light</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              theme === 'dark'
                ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan'
                : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-950 text-cyan-400 border border-slate-800">
              <Moon size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-white">Cyber Dark Mode</span>
                {theme === 'dark' && <Badge variant="cyan" size="xs">Active</Badge>}
              </div>
              <p className="text-xs text-slate-400 mt-1">Deep midnight black with neon electric blue glows.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              theme === 'light'
                ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan'
                : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-white text-cyan-600 border border-slate-200">
              <Sun size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-white">Titanium Light Mode</span>
                {theme === 'light' && <Badge variant="cyan" size="xs">Active</Badge>}
              </div>
              <p className="text-xs text-slate-400 mt-1">Crisp high-clarity surfaces with cobalt accents.</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Sovereign Security Protocols */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Quantum Security Guard</h3>
            <p className="text-xs text-slate-400">Multi-factor authorization and biometric safeguards</p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-white/5">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-semibold text-xs text-white">Quantum 2FA Authentication</p>
              <p className="text-[11px] text-slate-400">Require cryptographic verification on transactions over ₹50,000</p>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                twoFactorEnabled ? 'bg-cyan-500 shadow-glow-cyan' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-semibold text-xs text-white">Biometric Passkey (WebAuthn)</p>
              <p className="text-[11px] text-slate-400">Enable Windows Hello / TouchID fingerprint login</p>
            </div>
            <button
              onClick={handleToggleBio}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                biometricsEnabled ? 'bg-cyan-500 shadow-glow-cyan' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  biometricsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-semibold text-xs text-white">Large Transaction Velocity Alerts</p>
              <p className="text-[11px] text-slate-400">Instant push and SMS notification for transfers above ₹1,00,000</p>
            </div>
            <input
              type="checkbox"
              checked={largeTxAlerts}
              onChange={() => setLargeTxAlerts(!largeTxAlerts)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Active Sessions */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <h4 className="font-semibold text-xs text-slate-300 mb-3">Active Sovereign Sessions</h4>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Laptop size={16} className="text-cyan-400" />
                <div>
                  <p className="font-semibold text-white">Chrome on Windows (Current Machine)</p>
                  <p className="text-[10px] text-slate-400">Bangalore, IN • IP: 103.24.88.19 • Active Now</p>
                </div>
              </div>
              <Badge variant="emerald" size="xs">This Device</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Smartphone size={16} className="text-purple-400" />
                <div>
                  <p className="font-semibold text-white">iPhone 16 Pro — Future Banking App</p>
                  <p className="text-[10px] text-slate-400">Bangalore, IN • Last seen 25m ago</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Session Terminated', 'Remote session logged out.', 'info')}
                className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
