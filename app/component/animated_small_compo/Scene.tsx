
"use client"
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SpiralPlanes from "./SpiralPlanes";


export default function Scene() {
  return (
    <>
     

      <Canvas
        camera={{ position: [0, 8, 10], fov: 60 }}
        style={{ height: "100vh", width: "100vw" }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <SpiralPlanes />
        </Suspense>
      </Canvas>
    </>
  );
}
