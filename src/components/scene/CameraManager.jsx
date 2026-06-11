import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';
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
        const offsetDistance = planetRadius * 12; // Framing offset

        controlsRef.current.setLookAt(
          worldPosition.x, 
          worldPosition.y + (offsetDistance * 0.3), 
          worldPosition.z + offsetDistance,        
          worldPosition.x, 
          worldPosition.y, 
          worldPosition.z, 
          true 
        );

        // Listen for when camera stops moving
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

export default CameraManager;
