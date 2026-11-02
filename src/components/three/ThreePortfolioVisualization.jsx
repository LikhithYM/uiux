import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';

/**
 * Creates an extruded arc geometry for 3D portfolio slices
 */
function createArcShape(innerR, outerR, startAngle, endAngle) {
  const shape = new THREE.Shape();
  const segments = 32;

  // Outer arc
  for (let i = 0; i <= segments; i++) {
    const theta = startAngle + (i / segments) * (endAngle - startAngle);
    const x = Math.cos(theta) * outerR;
    const y = Math.sin(theta) * outerR;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  // Inner arc
  for (let i = segments; i >= 0; i--) {
    const theta = startAngle + (i / segments) * (endAngle - startAngle);
    const x = Math.cos(theta) * innerR;
    const y = Math.sin(theta) * innerR;
    shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

/**
 * Single 3D Extruded Portfolio Segment
 */
function PortfolioSegment({
  category,
  startAngle,
  endAngle,
  innerR = 1.0,
  outerR = 1.9,
  isDark = true,
  isHovered = false,
  onHover,
}) {
  const meshRef = useRef();

  const shape = useMemo(
    () => createArcShape(innerR, outerR, startAngle, endAngle),
    [innerR, outerR, startAngle, endAngle]
  );

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.35 + (category.allocation / 100) * 0.45,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    }),
    [category.allocation]
  );

  // Direction vector for explosion on hover
  const midAngle = (startAngle + endAngle) / 2;
  const explodeDistance = isHovered ? 0.22 : 0;
  const targetX = Math.cos(midAngle) * explodeDistance;
  const targetY = Math.sin(midAngle) * explodeDistance;
  const targetZ = isHovered ? 0.18 : 0;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 8, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 8, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 8, delta);

    const targetScale = isHovered ? 1.06 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 8, delta);
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScale, 8, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 8, delta);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(category);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      rotation={[-Math.PI / 2.6, 0, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshPhysicalMaterial
        color={category.color}
        metalness={0.75}
        roughness={0.2}
        clearcoat={0.8}
        clearcoatRoughness={0.15}
        emissive={category.color}
        emissiveIntensity={isHovered ? (isDark ? 0.7 : 0.4) : (isDark ? 0.2 : 0.05)}
      />
    </mesh>
  );
}

/**
 * Center Holographic Pedestal / Floating Token
 */
function CenterCoreNode({ isDark }) {
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current) return;
    coreRef.current.rotation.y += delta * 0.4;
    coreRef.current.rotation.x += delta * 0.2;
  });

  const coreColor = isDark ? '#00f0ff' : '#0284c7';

  return (
    <group position={[0, -0.1, 0.15]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          wireframe
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={isDark ? 0.6 : 0.3}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshPhysicalMaterial
          color={isDark ? '#ffd700' : '#f59e0b'}
          metalness={0.9}
          roughness={0.2}
          emissive={isDark ? '#b45309' : '#d97706'}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

/**
 * Complete 3D Financial Portfolio Scene
 */
export default function ThreePortfolioVisualization({ height = 280 }) {
  const { portfolio, theme, formatINR } = useBanking();
  const isDark = theme === 'dark';
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const categories = portfolio.categories || [];
  const totalAllocation = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.allocation, 0) || 100;
  }, [categories]);

  // Compute angles for each category with slight gap
  const sliceAngles = useMemo(() => {
    let currentAngle = 0;
    const gap = 0.06; // gap between segments in radians
    return categories.map((cat) => {
      const sweep = ((cat.allocation / totalAllocation) * Math.PI * 2) - gap;
      const start = currentAngle + gap / 2;
      const end = start + sweep;
      currentAngle += (cat.allocation / totalAllocation) * Math.PI * 2;
      return { category: cat, start, end };
    });
  }, [categories, totalAllocation]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setHoveredCategory(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height }}
      className="relative w-full select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2.2, 4.0], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isDark ? 1.0 : 1.4} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-4, -3, -3]} intensity={0.8} color={isDark ? '#00f0ff' : '#38bdf8'} />
        <pointLight
          position={[mousePos.x * 3, 2, mousePos.y * 3]}
          intensity={1.2}
          color={hoveredCategory ? hoveredCategory.color : '#00f0ff'}
          distance={8}
        />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          <group
            rotation={[
              mousePos.y * 0.25,
              mousePos.x * 0.45,
              0
            ]}
          >
            {/* Center Core Node */}
            <CenterCoreNode isDark={isDark} />

            {/* Extruded Slices */}
            {sliceAngles.map((item) => (
              <PortfolioSegment
                key={item.category.name}
                category={item.category}
                startAngle={item.start}
                endAngle={item.end}
                isDark={isDark}
                isHovered={hoveredCategory?.name === item.category.name}
                onHover={setHoveredCategory}
              />
            ))}
          </group>
        </Float>
      </Canvas>

      {/* Interactive Tooltip Card Overlay */}
      {hoveredCategory ? (
        <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-4 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 shadow-2xl pointer-events-none transition-all duration-300 animate-fadeIn">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: hoveredCategory.color }}
            />
            <span className="font-semibold text-xs text-white">
              {hoveredCategory.name}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-mono text-sm font-bold text-cyan-300">
              {formatINR(hoveredCategory.value)}
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">
              {hoveredCategory.allocation}% Allocation
            </span>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-2 text-center pointer-events-none text-[11px] text-slate-400 bg-slate-900/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
          <span>Hover segments to inspect category allocation</span>
        </div>
      )}
    </div>
  );
}

