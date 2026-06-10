import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Shaders
import perlinVS from '../../assets/shaders/perlinVS.glsl';
import perlinFS from '../../assets/shaders/perlinFS.glsl';
import sunSphereVS from '../../assets/shaders/sunSphereVS.glsl';
import sunSphereFS from '../../assets/shaders/sunSphereFS.glsl';

import sunRaysVS from '../../assets/shaders/sunRaysVS.glsl';
import sunRaysFS from '../../assets/shaders/sunRaysFS.glsl';
import sunFlaresVS from '../../assets/shaders/sunFlaresVS.glsl';
import sunFlaresFS from '../../assets/shaders/sunFlaresFS.glsl';

// Materials
export const PerlinMaterial = shaderMaterial(
  {
    uTime: 0,
    uSpatialFrequency: 6,
    uTemporalFrequency: 0.1,
    uH: 1,
    uContrast: 0.25,
    uFlatten: 0.72,
  },
  perlinVS,
  perlinFS
);

export const SunSphereMaterial = shaderMaterial(
  {
    uTime: 0,
    uPerlinCube: null,
    uFresnelPower: 1.0,
    uFresnelInfluence: 0.8,
    uTint: 0.2,
    uBase: 4.0,
    uBrightnessOffset: 1,
    uBrightness: 0.6,
    uVisibility: 1,
    uDirection: 1.0,
    uLightView: new THREE.Vector3(1, 1, 1).normalize(),
  },
  sunSphereVS,
  sunSphereFS
);


export const SunRaysMaterial = shaderMaterial(
  {
    uViewProjection: new THREE.Matrix4(),
    uCamPos: new THREE.Vector3(),
    uTime: 0,
    uVisibility: 1,
    uDirection: 1,
    uLightView: new THREE.Vector3(1, 1, 1).normalize(),
    uWidth: 0.03,
    uLength: 0.45,
    uOpacity: 0.03,
    uNoiseFrequency: 8.0,
    uNoiseAmplitude: 0.4,
    uAlphaBlended: 0.3,
    uHueSpread: 0.2,
    uHue: 0.2,
    uResolution: new THREE.Vector4(),
  },
  sunRaysVS,
  sunRaysFS
);

export const SunFlaresMaterial = shaderMaterial(
  {
    uViewProjection: new THREE.Matrix4(),
    uCamPos: new THREE.Vector3(),
    uTime: 0,
    uVisibility: 1,
    uDirection: 1,
    uLightView: new THREE.Vector3(1, 1, 1).normalize(),
    uWidth: 0.03,
    uAmp: 0.08,
    uOpacity: 0.03,
    uNoiseFrequency: 8.0,
    uNoiseAmplitude: 0.4,
    uAlphaBlended: 0.3,
    uHueSpread: 0.1,
    uHue: 0.1,
    uResolution: new THREE.Vector4(),
  },
  sunFlaresVS,
  sunFlaresFS
);

extend({ PerlinMaterial, SunSphereMaterial, SunRaysMaterial, SunFlaresMaterial });
