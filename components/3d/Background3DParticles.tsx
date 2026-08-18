'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface ParticleFieldProps {
  isDark: boolean;
  isMobile: boolean;
}

interface GlassSphereData {
  position: [number, number, number];
  radius: number;
  color: string;
  speed: number;
}

const SingleGlassSphere: React.FC<GlassSphereData> = ({
  position,
  radius,
  color,
  speed,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.45;
      meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.6) * 0.35;
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.x = t * 0.03;
    }
    if (ringRef.current) {
      ringRef.current.position.y = position[1] + Math.sin(t * speed) * 0.45;
      ringRef.current.position.x = position[0] + Math.cos(t * speed * 0.6) * 0.35;
      ringRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      {/* Large Subtle Glass Sphere */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.12}
          transparent={true}
          opacity={0.14}
          roughness={0.06}
          metalness={0.88}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Orbiting Wireframe Glass Ring */}
      <mesh ref={ringRef} position={position}>
        <torusGeometry args={[radius * 1.2, 0.02, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          transparent={true}
          opacity={0.18}
          wireframe={true}
        />
      </mesh>
    </group>
  );
};

const ParticleField: React.FC<ParticleFieldProps> = ({ isDark, isMobile }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate 350 particle points distributed in 3D space
  const particleCount = isMobile ? 120 : 350;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    const colorPalette = isDark
      ? ['#388bfd', '#58a6ff', '#bc8cff', '#39d353', '#ff7b72']
      : ['#539bf5', '#316dca', '#babbf6', '#2ea043', '#f47067'];

    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const hex = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      tempColor.set(hex);
      cols[i * 3] = tempColor.r;
      cols[i * 3 + 1] = tempColor.g;
      cols[i * 3 + 2] = tempColor.b;
    }

    return [pos, cols];
  }, [particleCount, isDark]);

  // 4 Carefully Positioned Ambient Glass Spheres
  const glassSpheres: GlassSphereData[] = useMemo(
    () => [
      { position: [-9, 5, -5], radius: 2.8, color: isDark ? '#388bfd' : '#539bf5', speed: 0.3 },
      { position: [10, -1, -6], radius: 3.4, color: isDark ? '#58a6ff' : '#316dca', speed: 0.24 },
      { position: [-8, -9, -5], radius: 2.6, color: isDark ? '#bc8cff' : '#babbf6', speed: 0.32 },
      { position: [9, -15, -6], radius: 3.2, color: isDark ? '#39d353' : '#2ea043', speed: 0.28 },
    ],
    [isDark]
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.025;
      groupRef.current.rotation.x += delta * 0.012;

      if (!isMobile) {
        groupRef.current.position.x = THREE.MathUtils.lerp(
          groupRef.current.position.x,
          state.pointer.x * 0.4,
          0.05
        );
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          state.pointer.y * 0.4,
          0.05
        );
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* 4 Large Subtle Floating Glass Spheres */}
      {!isMobile &&
        glassSpheres.map((sphere, idx) => <SingleGlassSphere key={idx} {...sphere} />)}

      {/* 3D Particle Dust Field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.08 : 0.12}
          vertexColors
          transparent
          opacity={isDark ? 0.75 : 0.65}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Sparkle Constellation Stars */}
      <Sparkles
        count={isMobile ? 50 : 160}
        scale={[25, 25, 15]}
        size={isDark ? 3.5 : 2.5}
        speed={0.4}
        color={isDark ? '#58a6ff' : '#316dca'}
      />
    </group>
  );
};

export const Background3DParticles: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted || !webglSupported) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <ParticleField isDark={isDark} isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default Background3DParticles;

