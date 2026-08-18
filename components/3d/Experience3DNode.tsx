'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface Experience3DNodeProps {
  index: number;
}

const Timeline3DMesh: React.FC<{ index: number }> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const colors = ['#388bfd', '#bc8cff', '#ff7b72', '#39d353', '#58a6ff'];
  const activeColor = colors[index % colors.length];

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.8;
      meshRef.current.rotation.y += delta * 1.2;
    }
  });

  const getGeometry = () => {
    switch (index % 3) {
      case 0:
        return <octahedronGeometry args={[1, 0]} />;
      case 1:
        return <icosahedronGeometry args={[1, 0]} />;
      case 2:
      default:
        return <torusKnotGeometry args={[0.7, 0.25, 64, 16]} />;
    }
  };

  return (
    <Float speed={3} rotationIntensity={1.5} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.2}>
        {getGeometry()}
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={0.7}
          wireframe={true}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
    </Float>
  );
};

export const Experience3DNode: React.FC<Experience3DNodeProps> = ({ index }) => {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!mounted || !webglSupported) {
    return (
      <div className="w-5 h-5 rounded-full bg-neon-indigo ring-4 ring-neon-indigo/20 shadow-[0_0_15px_#388bfd]" />
    );
  }

  return (
    <div className="w-10 h-10 -ml-3 -mt-2 relative z-20 pointer-events-none cursor-pointer">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={2.0} />
        <Timeline3DMesh index={index} />
      </Canvas>
    </div>
  );
};

export default Experience3DNode;
