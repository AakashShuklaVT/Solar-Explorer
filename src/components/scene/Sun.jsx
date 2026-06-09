import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import './SunMaterial'; 

const Sun = () => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <sunMaterial ref={materialRef} />
      <pointLight intensity={5} distance={100} color="#ff5e00" />
    </mesh>
  );
};

export default Sun;
