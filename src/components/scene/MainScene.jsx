import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import AdvancedSun from './AdvancedSun'
import Planet from './Planet';
import CameraManager from './CameraManager';
import { usePlanetContext } from '../../context/PlanetContext';

const MainScene = () => {
  const { planetsData } = usePlanetContext();

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 20, 50], fov: 45, near: 0.1, far: 10000 }}>
        <color attach="background" args={['#010103']} />
        
        {/* Layered starfield for deep space feeling */}
        <Stars 
          radius={300} 
          depth={60} 
          count={20000} 
          factor={7} 
          saturation={0} 
          fade 
          speed={1} 
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight intensity={3} />
        
        <Suspense fallback={<Html center><div className="loading-text">Loading Textures...</div></Html>}>
          {planetsData && planetsData.map((planet) => (
            <Planet key={planet.id} planetData={planet} />
          ))}
        </Suspense>

        <CameraManager />
        <AdvancedSun />

        {/* Cinematic Post-Processing */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={1.0} 
            luminanceSmoothing={0.9} 
            height={300} 
            intensity={1.5} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default MainScene;
