'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const CyberGlobeScene: React.FC<{ isDark: boolean; isMobile: boolean }> = ({ isDark, isMobile }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const cyanColor = '#58a6ff';
  const indigoColor = '#388bfd';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.25;
      globeRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      ringRef.current.rotation.x = Math.cos(t * 0.2) * 0.3;
    }
  });

  return (
    <group>
      <ambientLight intensity={1.1} />
      <pointLight position={[5, 5, 5]} intensity={2.0} color={cyanColor} />

      {/* Outer Wireframe Globe */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh ref={globeRef} scale={isMobile ? 1.2 : 1.6}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={cyanColor}
            wireframe
            roughness={0.15}
            metalness={0.85}
            emissive={cyanColor}
            emissiveIntensity={0.65}
          />
        </mesh>
      </Float>

      {/* Orbiting Signal Ring */}
      <mesh ref={ringRef} scale={isMobile ? 1.6 : 2.1}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshStandardMaterial
          color={indigoColor}
          emissive={indigoColor}
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Particle Signal Emissions */}
      {!isMobile && (
        <Sparkles
          count={80}
          scale={6}
          size={3}
          speed={0.5}
          color={cyanColor}
        />
      )}
    </group>
  );
};

const Contact3DGlobe: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="w-full h-[240px] sm:h-[300px] absolute inset-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <CyberGlobeScene isDark={isDark} isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default Contact3DGlobe;


