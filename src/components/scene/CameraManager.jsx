import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { usePlanetContext } from '../../context/PlanetContext';

const CameraManager = () => {
  const controlsRef = useRef();
  const { activePlanet, setIsCameraAtDestination, isCameraAtDestination } = usePlanetContext();
  const { scene } = useThree();

  // 1. Initial flight when a NEW planet is selected
  useEffect(() => {
    if (activePlanet && controlsRef.current) {
      setIsCameraAtDestination(false);
      
      const planetMesh = scene.getObjectByName(activePlanet);
      if (planetMesh) {
        const worldPosition = new THREE.Vector3();
        planetMesh.getWorldPosition(worldPosition);

        const planetRadius = planetMesh.scale.x;
        const offsetDistance = planetRadius * 12;

        // Start the long-distance transition
        controlsRef.current.setLookAt(
          worldPosition.x, 
          worldPosition.y + (offsetDistance * 0.3), 
          worldPosition.z + offsetDistance,        
          worldPosition.x, 
          worldPosition.y, 
          worldPosition.z, 
          true 
        );

        const onRest = () => {
          setIsCameraAtDestination(true);
          controlsRef.current.removeEventListener('rest', onRest);
        };
        controlsRef.current.addEventListener('rest', onRest);
      }
    } else if (!activePlanet && controlsRef.current) {
      // Just reset the destination flag, don't move the camera
      setIsCameraAtDestination(false);
    }
  }, [activePlanet, scene, setIsCameraAtDestination]);

  // 2. Continuous "Follow" logic - ONLY after arrival or during movement without interrupting
  useFrame(() => {
    if (activePlanet && controlsRef.current && isCameraAtDestination) {
      const planetMesh = scene.getObjectByName(activePlanet);
      if (planetMesh) {
        const worldPosition = new THREE.Vector3();
        planetMesh.getWorldPosition(worldPosition);
        
        // When already "at destination", we update instantly to follow the orbit
        // Passing 'false' to transition ensures we don't trigger/cancel animations
        controlsRef.current.moveTo(worldPosition.x, worldPosition.y, worldPosition.z, false);
      }
    }
  });

  return <CameraControls ref={controlsRef} makeDefault minDistance={1} maxDistance={1000} />;
};

export default CameraManager;
