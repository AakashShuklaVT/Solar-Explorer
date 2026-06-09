import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// 1. Define the ShaderMaterial using the ShaderToy logic
// We adapt iTime, iResolution, and iMouse to Three.js uniforms
const SunShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uMouse: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader (Adapted from ShaderToy)
  `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  #define DITHERING
  #define pi 3.14159265
  #define R(p, a) p=cos(a)*p+sin(a)*vec2(p.y, -p.x)

  // Simple noise fallback since we don't have iChannel0 textures easily
  float pn( in vec3 p ) {
      vec3 ip = floor(p);
      p = fract(p);
      p *= p*(3.0-2.0*p);
      vec2 co = ip.xy + vec2(37.0, 17.0) * ip.z;
      float a = fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      float b = fract(sin(dot(co + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453);
      return mix(a, b, p.z);
  }

  float fpn(vec3 p) {
      return pn(p*.06125)*.57 + pn(p*.125)*.28 + pn(p*.25)*.15;
  }

  float rand(vec2 co) {
      return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);
  }

  float cosNoise( in vec2 p ) {
      return 0.5*( sin(p.x) + sin(p.y) );
  }

  const mat2 m2 = mat2(1.6,-1.2, 1.2, 1.6);

  float sdTorus( vec3 p, vec2 t ) {
    return length( vec2(length(p.xz)-t.x*1.2,p.y) )-t.y;
  }

  float smin( float a, float b, float k ) {
      float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
      return mix( b, a, h ) - k*h*(1.0-h);
  }

  float SunSurface( in vec3 pos ) {
      float h = 0.0;
      vec2 q = pos.xz*0.5;
      float s = 0.5;
      for( int i=0; i<6; i++ ) {
          h += s*cosNoise( q ); 
          q = m2*q*0.85; 
          q += vec2(2.41,8.13);
          s *= 0.48 + 0.2*h;
      }
      h *= 2.0;
      float d1 = length(pos) - 2.0 - h * 0.2; // Simplified for sphere
      return d1;
  }

  float map(vec3 p) {
     R(p.yz, -0.5);
     R(p.xz, uMouse.x*0.008*pi+uTime*0.1);
     return SunSurface(p) + fpn(p*10.+uTime*2.) * 0.2;
  }

  vec3 firePalette(float i){
      float T = 1400. + 1300.*i;
      vec3 L = vec3(7.4, 5.6, 4.4);
      L = pow(L,vec3(5.0)) * (exp(1.43876719683e5/(T*L))-1.0);
      return 1.0-exp(-5e8/L);
  }

  void main() {
     vec2 fragCoord = vUv * uResolution;
     vec3 rd = normalize(vec3((vUv - 0.5) * vec2(uResolution.x/uResolution.y, 1.0), 1.0));
     vec3 ro = vec3(0., 0., -5.);
     
     float ld=0., td=0., w=0.;
     float d=1., t=0.;
     const float h = .1;
     vec3 tc = vec3(0.);
     
     #ifdef DITHERING
     vec2 seed = vUv + fract(uTime);
     #endif
      
     for (int i=0; i<40; i++) {
        if(td>(1.-1./80.) || t>10.) break;
        d = map(ro+t*rd); 
        ld = (h - d) * step(d, h);
        w = (1. - td) * ld;   
        tc += w*w + 1./50.;
        td += w + 1./200.;
        #ifdef DITHERING  
        d = abs(d)*(.8+0.28*rand(seed*vec2(i)));
        #endif
        t += max(d * 0.5, 0.02);
     }

     tc = firePalette(tc.x);
     gl_FragColor = vec4(tc, 1.0);
  }
  `
);

// Register the material so we can use it as a tag
extend({ SunShaderMaterial });

const Sun = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uResolution.set(window.innerWidth, window.innerHeight);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <sunShaderMaterial ref={materialRef} transparent />
      <pointLight intensity={3} distance={100} color="#ffaa00" />
    </mesh>
  );
};

export default Sun;
