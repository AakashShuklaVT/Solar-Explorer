import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { usePlanetContext } from '../../context/PlanetContext';

const earthRadius = 6371.0084

const textureMap = {
  Mercury: '/textures/mercury.jpg',
  Venus: '/textures/venus.jpg',
  Earth: '/textures/earth.jpg',
  Mars: '/textures/mars.jpg',
  Jupiter: '/textures/jupiter.jpg',
  Saturn: '/textures/saturn.jpg',
  Uranus: '/textures/uranus.jpg',
  Neptune: '/textures/neptune.jpg',
};

const SphereModel = () => {
  const meshRef = useRef();
  const { data, activePlanet } = usePlanetContext();


  const planetTexture = useTexture(textureMap[activePlanet] || textureMap.Earth);

  const scale = data ? data.meanRadius / earthRadius : 1;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={[6, 0, 0]} scale={[scale, scale, scale]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={planetTexture}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

export default SphereModel;

