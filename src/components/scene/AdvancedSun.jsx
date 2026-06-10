import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Shaders
import perlinVS from '../../assets/shaders/perlinVS.glsl';
import perlinFS from '../../assets/shaders/perlinFS.glsl';
import sunSphereVS from '../../assets/shaders/sunSphereVS.glsl';
import sunSphereFS from '../../assets/shaders/sunSphereFS.glsl';
import glowVS from '../../assets/shaders/glowVS.glsl';
import glowFS from '../../assets/shaders/glowFS.glsl';
import sunRaysVS from '../../assets/shaders/sunRaysVS.glsl';
import sunRaysFS from '../../assets/shaders/sunRaysFS.glsl';
import sunFlaresVS from '../../assets/shaders/sunFlaresVS.glsl';
import sunFlaresFS from '../../assets/shaders/sunFlaresFS.glsl';

// Materials
const PerlinMaterial = shaderMaterial(
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

const SunSphereMaterial = shaderMaterial(
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

const GlowMaterial = shaderMaterial(
  {
    uViewProjection: new THREE.Matrix4(),
    uRadius: 0.4,
    uTint: 0.4,
    uBrightness: 1.06,
    uFalloffColor: 0.5,
    uCamUp: new THREE.Vector3(0, 1, 0),
    uCamPos: new THREE.Vector3(),
    uVisibility: 1,
    uDirection: 1,
    uLightView: new THREE.Vector3(1, 1, 1).normalize(),
  },
  glowVS,
  glowFS
);

const SunRaysMaterial = shaderMaterial(
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

const SunFlaresMaterial = shaderMaterial(
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

extend({ PerlinMaterial, SunSphereMaterial, GlowMaterial, SunRaysMaterial, SunFlaresMaterial });

const SunGlow = ({ sunMaterialRef }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { camera } = useThree();

  const geometry = useMemo(() => {
    const segments = 134;
    const rSphere = 1.49;
    const positions = new Float32Array(3 * (2 * segments));
    let r = 0;
    for (let a = 0; a < segments; a++) {
      const s = (a / segments) * Math.PI * 2.0;
      const sx = Math.sin(s) * rSphere;
      const sy = Math.cos(s) * rSphere;
      positions[r++] = sx; positions[r++] = sy; positions[r++] = 0.0;
      positions[r++] = sx; positions[r++] = sy; positions[r++] = 1.0;
    }
    const indices = new Uint16Array(2 * segments * 3);
    let o = 0;
    for (let a = 0; a < segments; a++) {
      const i0 = 2 * a;
      const i1 = 2 * a + 1;
      const i2 = 2 * ((a + 1) % segments);
      const i3 = i2 + 1;
      indices[o++] = i0; indices[o++] = i1; indices[o++] = i2;
      indices[o++] = i2; indices[o++] = i1; indices[o++] = i3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('aPos', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }, []);

  useFrame((state) => {
    const { camera } = state;
    if (materialRef.current && sunMaterialRef.current) {
      camera.updateMatrixWorld();
      const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      materialRef.current.uViewProjection.copy(vp);

      const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
      materialRef.current.uCamUp.copy(camUp);

      camera.getWorldPosition(materialRef.current.uCamPos);

      materialRef.current.uVisibility = sunMaterialRef.current.uVisibility;
      materialRef.current.uDirection = sunMaterialRef.current.uDirection;
      materialRef.current.uLightView.copy(sunMaterialRef.current.uLightView);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} frustumCulled={false} renderOrder={2}>
      <glowMaterial 
        ref={materialRef} 
        transparent 
        premultipliedAlpha 
        depthWrite={false} 
        depthTest={false} 
        blending={THREE.NormalBlending} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
};

const SunRays = ({ sunMaterialRef }) => {
  const materialRef = useRef();
  const { camera } = useThree();
  const lineCount = 1024;
  const lineLength = 4;
  const sunRadius = 1.49;

  const geometry = useMemo(() => {
    const totalVerts = lineCount * lineLength * 2;
    const aPos = new Float32Array(totalVerts * 3);
    const aPos0 = new Float32Array(totalVerts * 3);
    const aWireRand = new Float32Array(totalVerts * 4);
    const indices = new Uint16Array(lineCount * (lineLength - 1) * 2 * 3);

    const base = new THREE.Vector3();
    const jitter = new THREE.Vector3();
    const held = new THREE.Vector3();

    const randomUnit = (v) => {
      const z = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - z * z);
      v.set(r * Math.cos(t), r * Math.sin(t), z);
      return v;
    };

    let ip = 0, i0 = 0, ir = 0, ii = 0;
    let d = 0, p = 0;

    for (let v = 0; v < lineCount; v++) {
      if (Math.random() < 0.1 || v === 0) {
        randomUnit(held).normalize();
        d = Math.random();
        p = Math.random();
      }
      base.copy(held);
      randomUnit(jitter).multiplyScalar(0.025);
      base.add(jitter).normalize();

      const rands = [d, p, Math.random(), Math.random()];

      for (let m = 0; m < lineLength; m++) {
        const vertBase = 2 * (v * lineLength + m);
        for (let y = 0; y <= 1; y++) {
          aPos[ip++] = (m + 0.5) / lineLength;
          aPos[ip++] = (v + 0.5) / lineCount;
          aPos[ip++] = 2 * y - 1;

          for (let t = 0; t < 4; t++) aWireRand[ir++] = rands[t];

          aPos0[i0++] = base.x * sunRadius;
          aPos0[i0++] = base.y * sunRadius;
          aPos0[i0++] = base.z * sunRadius;
        }
        if (m < lineLength - 1) {
          const a = vertBase + 0;
          const b = vertBase + 1;
          const c = vertBase + 2;
          const d = vertBase + 3;
          indices[ii++] = a; indices[ii++] = b; indices[ii++] = c;
          indices[ii++] = c; indices[ii++] = b; indices[ii++] = d;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('aPos', new THREE.BufferAttribute(aPos, 3));
    geo.setAttribute('aPos0', new THREE.BufferAttribute(aPos0, 3));
    geo.setAttribute('aWireRandom', new THREE.BufferAttribute(aWireRand, 4));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }, []);

  useFrame((state) => {
    const { camera } = state;
    if (materialRef.current && sunMaterialRef.current) {
      camera.updateMatrixWorld();
      const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      materialRef.current.uViewProjection.copy(vp);
      camera.getWorldPosition(materialRef.current.uCamPos);
      materialRef.current.uTime = state.clock.elapsedTime * 0.05;
      materialRef.current.uVisibility = sunMaterialRef.current.uVisibility;
      materialRef.current.uDirection = sunMaterialRef.current.uDirection;
      materialRef.current.uLightView.copy(sunMaterialRef.current.uLightView);
      materialRef.current.uResolution.set(lineLength, lineCount, 1 / lineLength, 1 / lineCount);
    }
  });

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={3}>
      <sunRaysMaterial 
        ref={materialRef} 
        transparent 
        premultipliedAlpha 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
};

const SunFlares = ({ sunMaterialRef }) => {
  const materialRef = useRef();
  const { camera } = useThree();
  const lineCount = 1024;
  const lineLength = 8;
  const sunRadius = 1.49;

  const geometry = useMemo(() => {
    const aPos = new Float32Array(lineCount * lineLength * 2 * 3);
    const aPos0 = new Float32Array(lineCount * lineLength * 2 * 3);
    const aPos1 = new Float32Array(lineCount * lineLength * 2 * 3);
    const aWireRand = new Float32Array(lineCount * lineLength * 2 * 4);
    const indices = new Uint16Array(lineCount * (lineLength - 1) * 2 * 3);

    const randomUnit = (v) => {
      const z = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - z * z);
      v.set(r * Math.cos(t), r * Math.sin(t), z);
      return v;
    };

    let ip = 0, i0 = 0, i1 = 0, ir = 0, ii = 0;
    for (let v = 0; v < lineCount; v++) {
      const p0 = randomUnit(new THREE.Vector3()).multiplyScalar(sunRadius);
      const p1 = randomUnit(new THREE.Vector3()).multiplyScalar(sunRadius);
      const rands = [Math.random(), Math.random(), Math.random(), Math.random()];

      for (let m = 0; m < lineLength; m++) {
        const vertBase = 2 * (v * lineLength + m);
        for (let y = 0; y <= 1; y++) {
          aPos[ip++] = m / (lineLength - 1);
          aPos[ip++] = v / lineCount;
          aPos[ip++] = 2 * y - 1;

          aPos0[i0++] = p0.x; aPos0[i0++] = p0.y; aPos0[i0++] = p0.z;
          aPos1[i1++] = p1.x; aPos1[i1++] = p1.y; aPos1[i1++] = p1.z;

          for (let t = 0; t < 4; t++) aWireRand[ir++] = rands[t];
        }
        if (m < lineLength - 1) {
          const a = vertBase + 0;
          const b = vertBase + 1;
          const c = vertBase + 2;
          const d = vertBase + 3;
          indices[ii++] = a; indices[ii++] = b; indices[ii++] = c;
          indices[ii++] = c; indices[ii++] = b; indices[ii++] = d;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('aPos', new THREE.BufferAttribute(aPos, 3));
    geo.setAttribute('aPos0', new THREE.BufferAttribute(aPos0, 3));
    geo.setAttribute('aPos1', new THREE.BufferAttribute(aPos1, 3));
    geo.setAttribute('aWireRandom', new THREE.BufferAttribute(aWireRand, 4));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }, []);

  useFrame((state) => {
    const { camera } = state;
    if (materialRef.current && sunMaterialRef.current) {
      camera.updateMatrixWorld();
      const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      materialRef.current.uViewProjection.copy(vp);
      camera.getWorldPosition(materialRef.current.uCamPos);
      materialRef.current.uTime = state.clock.elapsedTime * 0.05;
      materialRef.current.uVisibility = sunMaterialRef.current.uVisibility;
      materialRef.current.uDirection = sunMaterialRef.current.uDirection;
      materialRef.current.uLightView.copy(sunMaterialRef.current.uLightView);
      materialRef.current.uResolution.set(lineLength, lineCount, 1 / lineLength, 1 / lineCount);
    }
  });

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={1}>
      <sunFlaresMaterial 
        ref={materialRef} 
        transparent 
        premultipliedAlpha 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
};

const AdvancedSun = () => {
  const sphereMaterialRef = useRef();
  const perlinMaterialRef = useRef();
  const { gl, scene, camera } = useThree();

  const [cubeRT, cubeCam] = useMemo(() => {
    const res = 512;
    const rt = new THREE.WebGLCubeRenderTarget(res, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      generateMipmaps: false,
    });
    const cam = new THREE.CubeCamera(0.1, 100, rt);
    return [rt, cam];
  }, []);

  const perlinScene = useMemo(() => {
    const s = new THREE.Scene();
    const geo = new THREE.BoxGeometry(2, 2, 2);
    const mat = new PerlinMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.material.side = THREE.BackSide;
    s.add(mesh);
    return { scene: s, mesh };
  }, []);

  useFrame((state) => {
    if (perlinScene.mesh.material) {
      perlinScene.mesh.material.uTime = state.clock.elapsedTime * 0.005;
      cubeCam.update(gl, perlinScene.scene);
    }
    if (sphereMaterialRef.current) {
      sphereMaterialRef.current.uTime = state.clock.elapsedTime * 0.05;
      sphereMaterialRef.current.uPerlinCube = cubeRT.texture;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <sunSphereMaterial 
          ref={sphereMaterialRef} 
          transparent 
          premultipliedAlpha 
          blending={THREE.NormalBlending} 
          depthWrite={true} 
        />
      </mesh>
      <SunGlow sunMaterialRef={sphereMaterialRef} />
      <SunRays sunMaterialRef={sphereMaterialRef} />
      <SunFlares sunMaterialRef={sphereMaterialRef} />
      <pointLight intensity={10} distance={100} color="#ffcc00" />
    </group>
  );
};

export default AdvancedSun;
