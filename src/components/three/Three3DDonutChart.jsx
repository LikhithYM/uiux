import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';
import { categoryExpensesData } from '../../data/mockAnalytics';

function createArcShape(innerR, outerR, startAngle, endAngle) {
  const shape = new THREE.Shape();
  const segments = 32;

  for (let i = 0; i <= segments; i++) {
    const theta = startAngle + (i / segments) * (endAngle - startAngle);
    const x = Math.cos(theta) * outerR;
    const y = Math.sin(theta) * outerR;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  for (let i = segments; i >= 0; i--) {
    const theta = startAngle + (i / segments) * (endAngle - startAngle);
    const x = Math.cos(theta) * innerR;
    const y = Math.sin(theta) * innerR;
    shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

function DonutSegment3D({
  item,
  startAngle,
  endAngle,
  innerR = 1.15,
  outerR = 1.95,
  depth = 0.38,
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
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025,
    }),
    [depth]
  );

  const midAngle = (startAngle + endAngle) / 2;
  const explodeDist = isHovered ? 0.22 : 0;
  const targetX = Math.cos(midAngle) * explodeDist;
  const targetY = Math.sin(midAngle) * explodeDist;
  const targetZ = isHovered ? 0.15 : 0;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 8, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 8, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 8, delta);

    const targetScale = isHovered ? 1.05 : 1.0;
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 8, delta);
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScale, 8, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 8, delta);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(item);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      rotation={[-Math.PI / 2.6, 0, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color={item.color}
        metalness={0.7}
        roughness={0.25}
        emissive={item.color}
        emissiveIntensity={isHovered ? (isDark ? 0.8 : 0.45) : (isDark ? 0.25 : 0.05)}
      />
    </mesh>
  );
}

export default function Three3DDonutChart({ height = 240 }) {
  const { theme, formatINR } = useBanking();
  const isDark = theme === 'dark';
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const total = useMemo(() => {
    return categoryExpensesData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  const slices = useMemo(() => {
    let currentAngle = 0;
    const gap = 0.04;
    return categoryExpensesData.map((item) => {
      const sweep = ((item.value / total) * Math.PI * 2) - gap;
      const start = currentAngle + gap / 2;
      const end = start + sweep;
      currentAngle += (item.value / total) * Math.PI * 2;
      return { item, start, end };
    });
  }, [total]);

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
        setHoveredItem(null);
      }}
      style={{ height }}
      className="relative w-full select-none cursor-pointer flex items-center justify-center"
    >
      <Canvas
        camera={{ position: [0, 2.2, 4.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isDark ? 1.0 : 1.3} />
        <directionalLight position={[5, 6, 4]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-4, -3, -3]} intensity={0.6} color={isDark ? '#00f0ff' : '#0284c7'} />
        <pointLight
          position={[mousePos.x * 2.5, 2, mousePos.y * 2.5]}
          intensity={0.8}
          color="#00f0ff"
        />

        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.2}>
          <group
            rotation={[
              mousePos.y * 0.25,
              mousePos.x * 0.4,
              0
            ]}
          >
            {slices.map((s) => (
              <DonutSegment3D
                key={s.item.name}
                item={s.item}
                startAngle={s.start}
                endAngle={s.end}
                isDark={isDark}
                isHovered={hoveredItem?.name === s.item.name}
                onHover={setHoveredItem}
              />
            ))}
          </group>
        </Float>
      </Canvas>

      {/* Floating Center or Hover Tooltip */}
      {hoveredItem ? (
        <div className="absolute top-2 left-2 right-2 sm:left-auto sm:right-2 p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-xs shadow-xl pointer-events-none animate-fadeIn">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredItem.color }} />
            <p className="font-semibold text-white">{hoveredItem.name}</p>
          </div>
          <p className="font-mono text-cyan-400 font-bold">
            {formatINR(hoveredItem.value)} ({hoveredItem.percentage}%)
          </p>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-4">
          <span className="text-[10px] text-slate-400 font-medium">Total Spent</span>
          <span className="text-sm font-bold text-white font-mono">{formatINR(total)}</span>
        </div>
      )}
    </div>
  );
}

