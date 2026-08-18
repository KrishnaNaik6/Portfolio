'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface SceneProps {
  isDark: boolean;
  isMobile: boolean;
}

const Cosmic3DCore: React.FC<SceneProps> = ({ isDark, isMobile }) => {
  const torusRef = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.35;
      torusRef.current.rotation.y = t * 0.45;
    }
    if (dodecaRef.current) {
      dodecaRef.current.rotation.x = -t * 0.25;
      dodecaRef.current.rotation.y = t * 0.5;
    }
    if (groupRef.current && !isMobile) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 6,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 6,
        0.05
      );
    }
  });

  // New Midnight Cosmic & Warm Porcelain Theme Palette
  const indigoColor = isDark ? '#6366F1' : '#4338CA';
  const cyanColor = isDark ? '#06B6D4' : '#0e7490';
  const roseColor = isDark ? '#F43F5E' : '#E11D48';

  return (
    <group ref={groupRef}>
      {/* Lighting Architecture */}
      <ambientLight intensity={isDark ? 0.7 : 1.3} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 1.5 : 2.2} color={indigoColor} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 1.8 : 1.0} color={cyanColor} />
      <pointLight position={[5, -5, 5]} intensity={isDark ? 1.2 : 0.6} color={roseColor} />

      {/* Main Distorted Cosmic Core Sphere */}
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[0, 0, 0]} scale={isMobile ? 1.1 : 1.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color={indigoColor}
            envMapIntensity={0.8}
            clearcoat={isDark ? 0.9 : 0.5}
            clearcoatRoughness={0.15}
            metalness={isDark ? 0.4 : 0.1}
            roughness={isDark ? 0.25 : 0.35}
            distort={0.4}
            speed={3.5}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* Orbiting Torus Knot */}
      <Float speed={3} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={torusRef} position={isMobile ? [1.6, 1.1, -1] : [2.6, 1.1, -1]} scale={isMobile ? 0.4 : 0.55}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <meshStandardMaterial
            color={cyanColor}
            wireframe={isDark}
            roughness={0.3}
            metalness={0.7}
            emissive={isDark ? cyanColor : '#000000'}
            emissiveIntensity={isDark ? 0.5 : 0}
          />
        </mesh>
      </Float>

      {/* Orbiting Dodecahedron */}
      <Float speed={2.2} rotationIntensity={1.0} floatIntensity={1.0}>
        <mesh ref={dodecaRef} position={isMobile ? [-1.6, -1.1, -1] : [-2.6, -1.1, -1]} scale={isMobile ? 0.45 : 0.65}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={roseColor}
            wireframe={true}
            roughness={0.2}
            metalness={0.8}
            emissive={isDark ? roseColor : '#000000'}
            emissiveIntensity={isDark ? 0.6 : 0}
          />
        </mesh>
      </Float>

      {/* Background Sparkle Particles */}
      {!isMobile && (
        <Sparkles
          count={isDark ? 130 : 65}
          scale={10}
          size={isDark ? 3.5 : 2}
          speed={0.4}
          color={isDark ? indigoColor : cyanColor}
        />
      )}
    </group>
  );
};

const Hero3DCanvas: React.FC = () => {
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

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  if (!webglSupported) {
    return (
      <div className="w-full h-[320px] md:h-[420px] flex items-center justify-center relative">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-neon-indigo via-neon-cyan to-neon-rose opacity-25 blur-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] sm:h-[380px] md:h-[450px] relative z-10 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Cosmic3DCore isDark={isDark} isMobile={isMobile} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
