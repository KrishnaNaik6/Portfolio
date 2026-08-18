'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface SceneProps {
  isDark: boolean;
  isMobile: boolean;
}

const Laptop3DWorkstation: React.FC<SceneProps> = ({ isDark, isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const dodecaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current && !isMobile) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 6 + Math.sin(t * 0.5) * 0.04,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 8 + 0.18,
        0.05
      );
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.4;
      torusRef.current.rotation.y = t * 0.5;
    }
    if (dodecaRef.current) {
      dodecaRef.current.rotation.x = -t * 0.3;
      dodecaRef.current.rotation.y = t * 0.4;
    }
  });

  const baseColor = '#161b22';
  const metallicColor = '#30363d';
  const glowBlue = '#388bfd';
  const glowCyan = '#58a6ff';
  const glowGreen = '#39d353';
  const glowPurple = '#bc8cff';
  const glowRose = '#ff7b72';

  return (
    <group ref={groupRef}>
      {/* Lighting Architecture */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 8]} intensity={2.4} color={glowBlue} />
      <pointLight position={[-10, -5, -10]} intensity={1.8} color={glowCyan} />
      <pointLight position={[5, -5, 5]} intensity={1.4} color={glowRose} />

      {/* Floating 3D Laptop / Monitor Workstation */}
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.8}>
        <group position={[0, -0.3, 0]} scale={isMobile ? 0.95 : 1.25}>
          {/* --- LAPTOP LOWER BASE --- */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.3, 0.12, 2.3]} />
            <meshStandardMaterial
              color={baseColor}
              metalness={0.92}
              roughness={0.18}
              envMapIntensity={1.2}
            />
          </mesh>

          {/* Trackpad */}
          <mesh position={[0, 0.07, 0.65]}>
            <boxGeometry args={[0.95, 0.01, 0.65]} />
            <meshStandardMaterial color={metallicColor} metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Keyboard Bed */}
          <group position={[0, 0.07, -0.3]}>
            <mesh>
              <boxGeometry args={[2.9, 0.01, 1.15]} />
              <meshStandardMaterial color="#0d1117" metalness={0.9} roughness={0.4} />
            </mesh>
            {/* LED Backlight Glow Bed */}
            <mesh position={[0, -0.01, 0]}>
              <boxGeometry args={[2.95, 0.01, 1.2]} />
              <meshStandardMaterial color={glowBlue} emissive={glowBlue} emissiveIntensity={0.65} />
            </mesh>
          </group>

          {/* --- LAPTOP SCREEN LID (ANGLED DISPLAY) --- */}
          <group position={[0, 0.06, -1.1]} rotation={[-0.38, 0, 0]}>
            {/* Outer Lid Shell */}
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[3.3, 2.2, 0.08]} />
              <meshStandardMaterial color={baseColor} metalness={0.92} roughness={0.18} />
            </mesh>

            {/* Glossy Screen Bezel */}
            <mesh position={[0, 1.1, 0.045]}>
              <boxGeometry args={[3.2, 2.1, 0.01]} />
              <meshStandardMaterial color="#000000" roughness={0.1} />
            </mesh>

            {/* Illuminated Monitor Display Surface */}
            <mesh position={[0, 1.1, 0.052]}>
              <planeGeometry args={[3.0, 1.9]} />
              <meshStandardMaterial
                color="#0d1117"
                emissive={glowBlue}
                emissiveIntensity={0.5}
                roughness={0.1}
              />
            </mesh>

            {/* Terminal Code Display Graphics */}
            <group position={[0, 1.1, 0.06]}>
              {/* Header Bar */}
              <mesh position={[0, 0.75, 0]}>
                <planeGeometry args={[2.8, 0.22]} />
                <meshStandardMaterial color="#161b22" emissive={glowBlue} emissiveIntensity={0.3} />
              </mesh>
              {/* Window Control Buttons */}
              <mesh position={[-1.25, 0.75, 0.01]}>
                <circleGeometry args={[0.035, 16]} />
                <meshStandardMaterial color={glowRose} emissive={glowRose} emissiveIntensity={0.9} />
              </mesh>
              <mesh position={[-1.15, 0.75, 0.01]}>
                <circleGeometry args={[0.035, 16]} />
                <meshStandardMaterial color="#d29922" emissive="#d29922" emissiveIntensity={0.9} />
              </mesh>
              <mesh position={[-1.05, 0.75, 0.01]}>
                <circleGeometry args={[0.035, 16]} />
                <meshStandardMaterial color={glowGreen} emissive={glowGreen} emissiveIntensity={0.9} />
              </mesh>

              {/* Hologram Code Lines */}
              {[
                { y: 0.45, w: 1.9, c: glowCyan },
                { y: 0.25, w: 2.3, c: glowBlue },
                { y: 0.05, w: 1.6, c: glowGreen },
                { y: -0.15, w: 2.1, c: glowPurple },
                { y: -0.35, w: 1.5, c: glowCyan },
                { y: -0.55, w: 2.0, c: glowBlue },
              ].map((line, idx) => (
                <mesh key={idx} position={[-0.4 + (2.7 - line.w) / 2, line.y, 0.01]}>
                  <planeGeometry args={[line.w, 0.08]} />
                  <meshStandardMaterial color={line.c} emissive={line.c} emissiveIntensity={0.8} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </Float>

      {/* Orbiting Hologram Torus Knot */}
      <Float speed={3} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={torusRef} position={isMobile ? [1.8, 1.2, -1] : [2.6, 1.2, -1]} scale={isMobile ? 0.35 : 0.48}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <meshStandardMaterial
            color={glowCyan}
            wireframe={true}
            roughness={0.15}
            metalness={0.85}
            emissive={glowCyan}
            emissiveIntensity={0.7}
          />
        </mesh>
      </Float>

      {/* Orbiting Hologram Dodecahedron */}
      <Float speed={2.2} rotationIntensity={1.0} floatIntensity={1.0}>
        <mesh ref={dodecaRef} position={isMobile ? [-1.8, -1.0, -1] : [-2.6, -1.0, -1]} scale={isMobile ? 0.38 : 0.55}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={glowRose}
            wireframe={true}
            roughness={0.15}
            metalness={0.85}
            emissive={glowRose}
            emissiveIntensity={0.7}
          />
        </mesh>
      </Float>

      {/* Particle Sparkle Dust */}
      {!isMobile && (
        <Sparkles
          count={130}
          scale={10}
          size={3.5}
          speed={0.4}
          color={glowCyan}
        />
      )}
    </group>
  );
};

export const Hero3DCanvas: React.FC = () => {
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
    <div className="w-full h-[340px] sm:h-[400px] md:h-[480px] relative z-10 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Laptop3DWorkstation isDark={isDark} isMobile={isMobile} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
