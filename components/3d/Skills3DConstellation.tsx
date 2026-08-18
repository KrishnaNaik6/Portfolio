'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const createCodeFaceTexture = (symbol: string, codeSnippet: string, mainColor: string) => {
  if (typeof window === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark semi-transparent glass panel background
    ctx.fillStyle = 'rgba(13, 17, 23, 0.7)';
    ctx.fillRect(0, 0, 512, 512);

    // Glowing border frame
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(16, 16, 480, 480);

    // Inner subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let i = 80; i < 512; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Code Symbol (Prominent Glowing Text)
    ctx.font = 'bold 90px "Fira Code", monospace';
    ctx.fillStyle = mainColor;
    ctx.textAlign = 'center';
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 25;
    ctx.fillText(symbol, 256, 210);

    // Code Snippet Line
    ctx.font = 'bold 30px "Fira Code", monospace';
    ctx.fillStyle = '#e6edf3';
    ctx.shadowColor = '#e6edf3';
    ctx.shadowBlur = 10;
    ctx.fillText(codeSnippet, 256, 330);

    // Status Tag
    ctx.font = 'bold 22px "Fira Code", monospace';
    ctx.fillStyle = mainColor;
    ctx.shadowBlur = 15;
    ctx.fillText('// DNA_SEQ_OK', 256, 420);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const Transparent3DCodeCube: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const outerCubeRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate 6 distinct code face textures for the 6 cube faces
  const faceTextures = useMemo(() => {
    return [
      createCodeFaceTexture('</>', 'const dev = "FullStack";', '#388bfd'), // Right (+X)
      createCodeFaceTexture('{ AI }', 'import torch as nn', '#58a6ff'),     // Left (-X)
      createCodeFaceTexture('[ Next.js ]', 'export default App;', '#bc8cff'),// Top (+Y)
      createCodeFaceTexture('( Docker )', 'docker-compose up -d', '#39d353'),// Bottom (-Y)
      createCodeFaceTexture('< ML >', 'model.fit(X, y)', '#ff7b72'),        // Front (+Z)
      createCodeFaceTexture('{ SQL }', 'SELECT * FROM skills;', '#58a6ff'),  // Back (-Z)
    ];
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && !isMobile) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 4,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 4,
        0.05
      );
    }

    if (outerCubeRef.current) {
      outerCubeRef.current.rotation.y += delta * 0.35;
      outerCubeRef.current.rotation.x += delta * 0.2;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.5;
      innerCoreRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting Architecture */}
      <ambientLight intensity={1.4} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color="#388bfd" />
      <pointLight position={[-10, -10, -10]} intensity={2.0} color="#58a6ff" />

      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.0}>
        <group scale={isMobile ? 1.0 : 1.35}>
          {/* Main 3D Transparent Code Cube */}
          <mesh ref={outerCubeRef}>
            <boxGeometry args={[2.2, 2.2, 2.2]} />
            {faceTextures.map((tex, idx) => (
              <meshStandardMaterial
                key={idx}
                attach={`material-${idx}`}
                map={tex}
                transparent={true}
                opacity={0.85}
                roughness={0.1}
                metalness={0.8}
                emissive="#388bfd"
                emissiveIntensity={0.3}
                side={THREE.DoubleSide}
              />
            ))}
          </mesh>

          {/* Outer Wireframe Highlight Grid */}
          <mesh scale={1.02}>
            <boxGeometry args={[2.22, 2.22, 2.22]} />
            <meshStandardMaterial
              color="#58a6ff"
              emissive="#58a6ff"
              emissiveIntensity={0.7}
              wireframe={true}
            />
          </mesh>

          {/* Inner Glowing Crystal Core */}
          <mesh ref={innerCoreRef} scale={0.7}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#bc8cff"
              emissive="#bc8cff"
              emissiveIntensity={0.9}
              wireframe={true}
            />
          </mesh>
        </group>
      </Float>

      {/* Orbiting Code Particles */}
      <Sparkles
        count={isMobile ? 50 : 120}
        scale={7}
        size={3.5}
        speed={0.4}
        color="#58a6ff"
      />
    </group>
  );
};

const Skills3DConstellation: React.FC = () => {
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

  return (
    <div className="w-full h-[300px] sm:h-[360px] relative z-10 cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Transparent3DCodeCube isMobile={isMobile} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  );
};

export default Skills3DConstellation;
