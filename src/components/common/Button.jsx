import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  type = 'button',
}) {
  const baseStyle =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold shadow-glow-cyan hover:shadow-cyan-500/50 hover:brightness-110 active:scale-[0.98]',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700/60 active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 active:scale-[0.98]',
    danger:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0" />}
      <span>{children}</span>
    </motion.button>
  );
}
