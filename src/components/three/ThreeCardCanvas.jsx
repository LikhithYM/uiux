import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, Eye, EyeOff } from 'lucide-react';

// Generates high-res canvas texture for the front of the futuristic card
function createCardFrontTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 648;
  const ctx = canvas.getContext('2d');

  // Deep obsidian titanium gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 648);
  grad.addColorStop(0, '#090d19');
  grad.addColorStop(0.35, '#11182c');
  grad.addColorStop(0.7, '#0c1224');
  grad.addColorStop(1, '#05070e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 648);

  // Subtle geometric grid
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 1024; i += 70) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 140, 648);
    ctx.stroke();
  }

  // Futuristic diagonal hologram light slice
  const glowGrad = ctx.createLinearGradient(150, 0, 850, 648);
  glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.0)');
  glowGrad.addColorStop(0.46, 'rgba(0, 240, 255, 0.07)');
  glowGrad.addColorStop(0.54, 'rgba(139, 92, 246, 0.12)');
  glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 1024, 648);

  // Card Border outline
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 1004, 628);

  // Bank Logo & Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('FUTURE BANKING', 70, 95);

  ctx.fillStyle = '#00F0FF';
  ctx.font = '600 18px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('PLATINUM SOVEREIGN', 70, 130);

  // Gold EMV Chip
  const chipX = 70;
  const chipY = 185;
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + 115, chipY + 90);
  chipGrad.addColorStop(0, '#ffd700');
  chipGrad.addColorStop(0.5, '#f59e0b');
  chipGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = chipGrad;
  ctx.beginPath();
  ctx.roundRect(chipX, chipY, 115, 90, 14);
  ctx.fill();

  // Chip inner contacts
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(chipX + 38, chipY, 38, 90);
  ctx.beginPath();
  ctx.moveTo(chipX, chipY + 45);
  ctx.lineTo(chipX + 115, chipY + 45);
  ctx.stroke();

  // Contactless NFC icon
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(240, 230, 16, -0.6, 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(240, 230, 28, -0.6, 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(240, 230, 40, -0.6, 0.6);
  ctx.stroke();

  // Card Number
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "JetBrains Mono", monospace';
  ctx.fillText('4582   ••••   ••••   9021', 70, 390);

  // Cardholder Label & Name
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('CARDHOLDER', 70, 480);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('ALEX MORGAN', 70, 520);

  // Expiry
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('EXPIRES', 480, 480);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillText('09/29', 480, 520);

  // VISA Infinite Foil Logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 900 52px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('VISA', 810, 525);
  ctx.fillStyle = '#00F0FF';
  ctx.font = 'bold 16px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('INFINITE', 810, 555);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Generates high-res canvas texture for the back of the card
function createCardBackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 648;
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, 1024, 648);
  grad.addColorStop(0, '#060810');
  grad.addColorStop(1, '#0e1424');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 648);

  // Black Magnetic Stripe
  ctx.fillStyle = '#020306';
  ctx.fillRect(0, 60, 1024, 110);

  // White Signature Panel
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(70, 230, 600, 75);

  // Signature watermark
  ctx.fillStyle = '#475569';
  ctx.font = 'italic bold 22px cursive, sans-serif';
  ctx.fillText('Alex Morgan (Authorized Sovereign)', 90, 275);

  // CVV Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(680, 230, 120, 75);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px "JetBrains Mono", monospace';
  ctx.fillText('742', 715, 278);

  // Hologram Security Seal
  const holoGrad = ctx.createLinearGradient(830, 230, 950, 305);
  holoGrad.addColorStop(0, '#00F0FF');
  holoGrad.addColorStop(0.3, '#EC4899');
  holoGrad.addColorStop(0.7, '#EAB308');
  holoGrad.addColorStop(1, '#6366F1');
  ctx.fillStyle = holoGrad;
  ctx.beginPath();
  ctx.roundRect(830, 230, 120, 75, 8);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.fillText('SECURE', 850, 275);

  // Concierge Support text
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 16px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Property of Future Banking Inc. Sovereign Global Network.', 70, 380);
  ctx.fillText('24/7 Concierge Hotline: +91 1800-FUTURE-01 | support@futurebank.io', 70, 415);
  ctx.fillText('Authorized for global quantum transactions and decentralized liquidity settlement.', 70, 450);

  // QR Code / Data Matrix placeholder
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.strokeRect(840, 480, 85, 85);
  ctx.fillStyle = '#00F0FF';
  ctx.fillRect(850, 490, 22, 22);
  ctx.fillRect(890, 490, 22, 22);
  ctx.fillRect(850, 530, 22, 22);
  ctx.fillRect(880, 520, 14, 14);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 3D Card Mesh Component
function Card3DMesh({ isFlipped, mouseX, mouseY }) {
  const meshRef = useRef();
  const frontTex = useMemo(() => createCardFrontTexture(), []);
  const backTex = useMemo(() => createCardBackTexture(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Target rotation based on flip and mouse tilt
    const targetY = (isFlipped ? Math.PI : 0) + (mouseX * 0.35);
    const targetX = mouseY * 0.25;

    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetY, 6, delta);
    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetX, 6, delta);
  });

  return (
    <group ref={meshRef}>
      {/* Metallic Card Core Body */}
      <RoundedBox args={[3.8, 2.38, 0.08]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#060912"
          metalness={0.9}
          roughness={0.3}
          emissive="#00f0ff"
          emissiveIntensity={0.15}
        />
      </RoundedBox>

      {/* Front Face Plane */}
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[3.76, 2.34]} />
        <meshStandardMaterial
          map={frontTex}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* Back Face Plane */}
      <mesh position={[0, 0, -0.042]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.76, 2.34]} />
        <meshStandardMaterial
          map={backTex}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

export default function ThreeCardCanvas({ interactive = true }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const toggleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
        className="relative w-full h-[280px] sm:h-[320px] cursor-pointer group flex items-center justify-center select-none"
      >
        {/* Subtle Ambient Background Halo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-44 rounded-full bg-cyan-500/15 blur-3xl group-hover:bg-cyan-500/25 transition-all duration-700 animate-pulseGlow" />
        </div>

        <Canvas
          camera={{ position: [0, 0, 4.3], fov: 45 }}
          className="w-full h-full"
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 6, 6]} intensity={1.0} color="#ffffff" />
          <directionalLight position={[-5, -4, -3]} intensity={0.6} color="#00f0ff" />
          <pointLight position={[mousePos.x * 2.5, mousePos.y * 2.5, 2.5]} intensity={0.5} color="#00f0ff" distance={7} />

          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <Card3DMesh isFlipped={isFlipped} mouseX={mousePos.x} mouseY={mousePos.y} />
          </Float>
        </Canvas>

        {/* Floating Hint Overlay */}
        <div className="absolute bottom-2 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-medium text-cyan-400 group-hover:scale-105 transition-transform">
          <RotateCw size={12} className={isFlipped ? 'rotate-180 transition-transform duration-500' : 'transition-transform duration-500'} />
          <span>Click to Flip</span>
        </div>
      </div>

      {/* Interactive Quick Bar under Card */}
      <div className="mt-3 flex items-center justify-between w-full max-w-sm px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-300">NFC & Biometrics Active</span>
        </div>
        <button
          onClick={toggleFlip}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20"
        >
          {isFlipped ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>{isFlipped ? 'Show Front' : 'Show CVV & Back'}</span>
        </button>
      </div>
    </div>
  );
}
