import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';
import { MetallicCoinMesh } from './ThreeFinancialAssets';

/**
 * Transparent 3D Cylinder Vault filled with coins corresponding to goal progress
 */
function VaultContainerMesh({ progress = 77, color = '#00F0FF', isDark = true }) {
  const containerRef = useRef();
  const fillLevelRef = useRef();

  // Progress is clamped 0 to 100
  const normalizedProgress = Math.min(100, Math.max(5, progress)) / 100;
  const cylinderHeight = 2.4;
  const fillHeight = cylinderHeight * normalizedProgress;
  const fillY = -cylinderHeight / 2 + fillHeight / 2;

  // Number of 3D coins to display inside based on fill level (up to 12 coins)
  const coinCount = Math.max(2, Math.round(normalizedProgress * 12));

  const coinPositions = useMemo(() => {
    const list = [];
    const radius = 0.45;
    for (let i = 0; i < coinCount; i++) {
      const angle = i * 1.6;
      const r = Math.random() * 0.35;
      const y = -cylinderHeight / 2 + 0.15 + (i / 12) * (cylinderHeight * 0.85);
      list.push({
        x: Math.cos(angle) * r,
        y,
        z: Math.sin(angle) * r,
        rotX: (Math.random() - 0.5) * 0.4,
        rotY: Math.random() * Math.PI,
        rotZ: (Math.random() - 0.5) * 0.4,
      });
    }
    return list;
  }, [coinCount, cylinderHeight]);

  useFrame((state, delta) => {
    if (!fillLevelRef.current) return;
    // Gentle liquid glow pulse
    const time = state.clock.getElapsedTime();
    fillLevelRef.current.material.opacity = (isDark ? 0.35 : 0.25) + Math.sin(time * 2) * 0.08;
  });

  return (
    <group ref={containerRef}>
      {/* Titanium Base Pedestal */}
      <mesh position={[0, -cylinderHeight / 2 - 0.1, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.2, 32]} />
        <meshStandardMaterial
          color={isDark ? '#0b0f19' : '#cbd5e1'}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Titanium Base Rim Accent */}
      <mesh position={[0, -cylinderHeight / 2, 0]}>
        <torusGeometry args={[0.96, 0.03, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isDark ? 0.8 : 0.4}
        />
      </mesh>

      {/* Transparent Glass / Acrylic Cylinder Wall */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.85, cylinderHeight, 32, 1, true]} />
        <meshPhysicalMaterial
          color={isDark ? '#00f0ff' : '#38bdf8'}
          transparent
          opacity={isDark ? 0.18 : 0.12}
          roughness={0.1}
          metalness={0.1}
          transmission={0.85}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing Progress Fluid Level Column */}
      <mesh ref={fillLevelRef} position={[0, fillY, 0]}>
        <cylinderGeometry args={[0.82, 0.82, fillHeight, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isDark ? 0.35 : 0.25}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={isDark ? 0.45 : 0.2}
        />
      </mesh>

      {/* Top Surface Fluid Disc Ring */}
      <mesh position={[0, -cylinderHeight / 2 + fillHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.82, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isDark ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Coins Stacked Inside the Vault */}
      {coinPositions.map((pos, idx) => (
        <MetallicCoinMesh
          key={idx}
          symbol="₹"
          variant="gold"
          isDark={isDark}
          radius={0.32}
          thickness={0.06}
          position={[pos.x, pos.y, pos.z]}
          rotation={[pos.rotX, pos.rotY, pos.rotZ]}
          autoRotate={false}
        />
      ))}

      {/* Titanium Top Cap */}
      <mesh position={[0, cylinderHeight / 2 + 0.08, 0]}>
        <cylinderGeometry args={[0.9, 0.95, 0.16, 32]} />
        <meshStandardMaterial
          color={isDark ? '#0b0f19' : '#cbd5e1'}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Top Cap Energy Beacon */}
      <mesh position={[0, cylinderHeight / 2 + 0.18, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isDark ? 1.0 : 0.6}
        />
      </mesh>
    </group>
  );
}

/**
 * Interactive 3D Savings Goals Vault Canvas
 */
export default function ThreeSavingsVault({
  goal = null,
  height = 220,
  compact = false,
}) {
  const { savingsGoals, theme, formatINR } = useBanking();
  const isDark = theme === 'dark';
  const [selectedGoalId, setSelectedGoalId] = useState(
    goal ? goal.id : savingsGoals[0]?.id || 'goal-1'
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const activeGoal = goal || savingsGoals.find((g) => g.id === selectedGoalId) || savingsGoals[0];
  const progress = activeGoal
    ? Math.min(100, Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100))
    : 77;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      style={{ height }}
      className="relative w-full select-none cursor-pointer flex flex-col items-center justify-center overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0.3, 3.6], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isDark ? 1.0 : 1.4} />
        <directionalLight position={[4, 6, 5]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-4, -3, -3]} intensity={0.7} color={activeGoal?.color || '#00f0ff'} />
        <pointLight
          position={[mousePos.x * 2.5, mousePos.y * 2.5, 2]}
          intensity={0.8}
          color={activeGoal?.color || '#00f0ff'}
        />

        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
          <group
            rotation={[
              mousePos.y * 0.2 + 0.1,
              mousePos.x * 0.45 - 0.2,
              0
            ]}
          >
            <VaultContainerMesh
              progress={progress}
              color={activeGoal?.color || '#00F0FF'}
              isDark={isDark}
            />
          </group>
        </Float>
      </Canvas>

      {/* Floating Progress Badge */}
      <div className="absolute top-2 right-3 pointer-events-none flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs">
        <span
          className="w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: activeGoal?.color || '#00f0ff' }}
        />
        <span className="font-mono font-bold text-white">
          {progress}% Accumulated
        </span>
      </div>

      {!compact && (
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] text-slate-400 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
          <span className="truncate font-semibold text-slate-200">
            {activeGoal?.name}: {formatINR(activeGoal?.currentAmount)}
          </span>
          <span className="font-mono text-cyan-400">
            Target {formatINR(activeGoal?.targetAmount)}
          </span>
        </div>
      )}
    </div>
  );
}

