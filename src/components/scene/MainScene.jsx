import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import AdvancedSun from './AdvancedSun'
import Planet from './Planet';
import { usePlanetContext } from '../../context/PlanetContext';

const CameraManager = () => {
  const controlsRef = useRef();
  const { activePlanet, setIsCameraAtDestination } = usePlanetContext();
  const { scene } = useThree();

  useEffect(() => {
    if (activePlanet && controlsRef.current) {
      setIsCameraAtDestination(false); // Reset when starting new move
      
      const planetMesh = scene.getObjectByName(activePlanet);
      if (planetMesh) {
        const worldPosition = new THREE.Vector3();
        planetMesh.getWorldPosition(worldPosition);

        const planetRadius = planetMesh.scale.x;
        const offsetDistance = planetRadius * 12; // Increased from 5 to 12 for better framing

        controlsRef.current.setLookAt(
          worldPosition.x, 
          worldPosition.y + (offsetDistance * 0.3), // Slightly lower angle
          worldPosition.z + offsetDistance,        
          worldPosition.x, 
          worldPosition.y, 
          worldPosition.z, 
          true 
        );

        // We can listen for the 'rest' event which fires when camera stops moving
        const onRest = () => {
          setIsCameraAtDestination(true);
          controlsRef.current.removeEventListener('rest', onRest);
        };
        controlsRef.current.addEventListener('rest', onRest);
      }
    }
  }, [activePlanet, scene, setIsCameraAtDestination]);

  return <CameraControls ref={controlsRef} makeDefault minDistance={1} maxDistance={1000} />;
};

const MainScene = () => {
  const { planetsData } = usePlanetContext();

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 20, 50], fov: 45, near: 0.1, far: 10000 }}>
        <color attach="background" args={['#020205']} />

        <ambientLight intensity={1} />

        <Suspense fallback={<Html center><div className="loading-text">Loading Textures...</div></Html>}>
          {planetsData && planetsData.map((planet) => (
            <Planet key={planet.id} planetData={planet} />
          ))}
        </Suspense>

        <CameraManager />
        <AdvancedSun />
      </Canvas>
    </div>
  );
};

export default MainScene;
