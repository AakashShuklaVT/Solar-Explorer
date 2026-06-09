import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import SphereModel from './SphereModel';

const MainScene = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        {/* Basic Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Space Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* The Reactive Planet */}
        <SphereModel />
        
        {/* Navigation */}
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default MainScene;
