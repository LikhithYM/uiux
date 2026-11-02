import React from 'react';
import * as THREE from 'three';

// Cache generated textures so we don't recreate them on every render
const textureCache = new Map();

/**
 * Creates high-resolution procedural metallic texture for currency coin faces
 * @param {string} symbol - Currency or asset symbol (e.g., '₹', '$', '€', '£', 'BTC')
 * @param {boolean} isDark - Active theme
 * @param {string} variant - 'gold' | 'silver' | 'cyan' | 'platinum'
 */
export function createCoinFaceTexture(symbol = '₹', isDark = true, variant = 'gold') {
  const cacheKey = `coin_${symbol}_${isDark ? 'dark' : 'light'}_${variant}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const cx = 256;
  const cy = 256;
  const r = 246;

  // Variant color definitions
  let baseColor1, baseColor2, rimColor, textFill, textShadow, circuitColor;

  if (variant === 'gold') {
    baseColor1 = isDark ? '#ffd700' : '#f59e0b';
    baseColor2 = isDark ? '#b45309' : '#d97706';
    rimColor = isDark ? '#fef08a' : '#fde047';
    textFill = isDark ? '#ffffff' : '#78350f';
    textShadow = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)';
    circuitColor = isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(180, 83, 9, 0.12)';
  } else if (variant === 'cyan') {
    baseColor1 = isDark ? '#00f0ff' : '#0284c7';
    baseColor2 = isDark ? '#0284c7' : '#0369a1';
    rimColor = isDark ? '#a5f3fc' : '#bae6fd';
    textFill = '#ffffff';
    textShadow = isDark ? 'rgba(0, 240, 255, 0.5)' : 'rgba(2, 132, 199, 0.4)';
    circuitColor = 'rgba(255, 255, 255, 0.2)';
  } else if (variant === 'platinum') {
    baseColor1 = isDark ? '#e2e8f0' : '#cbd5e1';
    baseColor2 = isDark ? '#64748b' : '#94a3b8';
    rimColor = isDark ? '#ffffff' : '#f8fafc';
    textFill = isDark ? '#ffffff' : '#0f172a';
    textShadow = 'rgba(0, 0, 0, 0.4)';
    circuitColor = isDark ? 'rgba(0, 240, 255, 0.15)' : 'rgba(2, 132, 199, 0.12)';
  } else {
    // Silver
    baseColor1 = isDark ? '#94a3b8' : '#e2e8f0';
    baseColor2 = isDark ? '#475569' : '#94a3b8';
    rimColor = isDark ? '#e2e8f0' : '#ffffff';
    textFill = isDark ? '#f8fafc' : '#1e293b';
    textShadow = 'rgba(0, 0, 0, 0.5)';
    circuitColor = 'rgba(255, 255, 255, 0.15)';
  }

  // Radial brushed metallic gradient
  const grad = ctx.createRadialGradient(cx - 50, cy - 50, 20, cx, cy, r);
  grad.addColorStop(0, rimColor);
  grad.addColorStop(0.35, baseColor1);
  grad.addColorStop(0.8, baseColor2);
  grad.addColorStop(1, isDark ? '#1a1d29' : '#64748b');

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Concentric milled circular rings
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = circuitColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 22, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle bead dots around perimeter
  const beadCount = 36;
  for (let i = 0; i < beadCount; i++) {
    const angle = (i / beadCount) * Math.PI * 2;
    const bx = cx + Math.cos(angle) * (r - 14);
    const by = cy + Math.sin(angle) * (r - 14);
    ctx.beginPath();
    ctx.arc(bx, by, 3, 0, Math.PI * 2);
    ctx.fillStyle = rimColor;
    ctx.fill();
  }

  // Futuristic geometric micro-circuits / spokes
  ctx.strokeStyle = circuitColor;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 75, cy + Math.sin(angle) * 75);
    ctx.lineTo(cx + Math.cos(angle) * (r - 35), cy + Math.sin(angle) * (r - 35));
    ctx.stroke();
  }

  // Inner inset badge
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? 'rgba(5, 7, 14, 0.35)' : 'rgba(255, 255, 255, 0.25)';
  ctx.fill();
  ctx.strokeStyle = circuitColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Embossed Currency Symbol
  ctx.shadowColor = textShadow;
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = textFill;
  ctx.font = 'bold 115px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, cx, cy + 4);

  // Micro Sovereign Typography around inner ring
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.4)';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('• FUTURE BANKING SOVEREIGN •', cx, cy + 85);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates milled ridged texture for the side/rim of the coin
 */
export function createCoinRimTexture(isDark = true, variant = 'gold') {
  const cacheKey = `coin_rim_${isDark ? 'dark' : 'light'}_${variant}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const baseCol = variant === 'gold'
    ? (isDark ? '#d97706' : '#b45309')
    : variant === 'cyan'
    ? (isDark ? '#0284c7' : '#0369a1')
    : (isDark ? '#475569' : '#64748b');

  const ridgeCol = variant === 'gold'
    ? (isDark ? '#fef08a' : '#fde047')
    : variant === 'cyan'
    ? (isDark ? '#a5f3fc' : '#38bdf8')
    : (isDark ? '#e2e8f0' : '#f1f5f9');

  ctx.fillStyle = baseCol;
  ctx.fillRect(0, 0, 512, 32);

  // Vertical ridges
  for (let x = 0; x < 512; x += 4) {
    ctx.fillStyle = ridgeCol;
    ctx.fillRect(x, 0, 2, 32);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(16, 1);
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Safe WebGL Error Boundary component
 */
export class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('3D Canvas fallback triggered:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement(
        'div',
        { className: 'w-full h-full flex items-center justify-center p-4 text-xs text-slate-400' },
        '3D experience unavailable'
      );
    }
    return this.props.children;
  }
}
