import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial, Environment, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';



 export default function FluidBubble() {
  return (
    <>
      <Environment preset="city" />
      <BackgroundText />
      <BackgroundGradient />
      <BubbleMesh />
      <DottedRings />
    </>
  );
}

function BubbleMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);

  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  const hasHover = useRef(false);
  const originalPositions = useRef<Float32Array | null>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    const geometry = meshRef.current.geometry as THREE.SphereGeometry;
    const pos = geometry.attributes.position;

    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(pos.array);
    }

    for (let i = 0; i < pos.count; i++) {
      const i3 = i * 3;

      const ox = originalPositions.current[i3];
      const oy = originalPositions.current[i3 + 1];
      const oz = originalPositions.current[i3 + 2];

      const vertex = new THREE.Vector3(ox, oy, oz);
      const normal = vertex.clone().normalize();

      let displacement = 0;

      if (hasHover.current) {
        const worldVertex = vertex.clone().applyMatrix4(meshRef.current.matrixWorld);
        const distance = worldVertex.distanceTo(hoverPoint.current);

        // Water tension falloff
        const tension = Math.exp(-distance * 6);

        // Ripple motion
        displacement =
          tension *
          Math.sin(distance * 12 - time * 6) *
          0.12;
      }

      // Soft idle breathing
      displacement += Math.sin(time + vertex.y * 4) * 0.015;

      vertex.addScaledVector(normal, displacement);

      pos.array[i3] = vertex.x;
      pos.array[i3 + 1] = vertex.y;
      pos.array[i3 + 2] = vertex.z;
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    if (materialRef.current) {
      materialRef.current.distortion = hasHover.current ? 0.5 : 0.35;
      materialRef.current.time = time;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={1.1}
      onPointerMove={(e) => {
        hoverPoint.current.copy(e.point);
        hasHover.current = true;
      }}
      onPointerOut={() => {
        hasHover.current = false;
      }}
    >
      <sphereGeometry args={[1, 160, 160]} />

    <MeshTransmissionMaterial
  transmission={0.8}
  thickness={0.5}
  roughness={0.05}              
  ior={1.12}

  attenuationColor="#ffffff"
  attenuationDistance={3}

  chromaticAberration={0.06}
  anisotropy={0.22}
  distortion={0.32}
  distortionScale={0.25}
  temporalDistortion={0.08}
>
  <GradientTexture
    stops={[0.01, 0.01, 0.01]}
colors={["#ffffff", "#dff3ff", "#b6e7ff"]}
    size={1024}
  />
</MeshTransmissionMaterial>


    </mesh>
  );
}


function DottedRings() {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRingRef = useRef<THREE.LineLoop>(null!);
  const outerRingRef = useRef<THREE.LineLoop>(null!);

  // Create the circle geometry once
  const createCircleGeometry = (radius: number) => {
    const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      )
    );
  }
    return new THREE.BufferGeometry().setFromPoints(points);
  };

 
  

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Subtle rotation for the whole group
    groupRef.current.rotation.z = t * 0.05;
    
    // Individual counter-rotations or tilting
    innerRingRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    outerRingRef.current.rotation.y = Math.cos(t * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Inner Dotted Ring */}
      <lineLoop ref={innerRingRef} geometry={createCircleGeometry(1.7)}>
        <lineDashedMaterial 
          color="#1a1a1a" 
          dashSize={0.15} 
          gapSize={500} 
          opacity={0.5} 
          transparent 
        />
      </lineLoop>

      {/* Outer Dotted Ring */}
      <lineLoop ref={outerRingRef} geometry={createCircleGeometry(1.4)}>
        <lineDashedMaterial 
          color="#1a1a1a" 
          dashSize={0.15}  // Smaller dash
          gapSize={500}
          opacity={0.5} 
          transparent 
        />
        
        {/* The small solid dot seen in your screenshot */}
        <mesh position={[0.8, 0, 0]}>
          <circleGeometry args={[0.04, 32]} />
          <meshBasicMaterial color="#444" transparent opacity={0.6} />
        </mesh>
      </lineLoop>
    </group>
  );
}

function BackgroundGradient() {
  const { viewport } = useThree();
  return (
    <mesh scale={[viewport.width * 2, viewport.height * 2, 1]} position={[0, 0, -5]}>
      <planeGeometry />
      <meshBasicMaterial>
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={['#BBCB2E', '#e1eb8a', '#ffffff']}
          size={1024} 
        />
      </meshBasicMaterial>
    </mesh>
  );
}

function BackgroundText() {
  const fontUrl = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';
  const textProps = { 
    font: fontUrl, 
    fontSize: 0.8, 
    color: "#1a1a1a", 
    anchorX: "center" as const, 
    anchorY: "middle" as const, 
    letterSpacing: -0.05, 
    fontWeight: 800 
  };
  
  return (
    <group position={[0, 0, -2]}>
      <Text {...textProps} position={[-2.5, 1.2, 0]}>A DIFFERENT</Text>
      <Text {...textProps} position={[3, 0, 0]}>CREATIVE</Text>
      <Text {...textProps} position={[-2.0, -1.5, 0]}>APPROACH</Text>
    </group>
  );
}