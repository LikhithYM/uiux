import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';
import { createCoinFaceTexture, createCoinRimTexture } from './threeUtils';

/**
 * Realistic 3D Coin Mesh with PBR materials and milled rim
 */
export function MetallicCoinMesh({
  symbol = '₹',
  variant = 'gold',
  isDark = true,
  radius = 0.8,
  thickness = 0.1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false,
  rotationSpeed = 0.6,
  onHover = null,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const faceTex = useMemo(() => createCoinFaceTexture(symbol, isDark, variant), [symbol, isDark, variant]);
  const rimTex = useMemo(() => createCoinRimTexture(isDark, variant), [isDark, variant]);

  const materials = useMemo(() => {
    const isGold = variant === 'gold';
    const isCyan = variant === 'cyan';
    const isPlatinum = variant === 'platinum';

    const metalColor = isGold
      ? (isDark ? '#ffd700' : '#f59e0b')
      : isCyan
      ? (isDark ? '#00f0ff' : '#0284c7')
      : isPlatinum
      ? (isDark ? '#e2e8f0' : '#cbd5e1')
      : (isDark ? '#cbd5e1' : '#94a3b8');

    // Material 0: Side / Rim
    const rimMat = new THREE.MeshStandardMaterial({
      map: rimTex,
      metalness: 0.92,
      roughness: 0.28,
      color: metalColor,
    });

    // Material 1: Top Face
    const topMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      metalness: 0.88,
      roughness: 0.22,
      color: '#ffffff',
    });

    // Material 2: Bottom Face
    const bottomMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      metalness: 0.88,
      roughness: 0.22,
      color: '#ffffff',
    });

    return [rimMat, topMat, bottomMat];
  }, [faceTex, rimTex, variant, isDark]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (autoRotate) {
      meshRef.current.rotation.y += delta * rotationSpeed * (hovered ? 1.8 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      material={materials}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (onHover) onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        if (onHover) onHover(false);
      }}
      scale={hovered ? [1.08, 1.08, 1.08] : [1, 1, 1]}
    >
      <cylinderGeometry args={[radius, radius, thickness, 48]} />
    </mesh>
  );
}

/**
 * Stack of 3D Metallic Coins with staggered rotations for physical realism
 */
export function CoinStack3D({
  symbol = '₹',
  count = 5,
  variant = 'gold',
  isDark = true,
  position = [0, 0, 0],
  radius = 0.75,
  thickness = 0.09,
}) {
  const coins = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        y: i * (thickness + 0.005),
        rotY: (i * 0.42) % (Math.PI * 2),
        rotX: (Math.sin(i * 1.5) * 0.02),
        rotZ: (Math.cos(i * 1.8) * 0.02),
      });
    }
    return arr;
  }, [count, thickness]);

  return (
    <group position={position}>
      {coins.map((c, idx) => (
        <MetallicCoinMesh
          key={idx}
          symbol={symbol}
          variant={variant}
          isDark={isDark}
          radius={radius}
          thickness={thickness}
          position={[0, c.y, 0]}
          rotation={[c.rotX, c.rotY, c.rotZ]}
          autoRotate={false}
        />
      ))}
    </group>
  );
}

/**
 * Abstract Financial Faceted Geometric Object (e.g. Sovereign Diamond / Defi Token)
 */
export function FinancialGeometricMesh({ isDark = true, position = [0, 0, 0] }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.5;
  });

  const coreColor = isDark ? '#00f0ff' : '#0284c7';

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial
          color={coreColor}
          metalness={0.8}
          roughness={0.15}
          transmission={0.4}
          thickness={0.5}
          emissive={coreColor}
          emissiveIntensity={isDark ? 0.4 : 0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Outer Wireframe Halo */}
      <mesh>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          wireframe
          color={isDark ? '#8b5cf6' : '#6366f1'}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/**
 * Interactive 3D Financial Scene for Hero / KPI Widgets
 */
export default function ThreeFinancialHeroAsset({ symbol = '₹', height = 140 }) {
  const { theme } = useBanking();
  const isDark = theme === 'dark';
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

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
      style={{ height }}
      className="relative w-full cursor-pointer select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isDark ? 0.9 : 1.3} />
        <directionalLight position={[4, 5, 4]} intensity={isDark ? 1.8 : 2.0} color="#ffffff" />
        <directionalLight position={[-4, -3, -2]} intensity={0.8} color={isDark ? '#00f0ff' : '#38bdf8'} />
        <pointLight
          position={[mousePos.x * 2.5, mousePos.y * 2.5, 2]}
          intensity={isDark ? 1.0 : 0.8}
          color={isDark ? '#ffd700' : '#0284c7'}
        />

        {/* Center Floating Sovereign Coin with mouse tilt */}
        <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.4}>
          <group
            rotation={[
              mousePos.y * 0.35 + 0.25,
              mousePos.x * 0.5 - 0.3,
              0.1
            ]}
          >
            {/* Primary Main Gold Sovereign Coin */}
            <MetallicCoinMesh
              symbol={symbol}
              variant="gold"
              isDark={isDark}
              radius={0.85}
              thickness={0.12}
              position={[0, 0, 0]}
              rotation={[Math.PI / 12, 0, 0]}
              autoRotate={true}
              rotationSpeed={0.5}
            />

            {/* Orbiting Mini Cyan Crypto Token */}
            <group position={[1.4, -0.4, -0.3]}>
              <MetallicCoinMesh
                symbol="$"
                variant="cyan"
                isDark={isDark}
                radius={0.45}
                thickness={0.07}
                position={[0, 0, 0]}
                rotation={[0.4, 0.2, -0.2]}
                autoRotate={true}
                rotationSpeed={-0.8}
              />
            </group>

            {/* Floating Geometric Gem */}
            <FinancialGeometricMesh
              isDark={isDark}
              position={[-1.3, 0.5, -0.4]}
            />
          </group>
        </Float>
      </Canvas>
    </div>
  );
}

