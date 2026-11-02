import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Bell, ArrowDownLeft, Shield, Sparkles } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export default function NotificationsDropdown({ isOpen, onClose }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useBanking();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft size={16} className="text-emerald-400" />;
      case 'security':
        return <Shield size={16} className="text-cyan-400" />;
      default:
        return <Sparkles size={16} className="text-purple-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel-glow border border-slate-700/60 shadow-2xl p-4 z-50 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-cyan-400" />
              <h4 className="font-display font-semibold text-sm">Notifications</h4>
            </div>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          </div>

          {/* List */}
          <div className="divide-y divide-white/5 max-h-72 overflow-y-auto my-2">
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No notifications</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer hover:bg-white/5 ${
                    !item.read ? 'bg-cyan-500/[0.04]' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800/80 mt-0.5 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-xs text-white truncate">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 ml-2 shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 text-center border-t border-white/5">
            <span className="text-[11px] text-slate-400">
              Future Sovereign Cryptographic Feed
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
