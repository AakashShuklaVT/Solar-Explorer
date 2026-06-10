import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import AdvancedSun from './AdvancedSun'
import Planet from './Planet';
import { usePlanetContext } from '../../context/PlanetContext';

const MainScene = () => {
  const { planetsData } = usePlanetContext();

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 20], fov: 45, far:10000}}>
        <color attach="background" args={['#020205']} />
        
        {/* We keep ambient light very low for realistic space! */}
        <ambientLight intensity={1} />
        
        <Stars radius={200} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={<Html center><div className="loading-text">Loading Textures...</div></Html>}>
          {planetsData && planetsData.map((planet) => (
            <Planet key={planet.id} planetData={planet} />
          ))}
        </Suspense>
        
        <OrbitControls enablePan={true} minDistance={1} maxDistance={1000} />
        <AdvancedSun /> 
      </Canvas>
    </div>
  );
};

export default MainScene;
