import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';

function HolographicOrbCore({ isDark }) {
  const meshRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const ringRef3 = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.6;
      ringRef1.current.rotation.x += delta * 0.3;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.5;
      ringRef2.current.rotation.z += delta * 0.2;
    }
    if (ringRef3.current) {
      ringRef3.current.rotation.x += delta * 0.4;
      ringRef3.current.rotation.y += delta * 0.3;
    }
  });

  const coreColor = isDark ? '#00f0ff' : '#0284c7';
  const ring1Color = isDark ? '#8b5cf6' : '#6366f1';
  const ring2Color = isDark ? '#10b981' : '#059669';

  return (
    <group>
      {/* Central Holographic Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          wireframe
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={isDark ? 0.6 : 0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner Glowing Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial
          color={isDark ? '#0a1025' : '#e0f2fe'}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Orbital Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[1.7, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={ring1Color}
          emissive={ring1Color}
          emissiveIntensity={isDark ? 0.7 : 0.3}
        />
      </mesh>

      {/* Orbital Ring 2 */}
      <mesh ref={ringRef2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.95, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={isDark ? 0.8 : 0.3}
        />
      </mesh>

      {/* Orbital Ring 3 */}
      <mesh ref={ringRef3} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={ring2Color}
          emissive={ring2Color}
          emissiveIntensity={isDark ? 0.5 : 0.2}
        />
      </mesh>
    </group>
  );
}

export default function ThreeAssetOrb({ height = 240 }) {
  const { theme } = useBanking();
  const isDark = theme === 'dark';

  return (
    <div style={{ height }} className="w-full relative flex items-center justify-center select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 rounded-full bg-cyan-500/15 blur-2xl animate-pulseGlow" />
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-3, -3, 2]} intensity={1.2} color="#00f0ff" />
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <HolographicOrbCore isDark={isDark} />
        </Float>
      </Canvas>
    </div>
  );
}
