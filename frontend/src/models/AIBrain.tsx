import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Html } from '@react-three/drei';
import { Mesh, PointsMaterial, Points, Vector3, Color } from 'three';

interface AIBrainProps {
  position?: [number, number, number];
  color?: string;
  particleCount?: number;
}

const AIBrain: React.FC<AIBrainProps> = ({ 
  position = [0, 0, 0], 
  color = '#007bff',
  particleCount = 300
}) => {
  const brainRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);
  
  // Create particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      // Create particles in a sphere-like distribution
      const radius = 1.5 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [particleCount]);
  
  // Create particle sizes
  const particleSizes = useMemo(() => {
    const sizes = [];
    for (let i = 0; i < particleCount; i++) {
      sizes.push(Math.random() * 0.05 + 0.02);
    }
    return new Float32Array(sizes);
  }, [particleCount]);
  
  // Animation
  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.003;
      // Pulse animation
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      brainRef.current.scale.set(scale, scale, scale);
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= 0.001;
      particlesRef.current.rotation.z += 0.0005;
      
      // Move particles positions slightly
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.001;
        positions[i+1] += Math.cos(state.clock.getElapsedTime() * 0.5 + i) * 0.001;
        positions[i+2] += Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  // Create the particle material with glowing effect
  const particleMaterial = useMemo(() => {
    return new PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      color: new Color(color),
      sizeAttenuation: true,
      depthWrite: false,
    });
  }, [color]);
  
  return (
    <group position={new Vector3(...position)}>
      {/* Brain */}
      <Sphere ref={brainRef} args={[0.8, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.7}
          distort={0.4}
          speed={1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[particleSizes, 1]}
          />
        </bufferGeometry>
        <primitive object={particleMaterial} attach="material" />
      </points>
      
      {/* Light for glow effect */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color={color} distance={5} />
      
      {/* Label */}
      <Html
        position={[0, -1.5, 0]}
        center
        style={{ color: 'white', fontSize: '0.16em', fontWeight: 'bold', textShadow: '0 0 5px rgba(0,0,0,0.5)' }}
      >
        AI PROCESSING
      </Html>
    </group>
  );
};

export default AIBrain; 