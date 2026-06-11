import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import AdvancedSun from './AdvancedSun'
import Planet from './Planet';
import CameraManager from './CameraManager';
import { usePlanetContext } from '../../context/PlanetContext';

const MainScene = () => {
  const { planetsData } = usePlanetContext();

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 20, 50], fov: 45, near: 0.1, far: 10000 }}>
        <color attach="background" args={['#020205']} />
        <Stars radius={300}  count={8000} speed={1.2} fade={true}/>
        <ambientLight intensity={1} />
        <directionalLight intensity={3} />
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
