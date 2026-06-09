import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import SphereModel from './SphereModel';
import Sun from './Sun'
const MainScene = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        
        <ambientLight intensity={1} />
        <directionalLight intensity={4} />

        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Use Suspense to show a fallback while the texture loads */}
        <Suspense fallback={<Html center><div className="loading-text">Loading Texture...</div></Html>}>
          {/* <SphereModel /> */}
        </Suspense>
        
        <OrbitControls enablePan={false} />
        <Sun />
      </Canvas>
    </div>
  );
};

export default MainScene;
