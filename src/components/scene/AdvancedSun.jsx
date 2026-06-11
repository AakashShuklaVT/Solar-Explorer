import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { usePlanetContext } from '../../context/PlanetContext';
import { EARTH_RADIUS_KM, GLOBAL_SCALE_DIVISOR } from '../../utils/constants';
import './SunMaterials';
import { PerlinMaterial } from './SunMaterials';


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
  const { sunData } = usePlanetContext();

  const sunScale = useMemo(() => {
    if (sunData && sunData.meanRadius) {
      return (sunData.meanRadius / EARTH_RADIUS_KM) / GLOBAL_SCALE_DIVISOR;
    }
    return 2.5; 
  }, [sunData]);

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
    <group scale={[sunScale, sunScale, sunScale]}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <sunSphereMaterial
          ref={sphereMaterialRef}
          transparent
          premultipliedAlpha
          blending={THREE.NormalBlending}
          depthWrite={true}
          uBrightness={1.2}
          uTint={0.4}
        />
      </mesh>

      <SunRays sunMaterialRef={sphereMaterialRef} />
      <SunFlares sunMaterialRef={sphereMaterialRef} />
      <pointLight intensity={10} distance={100} color="#ffcc00" />
    </group>
  );
};

export default AdvancedSun;
