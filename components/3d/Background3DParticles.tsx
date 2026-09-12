'use client';

import React, { useRef, useState, useEffect, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface GlassSphereData { position: [number, number, number]; radius: number; color: string; speed: number; }
interface GlassSphereProps extends GlassSphereData { isMobile?: boolean; }

const SingleGlassSphere: React.FC<GlassSphereProps> = ({ position, radius, color, speed, isMobile = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.35;
      meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.7) * 0.25;
      meshRef.current.rotation.y = t * 0.03;
      meshRef.current.rotation.x = t * 0.015;
    }
    if (ringRef.current) {
      ringRef.current.position.y = position[1] + Math.sin(t * speed) * 0.35;
      ringRef.current.position.x = position[0] + Math.cos(t * speed * 0.7) * 0.25;
      ringRef.current.rotation.z = t * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[radius, isMobile ? 24 : 40, isMobile ? 24 : 40]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.08} transparent opacity={0.1} roughness={0.05} metalness={0.92} clearcoat={1} clearcoatRoughness={0.04} />
      </mesh>
      <mesh ref={ringRef} position={position}>
        <torusGeometry args={[radius * 1.18, 0.015, isMobile ? 8 : 12, isMobile ? 28 : 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} transparent opacity={0.12} wireframe />
      </mesh>
    </group>
  );
};

const FloatingGlassSpheresScene: React.FC<{ isDark: boolean; isMobile: boolean }> = ({ isDark, isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glassSpheres = useMemo<GlassSphereData[]>(() => [
    { position: [-9, 5, -5], radius: 2.9, color: isDark ? '#388bfd' : '#539bf5', speed: 0.22 },
    { position: [10, -1, -6], radius: 3.5, color: isDark ? '#58a6ff' : '#316dca', speed: 0.18 },
    { position: [-8, -9, -5], radius: 2.7, color: isDark ? '#bc8cff' : '#babbf6', speed: 0.24 },
    { position: [9, -15, -6], radius: 3.3, color: isDark ? '#39d353' : '#2ea043', speed: 0.2 },
  ], [isDark]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.015;
    groupRef.current.rotation.x += delta * 0.008;
    if (!isMobile) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.pointer.x * 0.35, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.pointer.y * 0.35, 0.05);
    }
  });

  return <group ref={groupRef}>{glassSpheres.map((sphere, idx) => <SingleGlassSphere key={idx} isMobile={isMobile} {...sphere} />)}</group>;
};

class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.warn('[Background3DParticles] WebGL disabled after runtime error:', error.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

export const Background3DParticles: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted || !webglSupported) return null;

  return (
    <WebGLBoundary>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, isMobile ? 1.1 : 1.35]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 10]} intensity={1.6} />
          <FloatingGlassSpheresScene isDark={resolvedTheme === 'dark'} isMobile={isMobile} />
        </Canvas>
      </div>
    </WebGLBoundary>
  );
};

export default Background3DParticles;
