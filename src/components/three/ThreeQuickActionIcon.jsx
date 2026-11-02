import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';

/**
 * 3D Micro-Icon Meshes for Quick Actions
 */
function SendMoneyMesh({ isHovered, isDark }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = isHovered ? 2.5 : 0.8;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.08;
  });

  const arrowColor = isDark ? '#00f0ff' : '#0284c7';

  return (
    <group ref={groupRef} rotation={[0.2, 0, -0.4]}>
      {/* 3D Arrow Head */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.35, 0.5, 4]} />
        <meshStandardMaterial
          color={arrowColor}
          metalness={0.9}
          roughness={0.2}
          emissive={arrowColor}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
        />
      </mesh>
      {/* 3D Shaft */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.45, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function RequestMoneyMesh({ isHovered, isDark }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = isHovered ? -2.2 : -0.7;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.position.y = Math.cos(state.clock.getElapsedTime() * 2) * 0.08;
  });

  const color = isDark ? '#38bdf8' : '#0369a1';

  return (
    <group ref={groupRef} rotation={[-0.2, 0, 0.3]}>
      {/* Reverse Incoming Arrow Cone */}
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.35, 0.5, 4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
        />
      </mesh>
      {/* Mini Coin entering */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.95}
          roughness={0.15}
          emissive="#b45309"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function PayBillsMesh({ isHovered, isDark }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const speed = isHovered ? 1.8 : 0.6;
    meshRef.current.rotation.y += delta * speed;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
  });

  const docColor = isDark ? '#818cf8' : '#6366f1';

  return (
    <group ref={meshRef}>
      {/* 3D Floating Document Sheet */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.55, 0.75, 0.05]} />
        <meshPhysicalMaterial
          color={isDark ? '#1e1b4b' : '#e0e7ff'}
          metalness={0.7}
          roughness={0.3}
          clearcoat={0.5}
          emissive={docColor}
          emissiveIntensity={isHovered ? 0.6 : 0.2}
        />
      </mesh>
      {/* Glowing Energy Bolt on invoice */}
      <mesh position={[0, 0, 0.035]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.4, 0.02]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

function AddMoneyMesh({ isHovered, isDark }) {
  const coinRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (coinRef.current) {
      const speed = isHovered ? 2.8 : 1.2;
      coinRef.current.rotation.y += delta * speed;
      // Coin dropping into wallet ring
      coinRef.current.position.y = -0.05 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.18;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group>
      {/* 3D Gold Coin */}
      <mesh ref={coinRef} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.07, 24]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.95}
          roughness={0.15}
          emissive="#f59e0b"
          emissiveIntensity={isHovered ? 0.7 : 0.3}
        />
      </mesh>
      {/* Metallic Portal / Wallet Ring */}
      <mesh ref={ringRef} position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.06, 12, 32]} />
        <meshStandardMaterial
          color={isDark ? '#c084fc' : '#9333ea'}
          metalness={0.9}
          roughness={0.2}
          emissive={isDark ? '#a855f7' : '#7e22ce'}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  );
}

export default function ThreeQuickActionIcon({ type = 'send', isHovered = false }) {
  const { theme } = useBanking();
  const isDark = theme === 'dark';

  return (
    <div className="w-10 h-10 pointer-events-none flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={isDark ? 1.2 : 1.5} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} />
        <directionalLight position={[-2, -2, -1]} intensity={0.6} color="#00f0ff" />

        {type === 'send' && <SendMoneyMesh isHovered={isHovered} isDark={isDark} />}
        {type === 'request' && <RequestMoneyMesh isHovered={isHovered} isDark={isDark} />}
        {type === 'bills' && <PayBillsMesh isHovered={isHovered} isDark={isDark} />}
        {type === 'add' && <AddMoneyMesh isHovered={isHovered} isDark={isDark} />}
      </Canvas>
    </div>
  );
}

