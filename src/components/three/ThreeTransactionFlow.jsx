import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';
import { MetallicCoinMesh } from './ThreeFinancialAssets';

/**
 * Animated 3D Quantum Ledger Nodes moving across an encrypted pipeline
 */
function LedgerPipeline3D({ isDark }) {
  const blocksRef = useRef([]);

  const blockCount = 6;
  const spacing = 1.3;

  useFrame((state, delta) => {
    blocksRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      mesh.position.x += delta * 0.45;
      mesh.rotation.y += delta * 0.5;
      mesh.rotation.x += delta * 0.25;

      // Wrap around
      if (mesh.position.x > (blockCount * spacing) / 2 + 0.5) {
        mesh.position.x -= blockCount * spacing;
      }
    });
  });

  const nodeColor = isDark ? '#00f0ff' : '#0284c7';
  const accentColor = isDark ? '#8b5cf6' : '#6366f1';

  return (
    <group position={[0, 0, 0]}>
      {/* Laser pipeline rail */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 9, 16]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={isDark ? 0.8 : 0.4}
        />
      </mesh>

      {/* Moving Consensus Blocks */}
      {Array.from({ length: blockCount }).map((_, idx) => {
        const startX = (idx - blockCount / 2) * spacing;
        const isGold = idx % 2 === 0;

        return (
          <mesh
            key={idx}
            ref={(el) => (blocksRef.current[idx] = el)}
            position={[startX, 0, 0]}
          >
            {isGold ? (
              <cylinderGeometry args={[0.24, 0.24, 0.06, 24]} />
            ) : (
              <octahedronGeometry args={[0.22, 0]} />
            )}
            <meshStandardMaterial
              color={isGold ? '#ffd700' : accentColor}
              metalness={0.9}
              roughness={0.2}
              emissive={isGold ? '#b45309' : accentColor}
              emissiveIntensity={isDark ? 0.6 : 0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 3D Transaction Flow Banner Component
 */
export default function ThreeTransactionFlowBanner() {
  const { theme } = useBanking();
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full h-12 rounded-2xl bg-slate-900/40 border border-white/5 overflow-hidden flex items-center justify-between px-4 my-2">
      <div className="flex items-center gap-2 z-10 shrink-0">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
          Quantum Ledger Consensus
        </span>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 38 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 4, 3]} intensity={1.5} />
          <LedgerPipeline3D isDark={isDark} />
        </Canvas>
      </div>

      <div className="z-10 text-[10px] font-mono text-slate-400 hidden sm:flex items-center gap-3">
        <span>Block #894,201</span>
        <span className="text-emerald-400 font-semibold">Instant Settlement: 0.28s</span>
      </div>
    </div>
  );
}

/**
 * 3D Micro Category Badge for Transaction Rows
 */
export function ThreeCategoryAvatar({ category = 'Shopping', avatar = '💳' }) {
  const { theme } = useBanking();
  const isDark = theme === 'dark';

  let symbol = '₹';
  let variant = 'gold';

  if (category === 'Income') {
    symbol = '₹';
    variant = 'gold';
  } else if (category === 'Transfer') {
    symbol = '$';
    variant = 'cyan';
  } else if (category === 'Bills & Utilities') {
    symbol = '⚡';
    variant = 'platinum';
  } else {
    symbol = '€';
    variant = 'silver';
  }

  return (
    <div className="w-9 h-9 relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[2, 2, 2]} intensity={1.8} />
        <MetallicCoinMesh
          symbol={symbol}
          variant={variant}
          isDark={isDark}
          radius={0.62}
          thickness={0.09}
          position={[0, 0, 0]}
          rotation={[0.3, 0.4, 0]}
          autoRotate={true}
          rotationSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

