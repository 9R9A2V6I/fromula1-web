"use client" // <--- ADD THIS AT THE TOP OF YOUR page.tsx

import React from 'react';
import { Canvas } from "@react-three/fiber";
import MeteorFireball from "./component/animated_small_compo/MeteorFireball";

export default function Home() {
  return (
    <div className="w-full flex justify-center">
      <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
        <Canvas camera={{ position: [0, 0, 15] }}>
          <ambientLight intensity={0.5} />
          <MeteorFireball />
        </Canvas>
      </div>
    </div>
  );
}