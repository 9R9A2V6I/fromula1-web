"use client";
import { Suspense, useRef } from "react";

import Blob from "./blob";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Environment,
  RenderTexture,
  Text,
  PerspectiveCamera
} from "@react-three/drei";
import { LayerMaterial, Displace } from "lamina";

const LINE_1 = "acier & inox";
const LINE_2 = "industries";
const SIZE = 14;


export default function FluidBubble2() {
    return (
     <Canvas
      className="w-full h-full"
       gl={{ antialias: false, powerPreference: "high-performance" }}
    >
       <PerspectiveCamera position={[0, 0, 100]} makeDefault />
      <ambientLight intensity={0.6} />
      <Suspense fallback={null}>
        {/* <Bubble /> */}
        <Blob position={[-50, 5, -2]} />
        <Blob position={[-5, 20, 0]} />
        <Blob position={[10, -40, 0]} />
        {/* <Typography /> */}
        <Environment preset="warehouse" />
      </Suspense>
    </Canvas>
    )
}
const Bubble = ()=> {
  const displaceRef = useRef<any>(null);

  const { width } = useThree((state) => state.viewport);

  useFrame((_state, dt) => {
    if (displaceRef.current) {
      displaceRef.current.offset.x += 4 * dt;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[width / 8, 128, 128]} />
      <LayerMaterial
        color="orange"
        lighting="physical"
        transmission={1}
        roughness={0}
        thickness={2}
      >
        <Displace ref={displaceRef} strength={3} scale={0.25} />
      </LayerMaterial>
    </mesh>
  );
};

const Typography = () => {
  const { width, height } = useThree((state) => state.viewport);

  const vw = (size: number): number => (width * size) / 100;
  const vh = (size: number): number => (height * size) / 100;

  return (
    <mesh>
      <planeGeometry args={[width, height, 1]} />
      <meshBasicMaterial>
        <RenderTexture attach="map">
          <color attach="background" args={["hsl(0, 0%, 3%)"]} />
          <Text
            font="/PPNeueMontreal-Light.otf"
            fontSize={vw(SIZE / 7)}
            position={[0, vh(10), 0]}
          >
            {LINE_1}
          </Text>
          <Text
            font="/PPNeueMontreal-Medium.otf"
            fontSize={vw(SIZE)}
            position={[0, 0, 0]}
          >
            {LINE_2}
          </Text>
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};
