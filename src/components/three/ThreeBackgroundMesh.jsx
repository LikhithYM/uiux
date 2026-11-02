import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';

/**
 * Connected financial nodes and constellation particles
 */
function FinancialNetworkNodes({ count = 90, isDark }) {
  const pointsRef = useRef();

  const [positions, originalPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 10 - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return [pos, orig, vel];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      array[idx] += velocities[idx] + Math.sin(time * 0.3 + i) * 0.0015;
      array[idx + 1] += velocities[idx + 1] + Math.cos(time * 0.25 + i) * 0.0015;
      array[idx + 2] += velocities[idx + 2];

      // Soft rebound
      if (Math.abs(array[idx] - originalPositions[idx]) > 2.5) array[idx] = originalPositions[idx];
      if (Math.abs(array[idx + 1] - originalPositions[idx + 1]) > 2.5) array[idx + 1] = originalPositions[idx + 1];
    }
    posAttr.needsUpdate = true;
  });

  const particleColor = isDark ? '#00f0ff' : '#0284c7';

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color={particleColor}
        transparent
        opacity={isDark ? 0.38 : 0.22}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/**
 * Slowly rotating subtle geometric structure in deep background
 */
function BackgroundQuantumGeometry({ isDark }) {
  const mesh1Ref = useRef();
  const mesh2Ref = useRef();

  useFrame((state, delta) => {
    if (mesh1Ref.current) {
      mesh1Ref.current.rotation.x += delta * 0.05;
      mesh1Ref.current.rotation.y += delta * 0.07;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.y -= delta * 0.04;
      mesh2Ref.current.rotation.z += delta * 0.06;
    }
  });

  const wireColor1 = isDark ? '#00f0ff' : '#0284c7';
  const wireColor2 = isDark ? '#8b5cf6' : '#6366f1';

  return (
    <group position={[5, 1, -6]}>
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={mesh1Ref}>
        <icosahedronGeometry args={[3.2, 1]} />
        <meshStandardMaterial
          wireframe
          color={wireColor1}
          transparent
          opacity={isDark ? 0.08 : 0.05}
        />
      </mesh>

      {/* Inner Wireframe Octahedron */}
      <mesh ref={mesh2Ref}>
        <octahedronGeometry args={[2.0, 0]} />
        <meshStandardMaterial
          wireframe
          color={wireColor2}
          transparent
          opacity={isDark ? 0.12 : 0.06}
        />
      </mesh>
    </group>
  );
}

/**
 * Floating translucent spheres with low visual intensity
 */
function FloatingTranslucentOrbs({ isDark }) {
  const orb1Ref = useRef();
  const orb2Ref = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (orb1Ref.current) {
      orb1Ref.current.position.y = -2 + Math.sin(time * 0.4) * 0.4;
      orb1Ref.current.position.x = -6 + Math.cos(time * 0.3) * 0.3;
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.y = 3 + Math.cos(time * 0.35) * 0.35;
      orb2Ref.current.position.x = 7 + Math.sin(time * 0.45) * 0.25;
    }
  });

  const color1 = isDark ? '#00f0ff' : '#38bdf8';
  const color2 = isDark ? '#8b5cf6' : '#818cf8';

  return (
    <group>
      <mesh ref={orb1Ref} position={[-6, -2, -5]}>
        <sphereGeometry args={[1.4, 24, 24]} />
        <meshStandardMaterial
          color={color1}
          transparent
          opacity={isDark ? 0.06 : 0.04}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={orb2Ref} position={[7, 3, -6]}>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshStandardMaterial
          color={color2}
          transparent
          opacity={isDark ? 0.05 : 0.03}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

export default function ThreeBackgroundMesh() {
  const { theme } = useBanking();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={isDark ? 0.5 : 0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <FinancialNetworkNodes count={80} isDark={isDark} />
        <BackgroundQuantumGeometry isDark={isDark} />
        <FloatingTranslucentOrbs isDark={isDark} />
      </Canvas>
    </div>
  );
}
