import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { usePlanetContext } from '../../context/PlanetContext';

const earthRadius = 6371.0084

const SphereModel = () => {
  const meshRef = useRef();
  const { data, activePlanet } = usePlanetContext();

  // 1. Map planet names to their texture files in the public folder
  const textureMap = {
    Mercury: '/textures/mercury.jpg',
    Venus: '/textures/venus.jpg',
    Earth: '/textures/earth.jpg',
    Mars: '/textures/mars.jpg',
    Jupiter: '/textures/jupiter.jpg',
    Saturn: '/textures/saturn.jpg',
    Uranus: '/textures/uranus.jpg',
    // Fallback to Neptune texture if you add it, or Earth for now
    Neptune: '/textures/uranus.jpg', 
  };

  // 2. Load the texture (this automatically uses Suspense)
  const planetTexture = useTexture(textureMap[activePlanet] || textureMap.Earth);

  const scale = data ? data.meanRadius / earthRadius : 1;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* 3. Apply the texture to the 'map' prop */}
      <meshStandardMaterial
        map={planetTexture}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

export default SphereModel;

