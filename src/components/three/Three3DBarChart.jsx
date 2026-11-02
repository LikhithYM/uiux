import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';
import { weeklySpendingData } from '../../data/mockAnalytics';

function BarColumn3D({
  item,
  index,
  maxAmount,
  totalBars,
  isDark,
  isHovered,
  onHover,
}) {
  const meshRef = useRef();

  // Calculate height proportional to spending amount
  const targetHeight = Math.max(0.3, (item.amount / maxAmount) * 2.2);
  const width = 0.35;
  const depth = 0.35;
  const x = (index - (totalBars - 1) / 2) * 0.65;
  const targetY = targetHeight / 2;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScaleY = isHovered ? 1.08 : 1.0;
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScaleY, 8, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      isHovered ? targetY + 0.1 : targetY,
      8,
      delta
    );
  });

  const barColor = isHovered
    ? (isDark ? '#00f0ff' : '#0284c7')
    : index === 5 // Peak: Saturday
    ? (isDark ? '#38bdf8' : '#0369a1')
    : (isDark ? '#1e293b' : '#cbd5e1');

  const topColor = isHovered
    ? '#ffffff'
    : index === 5
    ? '#00f0ff'
    : (isDark ? '#00f0ff' : '#0284c7');

  return (
    <group position={[x, 0, 0]}>
      {/* 3D Bar Mesh */}
      <mesh
        ref={meshRef}
        position={[0, targetY, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(item);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
      >
        <boxGeometry args={[width, targetHeight, depth]} />
        <meshPhysicalMaterial
          color={barColor}
          metalness={0.7}
          roughness={0.25}
          clearcoat={0.6}
          emissive={barColor}
          emissiveIntensity={isHovered ? 0.4 : 0.1}
        />
      </mesh>

      {/* Glowing Cap Light / Ring on Top */}
      <mesh position={[0, targetHeight + 0.04, 0]}>
        <boxGeometry args={[width + 0.02, 0.04, depth + 0.02]} />
        <meshStandardMaterial
          color={topColor}
          emissive={topColor}
          emissiveIntensity={isHovered ? 0.9 : 0.4}
        />
      </mesh>
    </group>
  );
}

export default function Three3DBarChart({ height = 260 }) {
  const { theme, formatINR } = useBanking();
  const isDark = theme === 'dark';
  const [hoveredBar, setHoveredBar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const maxAmount = useMemo(() => {
    return Math.max(...weeklySpendingData.map((d) => d.amount));
  }, []);

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
      onMouseLeave={() => {
        setMousePos({ x: 0, y: 0 });
        setHoveredBar(null);
      }}
      style={{ height }}
      className="relative w-full select-none cursor-pointer flex items-center justify-center"
    >
      <Canvas
        camera={{ position: [0, 1.8, 4.5], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isDark ? 0.9 : 1.3} />
        <directionalLight position={[4, 7, 5]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color={isDark ? '#00f0ff' : '#0284c7'} />
        <pointLight
          position={[mousePos.x * 3, 3, mousePos.y * 3]}
          intensity={0.9}
          color="#00f0ff"
        />

        <group
          position={[0, -0.6, 0]}
          rotation={[
            mousePos.y * 0.18 + 0.22,
            mousePos.x * 0.35,
            0
          ]}
        >
          {/* Reflective Ground Grid Pedestal */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[5.2, 0.08, 1.8]} />
            <meshStandardMaterial
              color={isDark ? '#090d18' : '#e2e8f0'}
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>

          {/* Grid lines */}
          <gridHelper
            args={[5.2, 12, isDark ? '#00f0ff' : '#0284c7', isDark ? '#1e293b' : '#cbd5e1']}
            position={[0, 0, 0]}
          />

          {/* 3D Extruded Data Columns */}
          {weeklySpendingData.map((d, index) => (
            <BarColumn3D
              key={d.day}
              item={d}
              index={index}
              maxAmount={maxAmount}
              totalBars={weeklySpendingData.length}
              isDark={isDark}
              isHovered={hoveredBar?.day === d.day}
              onHover={setHoveredBar}
            />
          ))}
        </group>
      </Canvas>

      {/* Hover Info Tooltip */}
      {hoveredBar ? (
        <div className="absolute top-2 right-4 p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-xs shadow-xl pointer-events-none animate-fadeIn">
          <p className="font-semibold text-white">{hoveredBar.day}</p>
          <p className="font-mono text-cyan-400 font-bold mt-0.5">
            {formatINR(hoveredBar.amount)}
          </p>
        </div>
      ) : (
        <div className="absolute bottom-2 text-center pointer-events-none text-[11px] text-slate-400">
          <span>Tilt mouse to inspect 3D financial columns</span>
        </div>
      )}
    </div>
  );
}

