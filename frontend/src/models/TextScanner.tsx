import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';
import { Vector3, Mesh } from 'three';

interface TextScannerProps {
  position?: [number, number, number];
  color?: string;
}

const TextScanner: React.FC<TextScannerProps> = ({ 
  position = [0, 0, 0], 
  color = '#007bff'
}) => {
  const scannerRef = useRef<Mesh>(null);
  const scanlineRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y += 0.005;
    }
    
    if (scanlineRef.current) {
      // Make the scanline move up and down
      scanlineRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <group position={new Vector3(...position)}>
      {/* Scanner Base */}
      <mesh
        ref={scannerRef}
        scale={1}
      >
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Scanner Posts */}
      <mesh
        position={[0.8, 1, 0.8]}
      >
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      
      <mesh
        position={[-0.8, 1, 0.8]}
      >
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      
      <mesh
        position={[-0.8, 1, -0.8]}
      >
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      
      <mesh
        position={[0.8, 1, -0.8]}
      >
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      
      {/* Scanner Top */}
      <mesh
        position={[0, 2, 0]}
      >
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Scanning Light */}
      <mesh
        ref={scanlineRef}
        position={[0, 1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.8, 1.8]} />
        <MeshWobbleMaterial 
          factor={0.3} 
          speed={2} 
          color={color} 
          transparent 
          opacity={0.5} 
        />
      </mesh>
    </group>
  );
};

export default TextScanner; 