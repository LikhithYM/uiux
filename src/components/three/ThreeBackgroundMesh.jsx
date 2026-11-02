import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useBanking } from '../../context/BankingContext';

function ParticleConstellation({ count = 120, isDark }) {
  const pointsRef = useRef();
  const linesRef = useRef();

  const [positions, originalPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 10 - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
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
      // Gentle floating sine wave motion
      array[idx] += velocities[idx] + Math.sin(time * 0.5 + i) * 0.002;
      array[idx + 1] += velocities[idx + 1] + Math.cos(time * 0.4 + i) * 0.002;
      array[idx + 2] += velocities[idx + 2];

      // Bound reset
      if (Math.abs(array[idx] - originalPositions[idx]) > 2) array[idx] = originalPositions[idx];
      if (Math.abs(array[idx + 1] - originalPositions[idx + 1]) > 2) array[idx + 1] = originalPositions[idx + 1];
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
        size={0.06}
        color={particleColor}
        transparent
        opacity={isDark ? 0.45 : 0.25}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
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
        <ParticleConstellation isDark={isDark} />
      </Canvas>
    </div>
  );
}
