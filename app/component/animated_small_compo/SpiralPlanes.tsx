"use client"

import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";

const RADIUS = 5.5;
const COUNT = 42;

export default function SpiralPlanes() {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useLoader(THREE.TextureLoader, "/images/helmet.webp");

  const planes = useMemo(() => {
    return new Array(COUNT).fill(0).map((_, i) => {
      const progress = i / COUNT;
      const angle = progress * Math.PI * 12;

      return {
        position: new THREE.Vector3(
          Math.cos(angle) * RADIUS,
          progress * 20 - 10,
          Math.sin(angle) * RADIUS
        ),
        rotationZ: Math.random() * 0.2 - 0.1,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.rotation.y = t * 0.1;

    groupRef.current.children.forEach((child, i) => {
      const p = i / COUNT;
      const angle = p * Math.PI * 12 + t * 0.4;
      child.position.x = Math.cos(angle) * RADIUS;
      child.position.z = Math.sin(angle) * RADIUS;
      child.lookAt(0, child.position.y, 0);
    });
  });

  return (
    <group ref={groupRef}>
      {planes.map((p, i) => (
        <mesh key={i} position={p.position} rotation-z={p.rotationZ}>
          <planeGeometry args={[3, 2, 10, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
