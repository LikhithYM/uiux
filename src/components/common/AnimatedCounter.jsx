import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 2, duration = 1200 }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTime = null;
    const startValue = displayValue;
    const endValue = value;
    const diff = endValue - startValue;

    if (diff === 0) return;

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  return (
    <span className="font-mono tracking-tight inline-block">
      {prefix}{formatted}{suffix}
    </span>
  );
}
