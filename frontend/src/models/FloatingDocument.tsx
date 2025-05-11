import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { Vector3, Mesh, Group } from 'three';

interface FloatingDocumentProps {
  position?: [number, number, number];
  color?: string;
}

const FloatingDocument: React.FC<FloatingDocumentProps> = ({ 
  position = [0, 0, 0], 
  color = '#17a2b8'
}) => {
  const groupRef = useRef<Group>(null);
  const docRef = useRef<Mesh>(null);
  
  // Animation for floating and rotation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2;
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
    
    if (docRef.current) {
      // Small wobble animation
      docRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={new Vector3(...position)}
    >
      {/* Document */}
      <RoundedBox
        ref={docRef}
        args={[1.4, 1.8, 0.05]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      
      {/* Document content lines */}
      <mesh position={[0, 0.6, 0.03]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
      
      <mesh position={[0, 0.4, 0.03]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
      
      <mesh position={[0, 0.2, 0.03]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
      
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
      
      <mesh position={[0, -0.2, 0.03]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
      
      <mesh position={[0, -0.4, 0.03]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, 0.75, 0.03]}
        color={color}
        fontSize={0.15}
        maxWidth={1}
        textAlign="center"
        font="/assets/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        TEXT
      </Text>
      
      {/* Glow effect */}
      <pointLight position={[0, 0, 0.5]} intensity={0.6} color={color} distance={3} />
    </group>
  );
};

export default FloatingDocument; 