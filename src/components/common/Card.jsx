import React from 'react';

export default function Card({
  children,
  className = '',
  glow = false,
  hoverEffect = true,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl transition-all duration-300 ${
        glow ? 'glass-panel-glow' : 'glass-panel'
      } ${
        hoverEffect ? 'hover:border-slate-500/30 hover:shadow-xl' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
