import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePlanetContext } from '../../context/PlanetContext';
import { EARTH_RADIUS_KM, GLOBAL_SCALE_DIVISOR, DISTANCE_SCALE, SUN_BUFFER, PLANET_SCALE_MULTIPLIER, ORBIT_SPEED_MULTIPLIER, ROTATION_SPEED_MULTIPLIER } from '../../utils/constants';
import PlanetInfoUI from './PlanetInfoUI';

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

const SaturnRings = () => {
  const ringTexture = useTexture('/textures/saturn_ring.png');
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* args are [innerRadius, outerRadius, thetaSegments] */}
      <ringGeometry args={[1.2, 2.4, 64]} />
      <meshStandardMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Planet = ({ planetData }) => {
  const planetRef = useRef();
  const orbitGroupRef = useRef();
  const { activePlanet, setActivePlanet, isCameraAtDestination } = usePlanetContext();

  // 1. Get the texture path based on the planet's name
  const texturePath = textureMap[planetData.englishName] || textureMap.Earth;
  const planetTexture = useTexture(texturePath);

  // 2. Calculate scale mathematically consistent with the Sun using our global divisor, then boost it visually
  const scale = ((planetData.meanRadius / EARTH_RADIUS_KM) / GLOBAL_SCALE_DIVISOR) * PLANET_SCALE_MULTIPLIER;

  // 3. Calculate distance from Sun on the X axis
  const distanceX = (planetData.semimajorAxis * DISTANCE_SCALE) + SUN_BUFFER;

  // 4. Calculate animation speeds from API data
  // sideralOrbit is in days. We divide 1 by it so farther planets move slower.
  const orbitSpeed = (1 / planetData.sideralOrbit) * ORBIT_SPEED_MULTIPLIER;

  // sideralRotation is in hours.
  const rotationSpeed = (1 / planetData.sideralRotation) * ROTATION_SPEED_MULTIPLIER;

  // Highlight effect if the planet is selected in the sidebar
  const isSelected = activePlanet === planetData.englishName;
  const showUI = isSelected && isCameraAtDestination;

  const orbitMaterialRef = useRef();

  // 5. The Animation Loop
  useFrame((state, delta) => {
    // Spin the planet on its own axis
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed;
    }
    // Spin the parent group to make the planet orbit the sun
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * orbitSpeed;
    }

    // NEW: If this is the active planet, we need to update its position in context or global state
    // so the camera can follow it if it moves. However, for a one-time "move to", 
    // we can just use the mesh's world position.

    // Adjust orbit opacity based on camera distance to keep it visible
    if (orbitMaterialRef.current && !isSelected) {
      const dist = state.camera.position.length();
      // As distance increases, we boost opacity to compensate for the line getting thinner on screen
      const opacity = THREE.MathUtils.lerp(0.3, 0.8, Math.min(dist / 500, 1));
      orbitMaterialRef.current.opacity = opacity;
    }
  });

  const handlePlanetClick = (e) => {
    e.stopPropagation()
    setActivePlanet(planetData.englishName)
  }

  return (
    <>
      {/* 6. The visual Orbit Line (Static, centered at [0,0,0]) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        onClick={handlePlanetClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {/* Torus creates a perfect ring at radius distanceX */}
        <torusGeometry args={[distanceX, isSelected ? 0.03 : 0.012, 16, 100]} />
        <meshBasicMaterial 
          ref={orbitMaterialRef}
          color={isSelected ? "#2271b3" : "#ffffff"} 
          transparent 
          opacity={isSelected ? 1 : 0.3} 
          depthWrite={false}
        />
      </mesh>

      {/* 7. The Rotating Orbit Group */}
      <group ref={orbitGroupRef}>
        <group position={[distanceX, 0, 0]}>
          <mesh 
            ref={planetRef} 
            name={planetData.englishName} // Add name for easy lookup
            scale={[scale, scale, scale]}
            onClick={handlePlanetClick}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              map={planetTexture}
            />
            {/* Render the rings ONLY if this planet is Saturn */}
            {planetData.englishName === 'Saturn' && <SaturnRings />}
          </mesh>

          {/* 8. Selection Highlight (Rim/Border) */}
          {isSelected && (
            <mesh scale={[scale * 1.1, scale * 1.1, scale * 1.1]}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshBasicMaterial 
                color="#2271b3" 
                transparent 
                opacity={0.5} 
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}

          {/* 9. 3D HTML UI */}
          <PlanetInfoUI planetData={planetData} isVisible={showUI} scale={scale} />
        </group>
      </group>
    </>
  );
};

export default Planet;
