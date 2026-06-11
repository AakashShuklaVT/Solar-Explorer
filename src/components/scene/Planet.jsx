import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Line } from '@react-three/drei';
import * as THREE from 'three';
import { usePlanetContext } from '../../context/PlanetContext';
import { EARTH_RADIUS_KM, GLOBAL_SCALE_DIVISOR, DISTANCE_SCALE, SUN_BUFFER, PLANET_SCALE_MULTIPLIER, ORBIT_SPEED_MULTIPLIER, ROTATION_SPEED_MULTIPLIER } from '../../utils/constants';
import PlanetInfoUI from './PlanetInfoUI';
import Atmosphere from './Atmosphere';

const atmosphereColors = {
  Venus: '#ffcc88',
  Earth: '#4488ff',
  Mars: '#ff6633',
  Jupiter: '#ccaa88',
  Saturn: '#ccaa88',
  Uranus: '#88ccff',
  Neptune: '#4488ff',
};

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
  const highlightRef = useRef();
  const orbitRef = useRef();
  const { activePlanet, setActivePlanet, isCameraAtDestination } = usePlanetContext();

  // 1. Get the texture path based on the planet's name
  const texturePath = textureMap[planetData.englishName] || textureMap.Earth;
  const planetTexture = useTexture(texturePath);

  // 2. Calculate scale mathematically consistent with the Sun using our global divisor, then boost it visually
  const scale = ((planetData.meanRadius / EARTH_RADIUS_KM) / GLOBAL_SCALE_DIVISOR) * PLANET_SCALE_MULTIPLIER;

  // 3. Calculate distance from Sun on the X axis
  const distanceX = (planetData.semimajorAxis * DISTANCE_SCALE) + SUN_BUFFER;

  // 4. Calculate animation speeds from API data
  const orbitSpeed = (1 / planetData.sideralOrbit) * ORBIT_SPEED_MULTIPLIER;
  const rotationSpeed = (1 / planetData.sideralRotation) * ROTATION_SPEED_MULTIPLIER;

  // Highlight effect if the planet is selected in the sidebar
  const isSelected = activePlanet === planetData.englishName;
  const showUI = isSelected && isCameraAtDestination;

  // Generate points for the orbit line (circle)
  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * distanceX, 0, Math.sin(angle) * distanceX));
    }
    return points;
  }, [distanceX]);

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

    // --- Dynamic Visuals Logic ---
    const planetWorldPos = new THREE.Vector3();
    if (planetRef.current) planetRef.current.getWorldPosition(planetWorldPos);
    const distToCamera = state.camera.position.distanceTo(planetWorldPos);

    // A. Adjust Highlight Boundary Thickness (Scale)
    if (highlightRef.current && isSelected) {
      // Scale ranges from 1.05 (close) to 1.35 (far) relative to planet scale
      const boost = THREE.MathUtils.mapLinear(distToCamera, 5, 500, 1.05, 1.35);
      highlightRef.current.scale.setScalar(scale * Math.max(1.05, Math.min(boost, 1.35)));
    }

    // B. Adjust Orbit Line Thickness and Opacity
    if (orbitRef.current) {
      // Width ranges from base (close) to base * 3 (far)
      const baseWidth = isSelected ? 2 : 0.8;
      const targetWidth = THREE.MathUtils.mapLinear(distToCamera, 20, 1000, baseWidth, baseWidth * 4);
      orbitRef.current.lineWidth = THREE.MathUtils.lerp(orbitRef.current.lineWidth || baseWidth, targetWidth, 0.1);

      // Boost opacity when far away
      const opacity = THREE.MathUtils.lerp(0.3, 0.8, Math.min(distToCamera / 1000, 1));
      orbitRef.current.material.opacity = isSelected ? 1 : opacity;
    }
  });

  const handlePlanetClick = (e) => {
    e.stopPropagation()
    setActivePlanet(planetData.englishName)
  }

  return (
    <>
      {/* 6. The visual Orbit Line (Now using Drei Line for better thickness control) */}
      <Line
        ref={orbitRef}
        points={orbitPoints}
        color={isSelected ? "#2271b3" : "#ffffff"}
        transparent
        opacity={0.3}
        lineWidth={1}
        onClick={handlePlanetClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />

      {/* 7. The Rotating Orbit Group */}
      <group ref={orbitGroupRef}>
        <group position={[distanceX, 0, 0]}>
          <mesh 
            ref={planetRef} 
            name={planetData.englishName}
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

          {/* Atmosphere Effect */}
          {atmosphereColors[planetData.englishName] && (
            <Atmosphere color={atmosphereColors[planetData.englishName]} scale={scale} />
          )}

          {/* 8. Selection Highlight (Rim/Border) */}
          {isSelected && (
            <mesh ref={highlightRef}>
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
