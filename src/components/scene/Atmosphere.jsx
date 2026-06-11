import React, { useMemo } from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const AtmosphereMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#4488ff'),
    uCoefficient: 0.1,
    uPower: 4.0,
  },
  // Vertex Shader
  `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uCoefficient;
  uniform float uPower;
  void main() {
    // Rim light effect: brighter when normal is perpendicular to view direction
    float intensity = pow(uCoefficient + (1.0 - abs(dot(vNormal, vec3(0, 0, 1.0)))), uPower);
    gl_FragColor = vec4(uColor, intensity);
  }
  `
);

extend({ AtmosphereMaterial });

const Atmosphere = ({ color, scale }) => {
  return (
    <mesh scale={[scale * 1.15, scale * 1.15, scale * 1.15]}>
      <sphereGeometry args={[1, 64, 64]} />
      <atmosphereMaterial 
        uColor={new THREE.Color(color)} 
        transparent 
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default Atmosphere;
