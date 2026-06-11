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
          radius={310} 
          depth={80} 
          count={25000} 
          factor={12} 
          saturation={2} 
          fade 
          speed={2} 
        />

        <ambientLight intensity={1.2} />
        <directionalLight intensity={3.5} />

        <Suspense fallback={<Html center><div className="loading-text">Loading Textures...</div></Html>}>
          {planetsData && planetsData.map((planet) => (
            <Planet key={planet.id} planetData={planet} />
          ))}
        </Suspense>

        <CameraManager />
        <AdvancedSun />

        {/* Cinematic Post-Processing - Stabilized for Fiber 8 */}
        <Suspense fallback={null}>
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={1.0}
              mipmapBlur
              intensity={2}
              radius={0.4}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MainScene;
