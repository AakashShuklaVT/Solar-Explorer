import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlanetContext } from '../../context/PlanetContext';

const SphereModel = () => {
  const meshRef = useRef();

  const { activePlanet } = usePlanetContext();

  const planetColors = {
    Mercury: '#A5A5A5',
    Venus: '#E3BB76',
    Earth: '#2271B3',
    Mars: '#E27B58',
    Jupiter: '#D39C7E',
    Saturn: '#C5AB6E',
    Uranus: '#BBE1E4',
    Neptune: '#6081FF',
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color={planetColors[activePlanet] || 'white'}
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  );
};

export default SphereModel;
